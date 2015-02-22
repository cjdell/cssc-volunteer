angular.module('starter.services', [])

.factory('DocumentApi', function(Restangular) {
  return {
    getAll: function() {
      return Restangular.all('api/documents').getList();
    },
    getOne: function(documentId) {
      return Restangular.one('api/documents', documentId).get();
    }
  };
})

.factory('DocumentStorage', function($q, FileSystem) {
  // $q.resolve = function(value) {
  //   var deferred = $q.defer();
  //   deferred.resolve(value);
  //   return deferred.promise;
  // };

  var documentsPromise = null;

  readFileOnce();

  function readFileOnce() {
    return documentsPromise = readFile();
  }

  function readFile() {
    return FileSystem.readFile('documents.json', 'text').then(function(json) {
      return JSON.stringify(json);
    }, function(err) {
      return [];
    });
  }

  function writeFile(documents) {
    return FileSystem.writeFile('documents.json', JSON.stringify(documents));
  }

  function findById(documents, id) {
    var results = documents.filter(function(doc) { return doc.Id === id });
    if (results.length === 0) return null;
    return results[0];
  }

  return {
    getAll: function() {
      return documentsPromise;
    },
    compare: function(newDoc) {
      return documentsPromise.then(function(documents) {
        var existingDoc = findById(documents, newDoc.Id);
        return { doc: newDoc, current: existingDoc && existingDoc.Version === newDoc.Version };
      });
    },
    update: function(newDoc) {
      return documentsPromise.then(function(documents) {
        var existingDoc = findById(documents, newDoc.Id);
        var index = documents.indexOf(existingDoc);

        var insertDoc = {
          Id: newDoc.Id,
          Name: newDoc.Name,
          Version: newDoc.Version
        };

        if (index === -1) {
          documents.push(insertDoc);
        } else {
          documents[index] = insertDoc;
        }

        return insertDoc;
      });
    }
  };
})

/**
 * A simple example service that returns some data.
 */
.factory('DocumentService', function($q, DocumentApi, DocumentStorage) {
  function checkForUpdatedDocuments(documents) {
    return $q.all(documents.map(function(doc) {
      return DocumentStorage.compare(doc).then(updateDocumentIfRequired).then(updateDocumentStorage);
    }));
  }

  function updateDocumentIfRequired(result) {
    if (result.current) return { doc: result.doc, status: 'current' };

    return $q.all(result.doc.Attachments.map(downloadAttachment)).then(function(downloaded) {
      return { doc: result.doc, status: 'updated', downloaded: downloaded };
    });
  }

  function downloadAttachment(attachment) {
    var deferred = $q.defer();
    setTimeout(function() {
      deferred.resolve(attachment.Name);
    }, 1000);
    return deferred.promise;
  }

  function updateDocumentStorage(result) {
    if (result.status === 'current') return result;

    return DocumentStorage.update(result.doc).then(function(savedDoc) {
      return result;
    });
  }

  return {
    sync: function() {
      return DocumentApi.getAll().then(checkForUpdatedDocuments);
    },
    getAll: function() {
      return DocumentApi.getAll();
    },
    getOne: function(documentId) {
      return DocumentApi.getOne(documentId);
    }
  };
});
