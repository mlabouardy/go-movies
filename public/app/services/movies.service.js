var MovieService = function(Restangular){
  var self = this;
  self.getMovies = function(){
    return Restangular.all('/movies').getList();
  };
};

angular.module('app.services')
  .factory('MovieService', MovieService);
