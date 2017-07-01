angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
// function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
function routesConfig($stateProvider, $urlRouterProvider) {
  // $locationProvider.html5Mode(true).hashPrefix('!'); //uncomment when running on server
  $urlRouterProvider.otherwise('/app/dashboard');

  $stateProvider
    .state('login', {
      url: '/login',
      component: 'loginCom'
    })
    .state('app', {
      url: '/app',
      component: 'homeCom'
    })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        mainContent: {
          component: 'dashboardCom'
        }
      }
    })

/* ------------------------------- Stock  ------------------------------- */
    .state('app.stock', {
      url: '/stock',
      views: {
        mainContent: {
          template: '<div ui-view="mainContent"></div>'
        }
      }
    })
    .state('app.stock.new', {
      url: '/new',
      views: {
        mainContent: {
          component: 'stockNewCom'
        }
      }
    })

    .state('app.sample', {
      url: '/sample',
      views: {
        mainContent: {
          component: 'sampleCom'
        }
      }
    })
//---------------------------------------------batchHandle---------------------

      .state('app.batchHandle', {
        url: '/batchHandle',
        views: {
            mainContent: {
                component: 'batchHandleCom'
            }
        }
    })
 //---------------------------------------------drug dispense---------------------
.state('app.drugDispence', {
        url: '/drugDispence',
        views: {
            mainContent: {
                component: 'drugDispenceCom'
            }
        }
    });



}
