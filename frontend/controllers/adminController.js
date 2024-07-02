app.controller('AdminController', function($scope, DataService) {
    // Initialize variables
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];
    $scope.currentView = 'users';
    $scope.newItem = {};
    $scope.editItem = {};

    // Load users
    $scope.loadUsers = function() {
        DataService.getUsers().then(function(users) {
            $scope.users = users;
        }).catch(function(error) {
            console.error('Error loading users:', error);
        });
    };

    // Load categories
    $scope.loadCategories = function() {
        DataService.getCategories().then(function(categories) {
            $scope.categories = categories;
        }).catch(function(error) {
            console.error('Error loading categories:', error);
        });
    };

    // Load videos
    $scope.loadVideos = function() {
        DataService.getVideos().then(function(videos) {
            $scope.videos = videos;
        }).catch(function(error) {
            console.error('Error loading videos:', error);
        });
    };

    // Change the current view
    $scope.changeView = function(view) {
        $scope.currentView = view;
        $scope.newItem = {}; // Reset the newItem object
        if (view === 'users') {
            $scope.loadUsers();
        } else if (view === 'categories') {
            $scope.loadCategories();
        } else if (view === 'videos') {
            $scope.loadVideos();
            $scope.loadCategories(); // We need categories for the video form
        }
    };

    // Create a new item
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
            $scope.changeView($scope.currentView); // Refresh the current view
            $scope.newItem = {}; // Reset the form
        }).catch(function(error) {
            console.error('Error creating item:', error);
            // Handle error (e.g., show error message to user)
        });
    };

    // Open edit modal
    $scope.openEditModal = function(item) {
        $scope.editItem = angular.copy(item);
        var editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    };

    // Submit edit
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
            $scope.changeView($scope.currentView); // Refresh the current view
        }).catch(function(error) {
            console.error('Error updating item:', error);
            // Handle error (e.g., show error message to user)
        });
    };

    // Delete an item
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
            $scope.changeView($scope.currentView); // Refresh the current view
        }).catch(function(error) {
            console.error('Error deleting item:', error);
            // Handle error (e.g., show error message to user)
        });
    };

    // Helper function to get category name by id
    $scope.getCategoryName = function(categoryId) {
        var category = $scope.categories.find(function(cat) {
            return cat.id === categoryId;
        });
        return category ? category.name : 'Unknown';
    };

    // Initialize the view
    $scope.changeView('users');
});

// Filter to capitalize the first letter
app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});