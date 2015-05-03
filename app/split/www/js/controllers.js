angular.module('split.controllers', ['split.services'])

  .config(function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  })

  .controller('AppCtrl', function ($scope, $ionicModal, $rootScope) {

    $ionicModal.fromTemplateUrl('templates/receiver.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $rootScope.enterReceiverMode = function () {
      $scope.modal.show();
    };
    $rootScope.exitReceiverMode = function () {
      $scope.modal.hide();
    };
  })

  .controller('LoginCtrl', function ($scope, $rootScope, $state, $timeout) {

    $rootScope.isLoggedIn = false;

    $rootScope.socket = io.connect('http://104.245.38.179:3000/');

    $rootScope.socket.on('update-friends', function (data) {
      console.log(data);
    });

    $scope.doLogin = function (username) {

      $rootScope.username = username;
      $rootScope.socket.emit('login', { username: $rootScope.username });

      $rootScope.socket.on('new-friends', function (data) {

        $rootScope.isLoggedIn = true;
        $rootScope.$digest();

        $rootScope.friends = data.friends;
        console.log('login successful. friends: ', $rootScope.friends);

        // set current user full name
        for (var i in $rootScope.friends) {
          if ($rootScope.friends[i].username === $rootScope.username) {
            $rootScope.name = $rootScope.friends[i].name;
            console.log($rootScope.name);
            $scope.currentUserName = $rootScope.name.split(' ').slice(0, -1).join(' ');
            $rootScope.$digest();
          }
        }
      });
    };

    $rootScope.socket.on('master', function (data) {
      console.log('master is: ' + data.username);
      if (data.username !== $rootScope.username) {
        $rootScope.enterReceiverMode();
        console.log('show modal!!');
      }
      console.log('login successful! friends: ', $rootScope.friends);
    });

    $scope.startSplit = function () {

      navigator.notification.alert('Cool, just ask your friends to open SPLIT on their phones and let me know when they are ready!', function () {
        $rootScope.socket.emit('master', { username: $rootScope.username });
        $state.transitionTo('tab.findfriends');
      }, 'SPLIT STARTED', 'OK, they are ready!');
    };

  })

  .controller('FindFriendsCtrl', function ($scope, $rootScope, $http, $state) {

    $scope.sendSMS = function (friend, item) {
      if (item.checked == true) {

        var message = 'You%20have%20been%20selected%20by%20your%20friend%20' + $rootScope.name.split(' ').slice(0, -1).join(' ') + '%20to%20split%20a%20bill!';

        $http({
          method: 'GET',
          url: 'http://104.245.38.179:3000/nexmo?msg=' + message + '&tel=' + friend.phone
        });
      }
    };

    $scope.selectFriends = function () {

      $state.transitionTo('tab.scanreceipt');

    };
  })

  .controller('ScanReceiptCtrl', function ($scope, Camera) {
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

        var canvas = document.getElementById('receipt-image');
        var context = canvas.getContext('2d');
        var receiptImage = new Image();
        receiptImage.onload = function () {
          var newImageHeight = (canvas.width * receiptImage.height) / receiptImage.width;
          context.drawImage(receiptImage, 0, 0, receiptImage.width, receiptImage.height, 0, 0, canvas.width, newImageHeight);
        };
        receiptImage.src = imageURI;

      }, function (err) {
        console.err(err);
      });
    };
  })

  .controller('PayCtrl', function ($scope) {

    $scope.chargeFriends = function () {

    };

    $scope.payMainBill = function () {
      console.log('test');
      window.open('http://104.245.38.179:3000/showmethemoney', 'mastercard');
    };

  });






