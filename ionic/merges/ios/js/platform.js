angular.module('starter.platform', [])

.factory('Platform', function() {
  function getDeviceUrl(path) {
    return 'cdvfile://localhost/persistent/' + path;
  }

  function openFile(path, callback) {
    return cordova.plugins.fileOpener2.open(
      getDeviceUrl(path),
      null, {
        error : function(e) {
          console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
          if (callback) return callback(e);
        },
        success : function () {
          console.log('file opened successfully');
          if (callback) return callback(null);
        }
      }
    );
  }

  return {
    getDeviceUrl: getDeviceUrl,
    openFile: openFile
  };
});
