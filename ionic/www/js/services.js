angular.module('starter.services', [])

.factory('Session', function(Restangular) {
  var _api_key = null;

  function setApiKey(api_key) {
    _api_key = api_key;
    Restangular.setDefaultHeaders({ 'Api-Key': api_key });
    localStorage.setItem('api_key', api_key);
  }

  function isSignedIn() {
    return !!_api_key;
  }

  function signOut() {
    _api_key = null;
    Restangular.setDefaultHeaders({ 'Api-Key': null });
  }

  function canResume() {
    return !!localStorage.getItem('api_key');
  }

  function resume() {
    _api_key = localStorage.getItem('api_key');
    Restangular.setDefaultHeaders({ 'Api-Key': localStorage.getItem('api_key') });
  }

  function clearApiKey() {
    _api_key = null;
    Restangular.setDefaultHeaders({ 'Api-Key': null });
    localStorage.removeItem('api_key');
  }

  return {
    setApiKey: setApiKey,
    isSignedIn: isSignedIn,
    canResume: canResume,
    resume: resume,
    clearApiKey: clearApiKey
  };
})

.factory('Auth', function(Restangular, Session, Errors) {
  function signIn(email, password) {
    return Restangular.all('auth/sign-in').post({ Email: email, Password: password })
    .then(function(result) {
      if (typeof result.ApiKey !== 'string') throw new Error('Authentication failed');
      Session.setApiKey(result.ApiKey);
      return result;
    })
    .catch(function(err) {
      throw Errors.errorFromResult(err.data);
    });
  }

  return {
    signIn: signIn
  };
})

.factory('DocumentApi', function(Restangular, Errors) {
  return {
    getAll: function() {
      return Restangular.all('api/documents').getList()
      .catch(function(err) {
        throw Errors.errorFromResult(err.data);
      });
    },
    getOne: function(documentId) {
      return Restangular.one('api/documents', documentId).get()
      .catch(function(err) {
        throw Errors.errorFromResult(err.data);
      });
    }
  };
})

.factory('DocumentStorage', function($q, FileSystem) {
  var _documents = read();

  function read() {
    return FileSystem.readFile('documents.json', 'text')
    .then(function(json) {
      // return [];
      if (json.length === 0) return [];
      return JSON.parse(json);
    })
    .catch(function(err) {
      return [];
    });
  }

  function write(documents) {
    return FileSystem.writeFile('documents.json', JSON.stringify(documents));
  }

  function findById(documents, id) {
    var results = documents.filter(function(doc) { return doc.Id == id });
    if (results.length === 0) return null;
    return results[0];
  }

  function getAll() {
    return _documents;
  }

  function getOne(id) {
    return _documents.then(function(documents) {
      return findById(documents, id);
    });
  }

  function put(doc) {
    return _documents.then(function(documents) {
      var oldDoc = findById(documents, doc.Id);

      if (!oldDoc) {
        documents.push(doc);
      } else {
        var index = documents.indexOf(oldDoc);
        documents[index] = doc;
      }

      return 0;
    });
  }

  function commit() {
    return _documents.then(function(documents) {
      return write(documents);
    });
  }

  return {
    getAll: getAll,
    getOne: getOne,
    put: put,
    commit: commit
  };
})

/**
 * A simple example service that returns some data.
 */
.factory('DocumentService', function($q, FileSystem, DocumentApi, DocumentStorage, Config) {
  function sync() {
    var deferred = $q.defer();

    DocumentApi.getAll()
    .then(checkForUpdatedDocuments)
    .then(function(results) {
      deferred.notify('Retrieved document list');
      return deferred.resolve(results);
    })
    .catch(function(err) {
      return deferred.reject(err);
    });

    return deferred.promise;

    function checkForUpdatedDocuments(documents) {
      var updateComplete = $q.all(documents.map(function(doc) {
        return matchExisting(doc)
        .then(updateDocumentIfRequired)
        .then(updateDocumentStorage);
      }));

      return updateComplete.then(function(results) {
        return DocumentStorage.commit().then(function() {
          return results;
        });
      });
    }

    function matchExisting(newDoc) {
      return DocumentStorage.getOne(newDoc.Id).then(function(oldDoc) {
        return { old: oldDoc, new: newDoc };
      });
    }

    function getThumbSrc(doc) {
      var thumbSrc = null;

      doc.Images.forEach(function(image) {
        if (image.Handle === 'preview') thumbSrc = image.Thumbs.TinySrc;
      });

      return thumbSrc;
    }

    function updateDocumentIfRequired(result) {
      if (result.old && result.old.Version === result.new.Version) return result;

      return $q.all(result.new.Attachments.map(function(attachment) {
        return downloadResource(result.new.Id, attachment.Src, attachment.FileName);
      }))
      .then(function(downloadPaths) {
        result.status = 'updated';
        result.downloadPaths = downloadPaths;
        return result;
      })
      .then(function() {
        return downloadResource(result.new.Id, getThumbSrc(result.new), 'thumb.png');
      })
      .then(function(thumbPath) {
        result.thumbPath = thumbPath;
        return result;
      });
    }

    function downloadResource(docId, src, fileName) {
      if (!src) return null;

      deferred.notify('Downloading ' + fileName);

      var downloadFolder = 'document/' + docId;
      var downloadPath = downloadFolder + '/' + fileName;

      return FileSystem.mkdirp(downloadFolder)
      .then(function() {
        console.log('src:', src);
        return FileSystem.downloadFile(Config.SERVER_BASE_URL + src, downloadPath);
      })
      .then(function() {
        return downloadPath;
      });

      // var deferred = $q.defer();
      // setTimeout(function() {
      //   deferred.resolve(attachment.Name);
      // }, 1000);
      // return deferred.promise;
    }

    function updateDocumentStorage(result) {
      if (result.status !== 'updated') return result;

      deferred.notify('Saving ' + result.new.Name);

      var putDoc = {
        Id: result.new.Id,
        Name: result.new.Name,
        Description: result.new.Description,
        Version: result.new.Version
      };

      if (result.thumbPath) putDoc.ThumbPath = result.thumbPath;

      if (result.downloadPaths.length) putDoc.AttachmentPath = result.downloadPaths[0];

      return DocumentStorage.put(putDoc).then(function(savedDoc) {
        return result;
      });
    }
  }

  return {
    sync: sync,
    getAll: DocumentStorage.getAll,
    getOne: DocumentStorage.getOne
  };
})

.factory('Errors', function() {
  function errorFromResult(result) {
    if (result.Error === 'Authentication required') return new InvalidApiKeyError(result.Error);
    return new Error(result.Error);
  }

  function InvalidApiKeyError(message) {
    this.name = 'InvalidApiKeyError';
    this.message = message;
    this.stack = (new Error()).stack;
  }

  InvalidApiKeyError.prototype = new Error;

  return {
    errorFromResult: errorFromResult,
    InvalidApiKeyError: InvalidApiKeyError
  };
});

