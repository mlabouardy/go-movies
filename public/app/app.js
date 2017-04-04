var MainCtrl = function($scope, $http){
  $scope.refresh = function(){
    $http.get("/movies").then(function(results){
      console.log(results);
    })
  }
}

angular.module('app', [])
  .controller('MainCtrl', MainCtrl)
