module.exports = ['$http', 'Restangular', function($http, Restangular) {
    var service = Restangular.service('api/sample_entities');

    return {
      EntityNames: {
        SingularPascalCase: 'SampleEntity',
        PluralPascalCase: 'SampleEntities',
        SingularCamelCase: 'sampleEntity',
        PluralCamelCase: 'sampleEntities',
        SingularSnakeCase: 'sample_entity',
        PluralSnakeCase: 'sample_entities'
      },
      getAll: function(args) {
        return service.getList();
      },
      getOne: function(id) {
        return service.one(id).get();
      },
      post: function(sampleEntity) {
        return service.post(sampleEntity);
      },
      put: function(sampleEntity) {
        return sampleEntity.put();
      },
      delete: function(sampleEntity) {
        return sampleEntity.remove();
      }
    };
  }
];