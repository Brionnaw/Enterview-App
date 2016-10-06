'use strict';
namespace app {
  angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'angular-filepicker'])
    .config((
    $stateProvider: ng.ui.IStateProvider,
    $locationProvider: ng.ILocationProvider,
    $urlRouterProvider: ng.ui.IUrlRouterProvider,
    filepickerProvider) => {
    filepickerProvider.setKey('APC947uh2T46mDGrkcws5z')

    $stateProvider.state('Home', {
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: app.Controllers.HomeController,
      controllerAs: 'vm'
    }).state('Login', {
      url: '/',
      templateUrl: '/templates/login.html',
      controller: app.Controllers.LoginController,
      controllerAs: 'vm'
    }).state('Register', {
      url: '/register',
      templateUrl: '/templates/register.html',
      controller: app.Controllers.RegisterController,
      controllerAs: 'vm'
    }).state('LandingPage', {
      url: '/landingPage',
      templateUrl: '/templates/landingPage.html',
      controller: app.Controllers.LandingPageController,
      controllerAs: 'vm'
    }).state('Feed', {
      url: '/feed',
      templateUrl: '/templates/feed.html',
      controller: app.Controllers.FeedController,
      controllerAs: 'vm'
    }).state('CreatePost', {
      url: '/createPost',
      templateUrl: '/templates/createPost.html',
      controller: app.Controllers.CreatePostController,
      controllerAs: 'vm'
    }).state('EditPost', {
      url: '/editPost/:info',
      templateUrl: '/templates/editPost.html',
      controller: app.Controllers.EditController,
      controllerAs: 'vm'
    }).state('EditProfile', {
      url: '/editProfile',
      templateUrl: '/templates/editProfile.html',
      controller: app.Controllers.HomeController,
      controllerAs: 'vm'
    }).state('Profile', {
      url: '/profile',
      templateUrl: '/templates/profile.html',
      controller: app.Controllers.ProfileController,
      controllerAs: 'vm'
    }).state('SearchCompany', {
      url: '/searchCompany',
      templateUrl: '/templates/searchCompany.html',
      controller: app.Controllers.SearchCompanyController,
      controllerAs: 'vm'
    }).state('CompanyGlassdoor', {
      url: '/companyGlassdoor/:info',
      templateUrl: '/templates/companyGlassdoor.html',
      controller: app.Controllers.CompanyGlassdoorController,
      controllerAs: 'vm'
    });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  });
}
