angular.module('app.controllers')
  .controller('MainCtrl', function(MovieService, $scope){
    $scope.movies = [];
    MovieService.getMovies().then(function(res){
      console.log(res.plain());
    });
  });
