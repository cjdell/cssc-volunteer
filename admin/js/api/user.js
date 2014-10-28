module.exports = ['$http', 'Restangular',
  function($http, Restangular) {
    var service = Restangular.service('api/users');

    return {
      EntityNames: {
        SingularPascalCase: 'User',
        PluralPascalCase: 'Users',
        SingularCamelCase: 'user',
        PluralCamelCase: 'users',
        SingularSnakeCase: 'user',
        PluralSnakeCase: 'users'
      },
      GetAll: function(args) {
        return service.getList();
      },
      GetOne: function(id) {
        return service.one(id).get();
      },
      Post: function(user) {
        return service.post(user);
      },
      Put: function(user) {
        return user.put();
      },
      Delete: function(user) {
        return user.remove();
      }
    };
  }
];