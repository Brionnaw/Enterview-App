var app;
(function (app) {
    var Services;
    (function (Services) {
        var UserService = (function () {
            function UserService($resource, $state) {
                this.$state = $state;
                this.RegisterResource = $resource('api/users/register');
                this.LoginResource = $resource('api/users/login');
                this.PhotoResource = $resource('api/users/photo');
                this.CurrentUserResource = $resource('api/users/currentUser/:id');
                var token = window.localStorage["token"];
                if (token) {
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    this.currentUser = this.getCurrentUser(payload.id);
                    console.log('logged in');
                }
                else {
                    this.$state.go('Login');
                }
            }
            UserService.prototype.login = function (user) {
                return this.LoginResource.save(user).$promise;
            };
            UserService.prototype.register = function (user) {
                return this.RegisterResource.save(user).$promise;
            };
            UserService.prototype.updateUserImage = function (url) {
                return this.PhotoResource.save(url).$promise;
            };
            UserService.prototype.getCurrentUser = function (id) {
                return this.CurrentUserResource.query({ id: id });
            };
            UserService.prototype.getUser = function () {
                return this.currentUser;
            };
            return UserService;
        }());
        Services.UserService = UserService;
        var FeedService = (function () {
            function FeedService($resource, $state) {
                this.$resource = $resource;
                this.$state = $state;
                this.FeedResource = $resource('api/posts/feed/:id');
                this.PostResource = $resource('api/posts/company/:name');
                this.CompanyResource = $resource('api/reviews/:name');
            }
            FeedService.prototype.createPost = function (postData) {
                console.log(postData);
                var post = {
                    name: postData.name,
                    domain: postData.domain,
                    id: postData.id,
                    author: postData.username,
                    interviewType: postData.interviewType,
                    positionTitle: postData.position,
                    text: postData.text
                };
                return this.FeedResource.save(postData).$promise;
            };
            FeedService.prototype.getAllPosts = function (companyName) {
                return this.PostResource.query({ name: companyName });
            };
            FeedService.prototype.deletePost = function (id) {
                return this.FeedResource.remove({ id: id }).$promise;
            };
            FeedService.prototype.getAllProfilePosts = function (username) {
                return this.FeedResource.query({ id: username });
            };
            FeedService.prototype.checkCompanyPosts = function (companyName) {
                var collection = this.CompanyResource.query({ name: companyName.name });
                this.savePosts(collection, companyName.name);
            };
            FeedService.prototype.savePosts = function (posts, company) {
                console.log(company);
                if (posts.message === 'false') {
                    this.$state.go('Feed', { info: ['false', company] });
                }
                else {
                    this.myPosts = posts;
                    this.$state.go('Feed', { info: ['true', company] });
                }
            };
            return FeedService;
        }());
        Services.FeedService = FeedService;
        var CompanyService = (function () {
            function CompanyService($resource) {
                this.$resource = $resource;
                this.CompanyResource = $resource('api/company');
                this.GlassdoorResource = $resource('api/company/glassdoor');
            }
            CompanyService.prototype.researchCompany = function (companyInfo) {
                var company = {
                    company: companyInfo.company,
                    domain: companyInfo.domain,
                    posts: companyInfo.posts
                };
                return this.CompanyResource.save(companyInfo).$promise;
            };
            CompanyService.prototype.glassdoor = function (glassdoorInfo) {
                return this.GlassdoorResource.save(glassdoorInfo).$promise;
            };
            return CompanyService;
        }());
        Services.CompanyService = CompanyService;
        angular.module('app').service('userService', UserService);
        angular.module('app').service('feedService', FeedService);
        angular.module('app').service('companyService', CompanyService);
    })(Services = app.Services || (app.Services = {}));
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2aWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBRSxJQUFVLEdBQUcsQ0FxSGQ7QUFySEMsV0FBVSxHQUFHO0lBQUMsSUFBQSxRQUFRLENBcUh2QjtJQXJIZSxXQUFBLFFBQVE7UUFFdEI7WUFxQkUscUJBQ0UsU0FBc0MsRUFDL0IsTUFBMEI7Z0JBQTFCLFdBQU0sR0FBTixNQUFNLENBQW9CO2dCQUVqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFDbEUsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7Z0JBQzFCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ3pCLENBQUM7WUFDSCxDQUFDO1lB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