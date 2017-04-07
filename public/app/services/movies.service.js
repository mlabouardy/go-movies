var MovieService = function(Restangular){
  var self = this;
  Restangular.setBaseUrl('http://localhost:5000')
  self.getMovies = function(){
    return Restangular.all('movies').getList();
  };

  return self;
};

angular.module('app.services')
  .factory('MovieService', MovieService);
