app.controller('AdminController', function($scope, DataService) {
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];
    $scope.currentView = 'users';
    $scope.newItem = {};
    $scope.editItem = {};

    // usuarios
    $scope.loadUsers = function() {
        DataService.getUsers().then(function(users) {
            $scope.users = users;
        }).catch(function(error) {
            console.error('Error loading users:', error);
        });
    };

    // categorias
    $scope.loadCategories = function() {
        DataService.getCategories().then(function(categories) {
            $scope.categories = categories;
        }).catch(function(error) {
            console.error('Error loading categories:', error);
        });
    };

    // videos
    $scope.loadVideos = function() {
        DataService.getVideos().then(function(videos) {
            $scope.videos = videos;
        }).catch(function(error) {
            console.error('Error loading videos:', error);
        });
    };

    
    $scope.changeView = function(view) {
        $scope.currentView = view;
        $scope.newItem = {}; 
        if (view === 'users') {
            $scope.loadUsers();
        } else if (view === 'categories') {
            $scope.loadCategories();
        } else if (view === 'videos') {
            $scope.loadVideos();
            $scope.loadCategories(); 
        }
    };

    
    $scope.createItem = function() {
        var createPromise;
        if ($scope.currentView === 'users') {
            createPromise = DataService.createUser($scope.newItem);
        } else if ($scope.currentView === 'categories') {
            createPromise = DataService.createCategory($scope.newItem);
        } else if ($scope.currentView === 'videos') {
            createPromise = DataService.createVideo($scope.newItem);
        }

        createPromise.then(function(response) {
            console.log('Item created successfully:', response);
            $scope.changeView($scope.currentView); 
            $scope.newItem = {}; 
        }).catch(function(error) {
            console.error('Error creating item:', error);
 
        });
    };

  
    $scope.openEditModal = function(item) {
        $scope.editItem = angular.copy(item);
        var editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    };

    $scope.submitEdit = function() {
        var updatePromise;
        if ($scope.currentView === 'users') {
            updatePromise = DataService.updateUser($scope.editItem);
        } else if ($scope.currentView === 'categories') {
            updatePromise = DataService.updateCategory($scope.editItem);
        } else if ($scope.currentView === 'videos') {
            updatePromise = DataService.updateVideo($scope.editItem);
        }

        updatePromise.then(function(response) {
            console.log('Item updated successfully:', response);
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
            editModal.hide();
            $scope.changeView($scope.currentView); 
        }).catch(function(error) {
            console.error('Error updating item:', error);
        });
    };

    // quitar item
   $scope.deleteItem = function(item) {
        var deletePromise;
        if ($scope.currentView === 'users') {
            deletePromise = DataService.deleteUser(item.id);
        } else if ($scope.currentView === 'categories') {
            deletePromise = DataService.deleteCategory(item.id);
        } else if ($scope.currentView === 'videos') {
            deletePromise = DataService.deleteVideo(item.id);
        }

        deletePromise.then(function(response) {
            console.log('Item deleted successfully:', response);
            $scope.changeView($scope.currentView); 
        }).catch(function(error) {
            console.error('Error deleting item:', error);
        });
    };

    $scope.getCategoryName = function(categoryId) {
        var category = $scope.categories.find(function(cat) {
            return cat.id === categoryId;
        });
        return category ? category.name : 'Unknown';
    };

    $scope.changeView('users');
});

app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});