'use strict';
var app;
(function (app) {
    angular.module('app', ['ui.router', 'ngResource', 'ui.bootstrap', 'angular-filepicker', 'angular-typed'])
        .config(function ($stateProvider, $locationProvider, $urlRouterProvider, filepickerProvider) {
        filepickerProvider.setKey('APC947uh2T46mDGrkcws5z');
        $stateProvider.state('Home', {
            url: '/home',
            templateUrl: '/templates/home.html',
            controller: app.Controllers.HomeController,
            controllerAs: 'vm'
        }).state('Login', {
            url: '/login',
            templateUrl: '/templates/login.html',
            controller: app.Controllers.LoginController,
            controllerAs: 'vm'
        }).state('Register', {
            url: '/register',
            templateUrl: '/templates/register.html',
            controller: app.Controllers.RegisterController,
            controllerAs: 'vm'
        }).state('LandingPage', {
            url: '/',
            templateUrl: '/templates/landingPage.html',
            controller: app.Controllers.LandingPageController,
            controllerAs: 'vm'
        }).state('Feed', {
            url: '/feed/:info',
            templateUrl: '/templates/feed.html',
            controller: app.Controllers.FeedController,
            controllerAs: 'vm'
        }).state('CreatePost', {
            url: '/createPost/:info',
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
        }).state('InterviewTips', {
            url: '/interviewTips',
            templateUrl: '/templates/InterviewTips.html',
            controller: app.Controllers.HomeController,
            controllerAs: 'vm'
        });
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode(true);
    });
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQVUsR0FBRyxDQTBFWjtBQTFFRCxXQUFVLEdBQUc7SUFDWCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLG9CQUFvQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQ3RHLE1BQU0sQ0FBQyxVQUNSLGNBQW9DLEVBQ3BDLGlCQUF1QyxFQUN2QyxrQkFBNEMsRUFDNUMsa0JBQWtCO1FBQ2xCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBRW5ELGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQzNCLEdBQUcsRUFBRSxPQUFPO1lBQ1osV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjO1lBQzFDLFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2hCLEdBQUcsRUFBRSxRQUFRO1lBQ2IsV0FBVyxFQUFFLHVCQUF1QjtZQUNwQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQzNDLFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ25CLEdBQUcsRUFBRSxXQUFXO1lBQ2hCLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCO1lBQzlDLFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEdBQUcsRUFBRSxHQUFHO1lBQ1IsV0FBVyxFQUFFLDZCQUE2QjtZQUMxQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUI7WUFDakQsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDZixHQUFHLEVBQUUsYUFBYTtZQUNsQixXQUFXLEVBQUUsc0JBQXNCO1lBQ25DLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGNBQWM7WUFDMUMsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDckIsR0FBRyxFQUFFLG1CQUFtQjtZQUN4QixXQUFXLEVBQUUsNEJBQTRCO1lBQ3pDLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLG9CQUFvQjtZQUNoRCxZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtZQUNuQixHQUFHLEVBQUUsaUJBQWlCO1lBQ3RCLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYztZQUMxQyxZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUN0QixHQUFHLEVBQUUsY0FBYztZQUNuQixXQUFXLEVBQUUsNkJBQTZCO1lBQzFDLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGNBQWM7WUFDMUMsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7WUFDbEIsR0FBRyxFQUFFLFVBQVU7WUFDZixXQUFXLEVBQUUseUJBQXlCO1lBQ3RDLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLGlCQUFpQjtZQUM3QyxZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUN4QixHQUFHLEVBQUUsZ0JBQWdCO1lBQ3JCLFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsdUJBQXVCO1lBQ25ELFlBQVksRUFBRSxJQUFJO1NBQ25CLENBQUMsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsR0FBRyxFQUFFLHlCQUF5QjtZQUM5QixXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFVBQVUsRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLDBCQUEwQjtZQUN0RCxZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUN4QixHQUFHLEVBQUUsZ0JBQWdCO1lBQ3JCLFdBQVcsRUFBRSwrQkFBK0I7WUFDNUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYztZQUMxQyxZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDLENBQUM7UUFFSCxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxFQTFFUyxHQUFHLEtBQUgsR0FBRyxRQTBFWiJ9