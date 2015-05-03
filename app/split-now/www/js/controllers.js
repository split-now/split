angular.module('split.controllers', ['split.services'])

  .config(function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('ScanReceipt', function ($scope, Camera, $ionicSideMenuDelegate) {

    var canvas = document.getElementById('receipt-image');
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight;

    $scope.scanReceipt = function () {
      Camera.getPicture({
        quality: 75,
        correctOrientation: true,
        saveToPhotoAlbum: true
      }).then(function (imageURI) {
        console.log(imageURI);
        $ionicSideMenuDelegate.canDragContent(false)

        var canvas = document.getElementById('receipt-image');
        var context = canvas.getContext('2d');
        var receiptImage = new Image();
        receiptImage.onload = function() {
          var newImageHeight = (canvas.width*receiptImage.height)/receiptImage.width;
          context.drawImage(receiptImage, 0, 0, receiptImage.width, receiptImage.height, 0, 0, canvas.width, newImageHeight);
        };
        receiptImage.src = imageURI;

      }, function (err) {
        console.err(err);
      });
    };

  })

  // template

  .controller('PlaylistsCtrl', function ($scope) {
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  });
