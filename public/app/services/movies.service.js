var MovieService = function(Restangular){
  var self = this;
  self.getMovies = function(){
    return Restangular.get('/movies');
  }
}

angular.module('app.services')
  .factory('MovieService', MovieService);
