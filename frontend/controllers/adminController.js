// Controlador de administración
app.controller('AdminController', function($scope, DataService) {
    // Inicialización de variables
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];
    $scope.currentView = 'users';
    $scope.newItem = {};

    // Cargar usuarios
    $scope.loadUsers = function() {
        DataService.getUsers().then(function(users) {
            $scope.users = users;
        });
    };

    // Cargar categorías
    $scope.loadCategories = function() {
        DataService.getCategories().then(function(categories) {
            $scope.categories = categories;
        });
    };

    // Cargar videos
    $scope.loadVideos = function() {
        DataService.getVideos().then(function(videos) {
            $scope.videos = videos;
        });
    };

    // Crear un nuevo elemento
    $scope.createItem = function() {
        if ($scope.currentView === 'users') {
            DataService.createUser($scope.newItem).then(function() {
                $scope.loadUsers();
                $scope.newItem = {};
            });
        } else if ($scope.currentView === 'categories') {
            DataService.createCategory($scope.newItem).then(function() {
                $scope.loadCategories();
                $scope.newItem = {};
            });
        } else if ($scope.currentView === 'videos') {
            DataService.createVideo($scope.newItem).then(function() {
                $scope.loadVideos();
                $scope.newItem = {};
            });
        }
    };

    // Actualizar un elemento
    $scope.updateItem = function(item) {
        if ($scope.currentView === 'users') {
            DataService.updateUser(item).then($scope.loadUsers);
        } else if ($scope.currentView === 'categories') {
            DataService.updateCategory(item).then($scope.loadCategories);
        } else if ($scope.currentView === 'videos') {
            DataService.updateVideo(item).then($scope.loadVideos);
        }
    };

    // Eliminar un elemento
    $scope.deleteItem = function(item) {
        if ($scope.currentView === 'users') {
            DataService.deleteUser(item.id).then($scope.loadUsers);
        } else if ($scope.currentView === 'categories') {
            DataService.deleteCategory(item.id).then($scope.loadCategories);
        } else if ($scope.currentView === 'videos') {
            DataService.deleteVideo(item.id).then($scope.loadVideos);
        }
    };

    // Cambiar la vista actual
    $scope.changeView = function(view) {
        $scope.currentView = view;
        if (view === 'users') $scope.loadUsers();
        else if (view === 'categories') $scope.loadCategories();
        else if (view === 'videos') $scope.loadVideos();
    };

    // Inicializar la vista con usuarios
    $scope.changeView('users');
});