angular.module('lg.controllers')
// URL to API that enables cross-origin requests to anywhere
 .value('CORSURL', '//cors-anywhere.herokuapp.com/')
 .value('APIURL', 'https://volontario-server.herokuapp.com/')

.controller('LoginCtrl', function($scope, $cordovaOauth, $q, $localStorage, $ionicLoading, $compile, $http, $timeout, $ionicHistory, $interval,$state, APIURL, CORSURL,LoginService, $ionicPopup) {
  var def = $q.defer();

  $scope.data = {};
  $scope.show = false; 
  $scope.hide = true; 
   $scope.register = function() {
    $state.go('app.register');
   };

  $scope.login = function(){
    $cordovaOauth.google("1086046664141-oh99kc2sfbc3lklpo0k8s171tbjgt68k.apps.googleusercontent.com", ["profile"]).then(function(result) {
        console.log("Response Object -> " + JSON.stringify(result));
        var access_token = result.access_token;
        $scope.getUserInfo(access_token, def);
    }, function(error) {
        console.log("Error -> " + error);
    });
  };
  $scope.getUserInfo = function (access_token, def) {
    var http = $http({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        method: 'GET',
        params: {
            access_token: access_token
        }
    });
    http.then(function (data) {
        console.log(data);
        var user_data = data.data;
        var user = {
            name: user_data.name,
            gender: user_data.gender,
            email: user_data.email,
            google_id: user_data.sub,
            picture: user_data.picture,
            profile: user_data.profile
        };
        console.log(user);
        def.resolve(user);
    });
};
});




