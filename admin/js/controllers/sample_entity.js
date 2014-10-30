var angular = require('angular'),
  _ = require('underscore'),
  common = require('./common');

var SampleEntitiesController = ['$injector', '$scope', '$state', '$stateParams', 'SampleEntityApi',
  function($injector, $scope, $state, $stateParams, SampleEntityApi) {
    var ctrl = this;

    // Inherit shared functionality from the ListController
    $injector.invoke(common.ListController, ctrl, {
      $scope: $scope,
      Api: SampleEntityApi
    });

    // Bootstrap the controller
    ctrl.init();
  }
];

var SampleEntityController = ['$injector', '$scope', '$state', '$stateParams', 'SampleEntityApi',
  function($injector, $scope, $state, $stateParams, SampleEntityApi) {
    var ctrl = this;

    // Inherit shared functionality from the ItemController
    $injector.invoke(common.ItemController, ctrl, {
      $scope: $scope,
      $state: $state,
      $stateParams: $stateParams,
      Api: SampleEntityApi
    });

    // Bootstrap the controller
    ctrl.init();
  }
];

module.exports = {
  SampleEntitiesController: SampleEntitiesController,
  SampleEntityController: SampleEntityController
};