var MovieService = function($http){
  var self = this;
  self.getMovies = function(){
    return $http.get('http://localhost:5000');
  };

  return self;
};

angular.module('app.services')
  .factory('MovieService', MovieService);
