// Servicio de Datos
app.service('DataService', function($http, AuthService) {
    var API_URL = 'http://localhost:3000/api';

    // Función para obtener los headers de autorización
    var getHeaders = function() {
        return { headers: { 'Authorization': 'Bearer ' + AuthService.getToken() } };
    };

    // Funciones para manejar usuarios
    this.getUsers = function() {
        return $http.get(API_URL + '/users', getHeaders()).then(function(response) {
            return response.data;
        });
    };

    this.createUser = function(user) {
        return $http.post(API_URL + '/users', user, getHeaders());
    };

    this.updateUser = function(user) {
        return $http.put(API_URL + '/users/' + user.id, user, getHeaders());
    };

    this.deleteUser = function(userId) {
        return $http.delete(API_URL + '/users/' + userId, getHeaders());
    };

    // Funciones para manejar categorías
    this.getCategories = function() {
        return $http.get(API_URL + '/categories', getHeaders()).then(function(response) {
            return response.data;
        });
    };

    this.createCategory = function(category) {
        return $http.post(API_URL + '/categories', category, getHeaders());
    };

    this.updateCategory = function(category) {
        return $http.put(API_URL + '/categories/' + category.id, category, getHeaders());
    };

    this.deleteCategory = function(categoryId) {
        return $http.delete(API_URL + '/categories/' + categoryId, getHeaders());
    };

    // Funciones para manejar videos
    this.getVideos = function() {
        return $http.get(API_URL + '/videos', getHeaders()).then(function(response) {
            return response.data;
        });
    };

    this.createVideo = function(video) {
        return $http.post(API_URL + '/videos', video, getHeaders());
    };

    this.updateVideo = function(video) {
        return $http.put(API_URL + '/videos/' + video.id, video, getHeaders());
    };

    this.deleteVideo = function(videoId) {
        return $http.delete(API_URL + '/videos/' + videoId, getHeaders());
    };

    // Función para obtener videos por categoría
    this.getVideosByCategory = function(categoryId) {
        return $http.get(API_URL + '/videos/category/' + categoryId, getHeaders()).then(function(response) {
            return response.data;
        });
    };
});