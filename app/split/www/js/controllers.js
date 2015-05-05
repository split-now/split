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

      $rootScope.receiverNumber = '0.00';

      $rootScope.socket.on('item', function (data) {
        if ($rootScope.username === data.username) {
          $rootScope.receiverNumber = data.amount;
          $rootScope.$digest();
        }
      });

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

  .controller('ScanReceiptCtrl', function ($scope, Camera, $rootScope, $state) {

    dragula([single1], { removeOnSpill: true }).on('remove', function (el) {

      console.log(el.innerHTML);

      if (el.innerHTML.indexOf('Tea') !== -1) {
        $rootScope.socket.emit('ice tea', { username: $rootScope.username });
        navigator.notification.alert('Iced Tea - $3.99 sent to Cassidy!', function () {

        }, 'Amount submitted', 'OK');
      } else {
        $rootScope.socket.emit('calamari', { username: $rootScope.username });
        navigator.notification.alert('Calamari - $10.79 sent to Justin!', function () {
          $state.transitionTo('tab.pay');
        }, 'Amount submitted', 'OK');
      }

    });

    var canvas = document.getElementById('receipt-image');
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight;

    $scope.isListVisible = false;

    $scope.doneScanning = function () {
      $scope.isListVisible = true;
    };

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
        var drag = false;
        var rect = {};
        var touch;
        var newImageHeight;

        receiptImage.onload = function () {
          newImageHeight = (canvas.width * receiptImage.height) / receiptImage.width;
          context.drawImage(receiptImage, 0, 0, receiptImage.width, receiptImage.height, 0, 0, canvas.width, newImageHeight);

          $scope.$digest();
        };
        receiptImage.src = imageURI;

        canvas.addEventListener('touchstart', handleTouch, false);
        canvas.addEventListener('touchmove', handleTouch, false);
        canvas.addEventListener('touchleave', handleEnd, false);
        canvas.addEventListener('touchend', handleEnd, false);

        function handleTouch(event) {
          if (event.targetTouches.length === 1) {
            touch = event.targetTouches[0];

            if (event.type == 'touchmove') {
              if (drag) {
                rect.w = touch.pageX - rect.startX;
                rect.h = touch.pageY - rect.startY;
                draw();
              }
            } else {
              rect.startX = touch.pageX;
              rect.startY = touch.pageY;
              drag = true;
            }
          }
        }

        function handleEnd(event) {
          drag = false;
//    saveRegion(imgObj);
        }

        function draw() {
          drawImageOnCanvas();
          context.strokeStyle = 'green';
          context.strokeRect(rect.startX, rect.startY - 90, rect.w, rect.h);
          context.fillStyle = 'rgba(0, 100, 255, 0.1)';
          context.fillRect(rect.startX, rect.startY - 90, rect.w, rect.h);
        }

        function drawImageOnCanvas() {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(receiptImage, 0, 0, receiptImage.width, receiptImage.height, 0, 0, canvas.width, newImageHeight);
        }

      }, function (err) {
        console.err(err);
      });
    };
  })

  .controller('PayCtrl', function ($scope, $http) {

    $scope.isCharged = false;

    $scope.chargeFriends = function () {

      $http({
        method: 'GET',
        url: 'http://104.245.38.179:3000/charge'
      });

      $scope.isCharged = true;

    };

    $scope.payMainBill = function () {
      console.log('test');
      window.open('http://104.245.38.179:3000/showmethemoney', 'mastercard');
    };

  });






