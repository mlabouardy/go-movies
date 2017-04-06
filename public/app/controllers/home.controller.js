angular.module('app.controllers')
  .controller('MainCtrl', function(MovieService){
    console.log('MainCtrl');
    MovieService.getMovies().then(function(res){
      console.log(res)
    })
  })
