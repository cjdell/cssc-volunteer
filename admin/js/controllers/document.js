var angular = require('angular'),
  _ = require('underscore'),
  common = require('./common');

var DocumentsController = ['$injector', '$scope', '$state', '$stateParams', 'DocumentApi',
  function($injector, $scope, $state, $stateParams, DocumentApi) {
    var ctrl = this;

    // Inherit shared functionality from the ListController
    $injector.invoke(common.ListController, ctrl, {
      $scope: $scope,
      Api: DocumentApi
    });

    // Bootstrap the controller
    ctrl.init();
  }
];

var DocumentController = ['$injector', '$scope', '$state', '$stateParams', 'DocumentApi',
  function($injector, $scope, $state, $stateParams, DocumentApi) {
    var ctrl = this;

    // Inherit shared functionality from the ItemController
    $injector.invoke(common.ItemController, ctrl, {
      $scope: $scope,
      $state: $state,
      $stateParams: $stateParams,
      Api: DocumentApi
    });

    $scope.$on('item-saving', (e, record, promises) => {
      promises.push($scope.newImage().then(savedFileName => {
        record.Changes.NewImageFileName = savedFileName;
      }));

      promises.push($scope.newAttachment().then(savedFileName => {
        record.Changes.NewAttachmentFileName = savedFileName;
      }));
    });

    // Bootstrap the controller
    ctrl.init();
  }
];

module.exports = {
  DocumentsController: DocumentsController,
  DocumentController: DocumentController
};