angular.module('starter.platform', [])

.factory('Platform', function() {
  function getDeviceUrl(path) {
    return 'filesystem:' + location.origin + '/persistent/' + path;
  }

  function openFile(path, callback) {
    window.open(getDeviceUrl(path));
    if (callback) return callback(null);
  }

  return {
    getDeviceUrl: getDeviceUrl,
    openFile: openFile
  };
});
