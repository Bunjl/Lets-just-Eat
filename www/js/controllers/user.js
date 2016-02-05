angular.module('lg.controllers')

.controller('UserCtrl', function($scope,$rootScope,$state, User) {

    $scope.skill = [{skill: 'häsäys'},{skill:"EA1"}];

	$scope.addSkill = function(skill){
		$scope.skill.push({skill: skill});
	};

  	$scope.preference = [{preference: 'sosialisointi'},{preference:"magioinit"}];

	$scope.addPreference = function(preference){
		$scope.preference.push({preference: preference});
	};


});


