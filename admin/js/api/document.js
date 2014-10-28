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
      GetAll: function(args) {
        return service.getList();
      },
      GetOne: function(id) {
        return service.one(id).get();
      },
      Post: function(document) {
        return service.post(document);
      },
      Put: function(document) {
        return document.put();
      },
      Delete: function(document) {
        return document.remove();
      }
    };
  }
];