(function () {
  var app = angular.module('AngularStart', ['ngRoute', 'LocalStorageModule', 'feeds', 'angular-loading-bar']);

  app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('ngStartPage')
      .setStorageCookie(0, '/')
      .setNotify(true, true);
  });

  app.config(function($routeProvider) {
    $routeProvider

    // route for the home page
    .when('/settings', {
      templateUrl : '/assets/templates/settings.html',
      controller  : 'settingsController'
    })

    .when('/debug', {
      templateUrl : '/assets/templates/debug.html',
      controller  : 'debugController'
    });

  });

  app.controller("debugController", function ($scope, localStorageService) {
    $scope.personal_sites = localStorageService.get('personalSite');
    $scope.work_sites = localStorageService.get('workSite');
  });

  app.controller("settingsController", function ($scope, localStorageService, $window) {
    $scope.master = {};

    $scope.bookmarks = localStorageService.get('personalSite') + "\n\n" + localStorageService.get('workSite');

    $scope.addSites = function(sites) {
      console.log(sites);
      if (sites.bookmark_type === "personal") {
        localStorageService.set('personalSite', sites.bookmarks);
      } else if (sites.bookmark_type === "work") {
        localStorageService.set('workSite', sites.bookmarks);
      }

      //$window.location.reload();
    };

    $scope.updatePersonal = function(user) {
      $scope.master = angular.copy(user);

      var ob = {
        Name: user.personalname,
        URL: user.personalsite
      };

      submit('personalSite', ob);
    };

    $scope.updateWork = function(user) {
      $scope.master = angular.copy(user);

      var ob = {
        Name: user.workname,
        URL: user.worksite
      };

      submit('workSite', ob);
    };

    function submit(key, val) {
      var existing = JSON.parse(localStorageService.get(key));

      if (existing === null) {
        existing = [];
      }

      existing.push(val);

      $window.location.reload();

      return localStorageService.set(key, JSON.stringify(existing));
    }
  });

  app.controller("Utils", function ($scope) {
    $scope.search_active = false;
  })
    .directive('currentTime', ['$interval', 'dateFilter',
      function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
          var format = "h:mm a";  // date format
          var stopTime; // so that we can cancel the time updates

          // used to update the UI
          function updateTime() {
            element.text(dateFilter(new Date(), format));
          }

          // watch the expression, and update the UI on change.
          scope.$watch(attrs.myCurrentTime, function(value) {
            //format = value;
            console.log(attrs);
            updateTime();
          });

          stopTime = $interval(updateTime, 1000);

          // listen on DOM destroy (removal) event, and cancel the next UI update
          // to prevent updating time after the DOM element was removed.
          element.on('$destroy', function () {
            $interval.cancel(stopTime);
          });
        }
      }]);

  app.controller("PageListing", function ($scope, localStorageService) {

    console.log(JSON.parse(localStorageService.get('personalSite')));

    $scope.play_pages = (JSON.parse(localStorageService.get('personalSite')) === null) ? '' : JSON.parse(localStorageService.get('personalSite'));

    console.log(JSON.parse(localStorageService.get('workSite')));

    $scope.work_pages = (JSON.parse(localStorageService.get('workSite')) === null) ? '' : JSON.parse(localStorageService.get('workSite'));

  });

  

}());
