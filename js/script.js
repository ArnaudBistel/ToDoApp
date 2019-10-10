// création de l'app AngularJS
var app = angular.module("toDoApp", ["ngRoute",'ui.bootstrap']);

// mise en place des routes
app.config(function($routeProvider) {
    $routeProvider
    .when("/add", {
        templateUrl : "html/add.html",
        controller: 'ToDoAppController'
    })
    .when("/list", {
      templateUrl : "html/list.html",
      controller: 'ToDoAppController'
    })
    .when("/", {
      templateUrl : "html/list.html",
      controller: 'ToDoAppController'
    })
    .otherwise({
        templateURL : "html/list.html",
        controller: 'ToDoAppController'
    });
});


/**
 * Contrôleur de l'application
 */
app.controller('ToDoAppController', ['$scope', '$window', function ($scope) {
  // initialise la liste des tâches
  var tasklist = $scope.tasklist = [];

  // liste de tâches pour la sauvegarde locale
  var jsonData = [];
  // sauvegarde locale
  if (localStorage.getItem("task-list")) {
      jsonData = JSON.parse(localStorage.getItem("task-list"));
  };
  $scope.tasklist = jsonData;
  tasklist = jsonData;

  // vide les champs de saisi du formulaire
  $scope.task= {
    title : '',
    desc : '',
    date : '',
    hour : '',
    context : '',
  };


  // booleen de modification d'une tâche qui permet de modifier la vue des tâches
  $scope.editing = null;


  // *******
  // Méthode d'enregistrement local des modifications apportées à une tâche depuis list.html
  // *******
  $scope.modify = function(task){
    // copie des arguments de la tâche modifiés dans le formulaire
    var modified_task = task;

    // récupère la liste de tâche actuelle
     var todos = $scope.tasklist;
     // récupère l'index de la tâche sélectionnée pour suppression et passée en paramètre
     var index = todos.indexOf(task);

      // suppression de la tâche de la liste du scope
      if (index !== -1) {
        todos.splice(index, 1);
      }

    // association de la valeur saisie de contexte dans le menu déroulant 'select'
    // à sa valeur String réelle
    var context = modified_task.context;
    switch (context) {
      case 'valeur1':
      context = 'Travail';
      break;
      case 'valeur2':
      context = 'Voyage';
      break;
      case 'valeur3':
      context = 'Cours';
      break;
      default:
      context = "Pas de contexte"
    }
    modified_task.context = context;

    todos.push(modified_task);

    jsonData = todos;
    localStorage.setItem("task-list",JSON.stringify(jsonData));
  }


  // *******
  // Méthode d'ajout d'une tâche via le formulaire add.html
  // *******
  $scope.addTask = function(task) {

    // copie des arguments de la tâche saisis dans le formulaire
    $scope.new_task = angular.copy(task);

    // ajout d'un argument 'tâche non finie'
    $scope.new_task.completed  = false;

    // association de la valeur saisie de contexte dans le menu déroulant 'select'
    // à sa valeur String réelle
    var $context = $scope.task.context;
    switch ($context) {
      case 'valeur1':
        $context = 'Travail';
        break;
      case 'valeur2':
        $context = 'Voyage';
        break;
      case 'valeur3':
        $context = 'Cours';
        break;
      default:
        $context = "Pas de contexte"
    }
    $scope.new_task.context = $context;


    // Gestion du cas où aucune date n'est saisie pour la nouvelle tâche
    var $date = $scope.new_task.date;
    if ($date === "" || $date === null) {
      $scope.new_task.date = "/";
    }


    // Gestion du cas où aucune heure n'est saisie pour la nouvelle tâche
    var $time = $scope.new_task.hour;
    if ($time === "" || $time === null) {
      $scope.new_task.hour = "/";
    }

    // argument qui permet de gérer l'affichage de la description dans la vue list.html
    $scope.new_task.isCollapsed = false;


    // ajout de la tâche à la liste des tâches
  //  $scope.tasklist.push($scope.new_task);

    // récupération de la liste de tâche sauvegardeé localement
    if (localStorage.getItem("task-list")) {
        jsonData = JSON.parse(localStorage.getItem("task-list"));
    }
    // ajout de la nouvelle tâche à la liste
    jsonData.push($scope.new_task);
    // sauvegarde de la liste de tâche mise à jour
    localStorage.setItem("task-list",JSON.stringify(jsonData));

    // mise à jour de la liste de tâches
    $scope.tasklist = jsonData;

    // redirection vers la liste de tâches
    window.location.href = '#!list';
  };



  // *******
  // Méthode de suppression d'une tâche depuis list.html
  // *******
  $scope.removeTask = function(task) {
    // récupère la liste de tâche actuelle
     var todos = $scope.tasklist;
     // récupère l'index de la tâche sélectionnée pour suppression et passée en paramètre
	   var index = todos.indexOf(task);

      // suppression de la tâche de la liste du scope
    	if (index !== -1) {
  		  todos.splice(index, 1);
  		}

      // sauvegarde locale de la liste de tâches mise à jour
      jsonData = todos;
      localStorage.setItem("task-list",JSON.stringify(jsonData));

      // mise à jour de la liste de tâches affichée
      $scope.tasklist = jsonData;
  };


  // *******
  // Méthode qui retourne la taille de la liste de tâches
  // *******
  $scope.getTasklistLength = function () {
    return $scope.tasklist.length;
  };


  // *******
  // Méthode qui permet de vider les champs du formulaires quand on appui sur "Effacer" sur add.html
  // *******
  $scope.reset = function() {
    $scope.task= {
      title : '',
      desc : '',
      date : '',
      hour : '',
      context : '',
    }
  };


  // *******
  // Méthode qui permet de cocher/décocher toutes les tâches sur list.html
  // *******
  $scope.markAll = function (completed) {
  	tasklist.forEach(function (todo) {
  		todo.completed = !completed;
  	});
  };


  // *******
  // Méthode qui permet de supprimer toutes les tâches cochées sur list.html
  // *******
  $scope.clearCompletedTodos = function () {
      $scope.tasklist = tasklist = tasklist.filter(function (todo) {
  		    return !todo.completed;
      });

      // mise à jour de la sauvegarde locale après suppression des tâches
      jsonData = $scope.tasklist;
      localStorage.setItem("task-list",JSON.stringify(jsonData));
  };



  // *******
  // Méthode qui permet de modifier le booleen qui permet d'afficher ou Masquer
  // la description d'une tâche passée en paramètre sur list.html
  // *******
  $scope.changeCollapse = function(task){
      if (task.isCollapsed ) {
        task.isCollapsed = false;
      } else {
        task.isCollapsed = true;
      }
  };


  // attributs qui permettent le tri des tâches selon différents critères
  $scope.propertyName = 'title';
  $scope.reverse = true;
//  $scope.tasklist = tasklist;


  // *******
  // Méthode de tri sur list.html
  // *******
  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };

}]);
