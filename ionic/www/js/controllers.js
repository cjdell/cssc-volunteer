angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope, $state, Session, Auth) {
  $scope.user = {};

  if (Session.canResume()) {
    Session.resume();
    return $state.go('tab.dash');
  }

  $scope.signIn = function() {
    if (!$scope.user.email) {
      return $scope.errorHandler({ type: 'Validation', message: 'Please enter your email address' });
    }

    if (!$scope.user.password) {
      return $scope.errorHandler({ type: 'Validation', message: 'Please enter your password' });
    }

    return Auth.signIn($scope.user.email, $scope.user.password)
    .then(function(result) {
      return $state.go('tab.dash');
    })
    .catch($scope.errorHandler);
  };
})

.controller('DashCtrl', function($scope, DocumentService) {
  $scope.syncButtonText = 'Check for updates';

  $scope.sync = function() {
    $scope.syncButtonText = 'Synchronising...';

    console.time('sync');
    var p = DocumentService.sync().then(function(result) {
      $scope.syncButtonText = 'Check for updates';
      $scope.progress = 'Update complete';

      console.timeEnd('sync');
      console.log('result:', result);
    }, function(err) {
      $scope.syncButtonText = 'Update error!';

      return $scope.errorHandler(err);
    }, function(progress) {
      $scope.progress = progress;
    });
  };
})

.controller('DocumentsCtrl', function($scope, DocumentService) {
  DocumentService.getAll().then(function(documents) {
    $scope.documents = documents;
  })
  .catch($scope.errorHandler);

  // $scope.downloadAttachment = function(document) {
  //   window.open(getDeviceUrl(document.AttachmentPath));
  // };
})

.controller('DocumentDetailCtrl', function($scope, $stateParams, DocumentService, Platform) {
  DocumentService.getOne($stateParams.documentId).then(function(document) {
    $scope.document = document;
    console.log(document);
  })
  .catch($scope.errorHandler);

  $scope.downloadAttachment = function() {
    Platform.openFile($scope.document.AttachmentPath);
  };
});
