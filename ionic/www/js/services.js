angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Documents', function(Restangular) {
  return {
    all: function() {
      return Restangular.all('api/documents').getList();
    },
    get: function(documentId) {
      return Restangular.one('api/documents', documentId).get();
    }
  };
});
