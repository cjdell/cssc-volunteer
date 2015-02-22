module.exports = ['$rootScope',
  function($rootScope) {
    $rootScope.errorHandler = function(err) {
      if (err && err.data && typeof err.data.Error === 'string') {
        alert(err.data.Error);
      } else {
        alert(JSON.stringify(err));
      }
    };
  }
];