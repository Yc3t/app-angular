// Controlador de usuario
app.controller('UserController', function($scope, DataService) {
    // Inicialización de variables
    $scope.categories = [];
    $scope.selectedCategory = null;

    // Cargar categorías
    $scope.loadCategories = function() {
        DataService.getCategories().then(function(categories) {
            $scope.categories = categories;
            $scope.loadAllVideos();
        });
    };

    // Cargar todos los videos
    $scope.loadAllVideos = function() {
        DataService.getVideos().then(function(videos) {
            $scope.videos = videos;
        });
    };

    // Filtrar videos por categoría
    $scope.filterByCategory = function(categoryId) {
        $scope.selectedCategory = categoryId;
        if (categoryId) {
            // Si se selecciona una categoría, obtener videos de esa categoría
            DataService.getVideosByCategory(categoryId).then(function(videos) {
                $scope.videos = videos;
            });
        } else {
            // Si no hay categoría seleccionada, cargar todos los videos
            $scope.loadAllVideos();
        }
    };

    // Inicializar cargando las categorías
    $scope.loadCategories();
});