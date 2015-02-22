(function() {

  var UPDATE_BASE_URL = 'http://cssc-volunteer.chrisdell.info/ionic/build/ios';

  var isCordova = typeof cordova !== 'undefined';

  if (isCordova) {
    document.addEventListener('deviceready', checkForUpdate, false);
  } else {
    window.addEventListener('load', checkForUpdate);
  }

  var fs = CordovaPromiseFS({
    persistent: true,
    storageSize: 50 * 1024 * 1024, // storage size in bytes, default 20MB
    concurrency: 1 // how many concurrent uploads/downloads?
  });

  var debugDiv, errorDiv, progressBar;
  var jobs, done, running = false;

  document.addEventListener('click', function() {
    // For some reason, the downloader would not attempt again unless the page was freshly loaded
    if (!running) location.reload();
  });

  function checkForUpdate() {
    if (running) return;

    running = true;

    debugDiv = document.getElementById('debug');
    errorDiv = document.getElementById('error');
    progressBar = document.getElementById('progress-bar');

    jobs = 0; done = 0;

    var manifestUrl = UPDATE_BASE_URL + '/manifest.json';

    var oldManifest = null, newManifest = null, fileExistence = {}, successfulFiles, failedFiles;

    if (window.localStorage.manifest) {
      try {
        oldManifest = JSON.parse(window.localStorage.manifest);
        manifestUrl = oldManifest.manifestUrl || manifestUrl;
      } catch (e) {
        oldManifest = null;
      }
    }

    return xhr({ url: manifestUrl })
    .timeout(5000)
    .then(function(newManifestJson) {
      return newManifest = JSON.parse(newManifestJson);
    })
    .then(function() {
      return Promise.all(Object.keys(newManifest.files)
      .map(function(fileKey) {
        return fs.exists(fileKey)
        .then(function(exists) {
          fileExistence[fileKey] = !!exists;
        });
      }))
    })
    .then(function() {
      return Promise.all(Object.keys(newManifest.files)
      // Find files that have changed version or are missing
      .filter(function(fileKey) {
        return oldManifest === null || !oldManifest.files[fileKey] || fileExistence[fileKey] === false || oldManifest.files[fileKey].version !== newManifest.files[fileKey].version;
      })
      .map(function(fileKey) {
        jobs++; return downloadFile(newManifest, fileKey);
      }));
    })
    .then(function(files) {
      successfulFiles = files.filter(function(file) { return typeof file.deviceUrl === 'string'; } );
      failedFiles = files.filter(function(file) { return file.deviceUrl === null; } );

      console.log('Files Downloaded Successfully:', successfulFiles);
      if (failedFiles.length) console.error('Files Failed:', failedFiles);

      var indexFileMatches = files.filter(function(file) { return file.relPath === 'index.html'; } );

      if (indexFileMatches.length > 0) {
        var indexFile = indexFileMatches[0];
        newManifest.startUrl = indexFile.deviceUrl;
      } else if (oldManifest !== null) {
        newManifest.startUrl = oldManifest.startUrl;
      }

      newManifest.downloaded = failedFiles.length === 0;

      // Remove failed files from the new manifest before we save, so we remember that we still need them
      failedFiles.forEach(function(file) {
        delete newManifest.files[file.relPath];
      });

      window.localStorage.manifest = JSON.stringify(newManifest);

      if (!newManifest.startUrl) throw new Error('No start URL');
      if (!newManifest.downloaded) throw new Error('Some files failed to download');

      loadApp(newManifest.startUrl);
    })
    .catch(function(e) {
      running = false;

      console.error('Download error:', e);
      errorDiv.innerHTML += 'ERROR: (' + (e.message || e) + ')<br />URL:' + UPDATE_BASE_URL + '<br />';

      var canLoadApp = jobs === 0 && oldManifest !== null && oldManifest.downloaded === true && typeof oldManifest.startUrl === 'string';

      if (!canLoadApp) {
        alert('Failed to download the app: ' + (e.message || e) + '\n\nTap the screen to try again.');
      } else {
        loadApp(oldManifest.startUrl);
      }
    });
  }

  function downloadFile(newManifest, relPath) {
    var fileUrl = UPDATE_BASE_URL + '/' + relPath;

    return fs.download(fileUrl, relPath)
    .timeout(30000)
    .then(function() {
      debugDiv.innerHTML += relPath + '<br />';
      return fs.toInternalURL(relPath);
    })
    .then(function(deviceUrl) {
      done++; updateProgressBar();

      return {
        relPath: relPath,
        deviceUrl: deviceUrl
      };
    })
    .catch(function(e) {
      errorDiv.innerHTML += 'FAILED: ' + relPath + ' (' + (e.message || e) + ')<br />';
      return {
        relPath: relPath,
        deviceUrl: null
      };
    });
  }

  function updateProgressBar() {
    console.log(done, jobs);
    progressBar.style.width = (100 * done / jobs) + '%';
  }

  function loadApp(url) {
    localStorage.loaderBaseUrl = location.href.replace('/loader.html', '');
    window.location = url;
    // alert(url);
  }

})();
