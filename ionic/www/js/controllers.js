angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('DocumentsCtrl', function($scope, Documents) {
  Documents.all().then(function(documents) {
    $scope.documents = documents
  });

  $scope.downloadAttachment = function(attachment) {
    window.open(attachment.Src);
  };
})

.controller('DocumentDetailCtrl', function($scope, $stateParams, Documents) {
  Documents.get($stateParams.documentId).then(function(document) {
    $scope.document = document
  });

  $scope.downloadAttachment = function(attachment) {
    window.open(attachment.Src);
  };
})

.controller('AccountCtrl', function($scope) {
});
