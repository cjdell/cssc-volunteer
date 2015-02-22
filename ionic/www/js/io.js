// Check we can ask for sufficient storage. If we can we can use HTML5 File API
if (navigator.webkitPersistentStorage) {
  var MB = 1024 * 1024;

  // Ask for 250MB storage (or we only get 5MB)
  navigator.webkitPersistentStorage.requestQuota(250 * MB, function(grantedBytes) {
    console.log('Quota granted:', grantedBytes / MB, 'MB');
  }, function(e) {
    console.error('Quota Error', e);
  });
}

angular.module('starter.io', [])

.factory('FileSystem', function($q) {
  window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  window.LocalFileSystem = window.LocalFileSystem || { PERSISTENT: 1 };

  function writeFile(fileName, content) {
    var deferred = $q.defer();

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    return deferred.promise;

    function gotFS(fileSystem) {
      fileSystem.root.getFile(fileName, { create: true, exclusive: false }, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
      fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
      var blob = content;
      if (!(content instanceof Blob)) blob = new Blob([content]);

      writer.onwriteend = wroteData;
      writer.write(blob);

      function wroteData(evt) {
        writer.onwriteend = fileWritten;
        writer.truncate(blob.size);
      }
    }

    function fileWritten(evt) {
      deferred.resolve();
    }

    function fail(error) {
      console.log(error.message || error.code);
      deferred.reject(error);
    }
  }

  function readFile(fileName, readAs) {
    console.log('readFile:', fileName);

    var deferred = $q.defer();

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    return deferred.promise;

    function gotFS(fileSystem) {
      fileSystem.root.getFile(fileName, null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
      fileEntry.file(readFileData, fail);
    }

    function readFileData(file) {
      var reader = new FileReader();
      reader.onloadend = fileReadComplete;

      if (readAs == 'text')     reader.readAsText(file);
      if (readAs == 'dataURL')  reader.readAsDataURL(file);
    }

    function fileReadComplete(evt) {
      deferred.resolve(evt.target.result);
    }

    function fail(error) {
      console.log(error.message || error.code);
      deferred.reject(error);
    }
  }

  function mkdir(path) {
    console.log('mkdir:', path);

    var deferred = $q.defer();

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

    return deferred.promise;

    function gotFS(fileSystem) {
      fileSystem.root.getDirectory(path, { create: true, exclusive: true }, gotDirectoryEntry, fail);
    }

    function gotDirectoryEntry(directoryEntry) {
      deferred.resolve(null);
    }

    function fail(error) {
      if (error.code === 9 || error.code === 12) {
        var err = new Error();
        err.code = 'EEXIST';
        err.errno = 47;
        err.path = path;
        deferred.reject(err);
      }
      else {
        deferred.reject(error);
      }
    }
  };

  function mkdirp(path) {
    console.log('mkdirp:', path);

    var pathComponents = path.split('/');

    return recurse(1);

    function recurse(index) {
      if (pathComponents.length + 1 <= index) return null;

      var path = pathComponents.slice(0, index).join('/');

      return mkdir(path).then(function() {
        return recurse(index + 1);
      }, function(err) {
        if (err.code === 'EEXIST') return recurse(index + 1);
        throw err;
      });
    }
  }

  function downloadFile(url, dest) {
    console.log('downloadFile:', url, dest);

    var deferred = $q.defer();
    var xhr;

    start();

    return deferred.promise;

    function start() {
      xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.onload = onload;
      xhr.send();
    }

    function onload() {
      writeFile(dest, xhr.response).then(function() {
        deferred.resolve(null);
      });
    }
  }

  return {
    writeFile:    writeFile,
    readFile:     readFile,
    mkdir:        mkdir,
    mkdirp:       mkdirp,
    downloadFile: downloadFile
  };

});