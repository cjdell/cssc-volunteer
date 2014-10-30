module.exports = ['$http', 'Restangular',
  function($http, Restangular) {
    var service = Restangular.service('api/documents');

    return {
      EntityNames: {
        SingularPascalCase: 'Document',
        PluralPascalCase: 'Documents',
        SingularCamelCase: 'document',
        PluralCamelCase: 'documents',
        SingularSnakeCase: 'document',
        PluralSnakeCase: 'documents'
      },
      getAll: function(args) {
        return service.getList();
      },
      getOne: function(id) {
        return service.one(id).get();
      },
      post: function(document) {
        return service.post(document);
      },
      put: function(document) {
        return document.put();
      },
      delete: function(document) {
        return document.remove();
      }
    };
  }
];