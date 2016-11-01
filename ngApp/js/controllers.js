var app;
(function (app) {
    var Controllers;
    (function (Controllers) {
        var HomeController = (function () {
            function HomeController($state, userService, $stateParams, filepickerService, $scope) {
                this.$state = $state;
                this.userService = userService;
                this.$stateParams = $stateParams;
                this.filepickerService = filepickerService;
                this.$scope = $scope;
                var token = window.localStorage["token"];
                var payload = JSON.parse(window.atob(token.split('.')[1]));
                this.id = payload.id;
                this.user = this.userService.getUser();
            }
            HomeController.prototype.logout = function () {
                window.localStorage.removeItem('token');
                this.$state.go("Login");
            };
            HomeController.prototype.pickFile = function () {
                this.filepickerService.pick({ mimetype: 'image/*' }, this.fileUploaded.bind(this));
            };
            HomeController.prototype.fileUploaded = function (file) {
                var _this = this;
                var fileInfo = {
                    url: file.url,
                    id: this.id
                };
                this.userService.updateUserImage(fileInfo).then(function (res) {
                    _this.$state.go('Home').then(function () {
                        location.reload();
                    });
                });
            };
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
        var LoginController = (function () {
            function LoginController(userService, $state) {
                this.userService = userService;
                this.$state = $state;
                var token = window.localStorage["token"];
                if (token) {
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    if (payload.exp > Date.now() / 1000) {
                        this.$state.go('Home');
                    }
                }
            }
            LoginController.prototype.login = function () {
                var _this = this;
                this.userService.login(this.user).then(function (res) {
                    if (res.message === "Correct") {
                        window.localStorage["token"] = res.jwt;
                        _this.$state.go('Home');
                    }
                    else {
                        alert(res.message);
                    }
                });
            };
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
        var RegisterController = (function () {
            function RegisterController(userService, $state, filepickerService, $window) {
                this.userService = userService;
                this.$state = $state;
                this.filepickerService = filepickerService;
                this.$window = $window;
                var token = window.localStorage["token"];
                if (token) {
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    if (payload.exp > Date.now() / 1000) {
                        this.$state.go('Home');
                    }
                }
            }
            RegisterController.prototype.register = function () {
                var _this = this;
                this.user.photoUrl = this.photoUrl,
                    this.userService.register(this.user).then(function (res) {
                        if (res.message === "username already exist") {
                            alert(res.message);
                        }
                        else {
                            window.localStorage["token"] = res.token;
                            _this.$window.location.href = 'https://enterviewapp.herokuapp.com/home';
                        }
                    });
            };
            RegisterController.prototype.pickFile = function () {
                this.filepickerService.pick({ mimetype: 'image/*' }, this.fileUploaded.bind(this));
            };
            RegisterController.prototype.fileUploaded = function (file) {
                this.photoUrl = file.url;
            };
            return RegisterController;
        }());
        Controllers.RegisterController = RegisterController;
        var LandingPageController = (function () {
            function LandingPageController(userService) {
                this.userService = userService;
                var token = window.localStorage["token"];
                if (token) {
                    this.loggedIn = true;
                }
                else {
                    this.loggedIn = false;
                }
            }
            return LandingPageController;
        }());
        Controllers.LandingPageController = LandingPageController;
        var FeedController = (function () {
            function FeedController(feedService, $stateParams, $state, $scope) {
                this.feedService = feedService;
                this.$stateParams = $stateParams;
                this.$state = $state;
                this.$scope = $scope;
                if ($stateParams) {
                    var info = $stateParams["info"];
                    var seperate = info.split(",");
                    console.log(seperate[1]);
                    if (seperate[0] === 'true') {
                        this.companyName = seperate[1];
                        this.showPosts = true;
                        this.posts = this.feedService.myPosts;
                        console.log(this.posts);
                    }
                    else {
                        this.companyName = seperate[1];
                        this.notFound = true;
                        $scope.alert = { type: 'warning', msg: 'No posts found!' };
                    }
                }
            }
            FeedController.prototype.remove = function (postId, index) {
                var _this = this;
                var answer = confirm('Are you sure you want to delete?');
                if (answer === true) {
                    this.feedService.deletePost(postId).then(function () {
                        _this.posts.splice(index, 1);
                    });
                }
                else {
                    console.log('not deleted');
                }
                var token = window.localStorage["token"];
                var payload = JSON.parse(window.atob(token.split('.')[1]));
                var info = {
                    name: this.companyName,
                    domain: this.companyDomain
                };
            };
            return FeedController;
        }());
        Controllers.FeedController = FeedController;
        var CreatePostController = (function () {
            function CreatePostController(feedService, $stateParams, $state) {
                this.feedService = feedService;
                this.$stateParams = $stateParams;
                this.$state = $state;
                if ($stateParams) {
                    var seperate = $stateParams["info"].split(",");
                    this.companyName = seperate[0];
                    this.companyDomain = seperate[1];
                    var company = {
                        company: this.companyName,
                        domain: this.companyDomain
                    };
                    console.log(this.companyName);
                }
                this.optionOne = false;
                this.optionTwo = false;
                this.optionThree = false;
            }
            CreatePostController.prototype.addPost = function () {
                var _this = this;
                if (this.optionOne === 'checked') {
                    var token = window.localStorage["token"];
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    var info = {
                        name: this.companyName,
                        domain: this.companyDomain,
                        authorPhoto: payload.photoUrl,
                        username: payload.username,
                        interviewType: 'Phone Screen',
                        positionTitle: this.position,
                        question: this.post
                    };
                    console.log(this.companyName);
                    this.feedService.createPost(info).then(function (res) {
                        _this.feedService.getAllPosts(_this.companyName);
                        _this.$state.go('Feed', { info: 'true' });
                    });
                }
                else if (this.optionTwo === 'checked') {
                    console.log(this.optionTwo);
                    var token = window.localStorage["token"];
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    var info = {
                        name: this.companyName,
                        domain: this.companyDomain,
                        authorPhoto: payload.photoUrl,
                        username: payload.username,
                        interviewType: 'In Person 1:1',
                        positionTitle: this.position,
                        question: this.post
                    };
                    this.feedService.createPost(info).then(function (res) {
                        _this.$state.go('Feed', { info: 'true' });
                    });
                }
                else if (this.optionThree === 'checked') {
                    console.log(this.optionThree);
                    var token = window.localStorage["token"];
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    var info = {
                        name: this.companyName,
                        domain: this.companyDomain,
                        authorPhoto: payload.photoUrl,
                        username: payload.username,
                        interviewType: 'Group/Panel',
                        positionTitle: this.position,
                        question: this.post
                    };
                    this.feedService.createPost(info).then(function (res) {
                        _this.$state.go('Feed', { info: 'true' });
                    });
                }
            };
            CreatePostController.prototype.check = function (num) {
                console.log(num);
                if (num === 'one') {
                    this.optionOne = 'checked';
                    console.log(this.optionOne);
                }
                else if (num === 'two') {
                    this.optionTwo = 'checked';
                    console.log(this.optionTwo);
                }
                else if (num === 'three') {
                    this.optionThree = 'checked';
                }
            };
            return CreatePostController;
        }());
        Controllers.CreatePostController = CreatePostController;
        var EditController = (function () {
            function EditController($stateParams, feedService, $state) {
                this.$stateParams = $stateParams;
                this.feedService = feedService;
                this.$state = $state;
                if ($stateParams) {
                    var seperate = $stateParams["info"].split(",");
                    this.id = seperate[0];
                    this.interviewType = seperate[1];
                    this.companyDomain = seperate[2];
                    this.position = seperate[3];
                    this.postOne = seperate[4];
                    this.postTwo = seperate[5];
                    this.postThree = seperate[6];
                    this.postFour = seperate[7];
                    this.postFive = seperate[8];
                    this.postSix = seperate[9];
                    this.tag = seperate[10];
                    this.authorPhoto = seperate[11];
                    console.log(this.companyDomain);
                    if (this.interviewType === 'Phone Screen') {
                        this.optionOne = 'checked';
                        this.inputOne = true;
                    }
                    else if (this.interviewType === 'In-Person 1:1') {
                        this.optionTwo = 'checked';
                        this.inputTwo = true;
                    }
                    else if (this.interviewType === 'Group/Panel') {
                        this.optionThree = 'checked';
                        this.inputThree = true;
                    }
                    else {
                        console.log('Do not exist!');
                    }
                }
            }
            EditController.prototype.update = function () {
                var _this = this;
                if (this.optionOne === 'checked') {
                    var token = window.localStorage["token"];
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    var info = {
                        authorPhoto: this.authorPhoto,
                        domain: this.companyDomain,
                        id: this.id,
                        username: payload.username,
                        interviewType: 'Phone Screen',
                        positionTitle: this.position,
                        question: {
                            one: this.postOne,
                            two: this.postTwo,
                            three: this.postThree,
                            four: this.postFour,
                            five: this.postFive,
                            six: this.postSix
                        },
                        tag: this.tag,
                    };
                    this.feedService.createPost(info).then(function (res) {
                        _this.$state.go('Profile');
                    });
                }
                else if (this.optionTwo === 'checked') {
                    console.log(this.optionTwo);
                    var token = window.localStorage["token"];
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    var info = {
                        authorPhoto: this.authorPhoto,
                        domain: this.companyDomain,
                        id: this.id,
                        username: payload.username,
                        interviewType: 'In-Person 1:1',
                        positionTitle: this.position,
                        question: {
                            one: this.postOne,
                            two: this.postTwo,
                            three: this.postThree,
                            four: this.postFour,
                            five: this.postFive,
                            six: this.postSix
                        },
                        tag: this.tag
                    };
                    this.feedService.createPost(info).then(function (res) {
                        _this.$state.go('Profile');
                    });
                }
                else if (this.optionThree === 'checked') {
                    console.log(this.optionThree);
                    var token = window.localStorage["token"];
                    var payload = JSON.parse(window.atob(token.split('.')[1]));
                    var info = {
                        authorPhoto: this.authorPhoto,
                        domain: this.companyDomain,
                        id: this.id,
                        username: payload.username,
                        interviewType: 'Group/Panel',
                        positionTitle: this.position,
                        question: {
                            one: this.postOne,
                            two: this.postTwo,
                            three: this.postThree,
                            four: this.postFour,
                            five: this.postFive,
                            six: this.postSix
                        },
                        tag: this.tag
                    };
                    this.feedService.createPost(info).then(function (res) {
                        _this.$state.go('Profile');
                    });
                }
            };
            EditController.prototype.check = function (num) {
                console.log(num);
                if (num === 'one') {
                    this.optionOne = 'checked';
                    this.inputOne = true;
                }
                else if (num === 'two') {
                    this.optionTwo = 'checked';
                    this.inputTwo = true;
                }
                else if (num === 'three') {
                    this.optionThree = 'checked';
                    this.inputThree = true;
                }
            };
            return EditController;
        }());
        Controllers.EditController = EditController;
        var ProfileController = (function () {
            function ProfileController($uibModal, feedService, $stateParams, $state) {
                this.$uibModal = $uibModal;
                this.feedService = feedService;
                this.$stateParams = $stateParams;
                this.$state = $state;
                var token = window.localStorage["token"];
                var payload = JSON.parse(window.atob(token.split('.')[1]));
                this.posts = this.feedService.getAllProfilePosts(payload.username);
                console.log(this.posts);
                if (token) {
                    console.log('logged in');
                }
                else {
                    this.$state.go('Login');
                }
            }
            ProfileController.prototype.remove = function (postId, index) {
                var _this = this;
                var answer = confirm('Are you sure you want to delete?');
                if (answer === true) {
                    this.feedService.deletePost(postId).then(function () {
                        _this.posts.splice(index, 1);
                    });
                }
                else {
                    console.log('not deleted');
                }
            };
            return ProfileController;
        }());
        Controllers.ProfileController = ProfileController;
        var SearchCompanyController = (function () {
            function SearchCompanyController(companyService, feedService, $state, $window, $document, $location) {
                this.companyService = companyService;
                this.feedService = feedService;
                this.$state = $state;
                this.$window = $window;
                this.$document = $document;
                this.$location = $location;
            }
            SearchCompanyController.prototype.research = function () {
                var _this = this;
                var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
                var regex = new RegExp(expression);
                var url = this.companyDomain;
                if (url.match(regex)) {
                    var name_1 = this.companyName.toLowerCase();
                    var seperated = name_1.split('');
                    var result = seperated[0].toUpperCase();
                    seperated.splice(0, 1);
                    seperated.unshift(result);
                    var uppercaseCompany = seperated.join('');
                    console.log(uppercaseCompany);
                    var info = {
                        company: uppercaseCompany,
                        domain: this.companyDomain
                    };
                    console.log(info);
                    this.companyService.researchCompany(info).then(function (res) {
                        if (res.message === 'company not found') {
                            alert(res.message);
                        }
                        else {
                            _this.companyData = res;
                        }
                    });
                }
                else {
                    alert('company domain invalid');
                }
            };
            SearchCompanyController.prototype.goToWebsite = function (domain) {
                console.log(this.$location.url);
                this.$window.location.href = 'https://' + domain;
            };
            SearchCompanyController.prototype.goToLinkedin = function (handle) {
                console.log(this.$location.url);
                this.$window.location.href = 'https://linkedin.com/' + handle;
            };
            SearchCompanyController.prototype.goToFacebook = function (handle) {
                console.log(this.$location.url);
                this.$window.location.href = 'https://facebook.com/' + handle;
            };
            SearchCompanyController.prototype.goToTwitter = function (handle) {
                console.log(this.$location.url);
                this.$window.location.href = 'https://twitter.com/' + handle;
            };
            SearchCompanyController.prototype.goToCrunchBase = function (handle) {
                console.log(this.$location.url);
                this.$window.location.href = 'https://crunchbase.com/' + handle;
            };
            SearchCompanyController.prototype.glassdoor = function (glassdoorInfo) {
                var _this = this;
                var info = {
                    company: this.companyName
                };
                this.companyService.researchCompany(info).then(function (res) {
                    _this.$state.go('CompanyGlassdoor');
                });
            };
            SearchCompanyController.prototype.checkPosts = function () {
                var company = {
                    name: this.companyName
                };
                this.feedService.checkCompanyPosts(company);
            };
            ;
            return SearchCompanyController;
        }());
        Controllers.SearchCompanyController = SearchCompanyController;
        var CompanyGlassdoorController = (function () {
            function CompanyGlassdoorController(companyService, $stateParams) {
                var _this = this;
                this.companyService = companyService;
                this.$stateParams = $stateParams;
                if ($stateParams) {
                    this.companyName = $stateParams['info'];
                    var company = {
                        company: this.companyName
                    };
                    this.companyService.glassdoor(company).then(function (res) {
                        _this.glassdoorData = (JSON.parse(res.body));
                        _this.employer = _this.glassdoorData.response.employers[0];
                        console.log(_this.employer);
                        _this.reviews = _this.employer.featured;
                    });
                }
            }
            return CompanyGlassdoorController;
        }());
        Controllers.CompanyGlassdoorController = CompanyGlassdoorController;
        angular.module('app').controller('HomeController', HomeController);
        angular.module('app').controller('LoginController', LoginController);
        angular.module('app').controller('RegisterController', RegisterController);
        angular.module('app').controller('LandingPageController', LandingPageController);
        angular.module('app').controller('FeedController', FeedController);
        angular.module('app').controller('EditController', EditController);
        angular.module('app').controller('ProfileController', ProfileController);
        angular.module('app').controller('SearchCompanyController', SearchCompanyController);
        angular.module('app').controller('CompanyGlassdoorController', CompanyGlassdoorController);
    })(Controllers = app.Controllers || (app.Controllers = {}));
})(app || (app = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb250cm9sbGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBRSxJQUFVLEdBQUcsQ0FvakJkO0FBcGpCQyxXQUFVLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0FvakIxQjtJQXBqQmUsV0FBQSxXQUFXO1FBRXpCO1lBK0JFLHdCQUNTLE1BQTJCLEVBQzFCLFdBQXFDLEVBQ3RDLFlBQXVDLEVBQ3RDLGlCQUFpQixFQUNsQixNQUFpQjtnQkFKakIsV0FBTSxHQUFOLE1BQU0sQ0FBcUI7Z0JBQzFCLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtnQkFDdEMsaUJBQVksR0FBWixZQUFZLENBQTJCO2dCQUN0QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQUE7Z0JBQ2xCLFdBQU0sR0FBTixNQUFNLENBQVc7Z0JBRXhCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekQsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekMsQ0FBQztZQWpDSSwrQkFBTSxHQUFiO2dCQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBQ00saUNBQVEsR0FBZjtnQkFDRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUN6QixFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQzdCLENBQUM7WUFDSixDQUFDO1lBRU0scUNBQVksR0FBbkIsVUFBb0IsSUFBSTtnQkFBeEIsaUJBVUM7Z0JBVEMsSUFBSSxRQUFRLEdBQUc7b0JBQ2IsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHO29CQUNaLEVBQUUsRUFBQyxJQUFJLENBQUMsRUFBRTtpQkFDWCxDQUFBO2dCQUNELElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUc7b0JBQ2xELEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBRTt3QkFDM0IsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNwQixDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFhRCxxQkFBQztRQUFELENBQUMsQUEzQ0gsSUEyQ0c7UUEzQ1UsMEJBQWMsaUJBMkN4QixDQUFBO1FBRUQ7WUFZRSx5QkFDVyxXQUFxQyxFQUN2QyxNQUEyQjtnQkFEekIsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO2dCQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFxQjtnQkFHbEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN6QixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1lBdEJNLCtCQUFLLEdBQVo7Z0JBQUEsaUJBU0M7Z0JBUkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUc7b0JBQ3pDLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUEsQ0FBQzt3QkFDNUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsR0FBRSxHQUFHLENBQUMsR0FBRyxDQUFDO3dCQUN2QyxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekIsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNyQixDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztZQWNILHNCQUFDO1FBQUQsQ0FBQyxBQXpCRCxJQXlCQztRQXpCWSwyQkFBZSxrQkF5QjNCLENBQUE7UUFFRDtZQXdCRSw0QkFDVSxXQUFxQyxFQUN0QyxNQUEyQixFQUMxQixpQkFBaUIsRUFDbEIsT0FBTztnQkFITixnQkFBVyxHQUFYLFdBQVcsQ0FBMEI7Z0JBQ3RDLFdBQU0sR0FBTixNQUFNLENBQXFCO2dCQUMxQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQUE7Z0JBQ2xCLFlBQU8sR0FBUCxPQUFPLENBQUE7Z0JBRVosSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELEVBQUUsQ0FBQSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN6QixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1lBakNJLHFDQUFRLEdBQWY7Z0JBQUEsaUJBVUM7Z0JBVEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVE7b0JBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO3dCQUM1QyxFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsT0FBTyxLQUFLLHdCQUF3QixDQUFDLENBQUMsQ0FBQzs0QkFDNUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzt3QkFDckIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDTixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBRSxHQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUM7NEJBQ3pDLEtBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyx5Q0FBeUMsQ0FBQTt3QkFDeEUsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7WUFDTSxxQ0FBUSxHQUFmO2dCQUNFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQ3pCLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDN0IsQ0FBQztZQUNKLENBQUM7WUFDTSx5Q0FBWSxHQUFuQixVQUFvQixJQUFJO2dCQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7WUFDMUIsQ0FBQztZQWVELHlCQUFDO1FBQUQsQ0FBQyxBQXRDSCxJQXNDRztRQXRDVSw4QkFBa0IscUJBc0M1QixDQUFBO1FBQ0Q7WUFFRSwrQkFDVSxXQUFxQztnQkFBckMsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO2dCQUU3QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QyxFQUFFLENBQUEsQ0FBQyxLQUFLLENBQUMsQ0FBQSxDQUFDO29CQUNWLElBQUksQ0FBRSxRQUFRLEdBQUcsSUFBSSxDQUFBO2dCQUN2QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUN4QixDQUFDO1lBQ0gsQ0FBQztZQUNILDRCQUFDO1FBQUQsQ0FBQyxBQVpDLElBWUQ7UUFaYyxpQ0FBcUIsd0JBWW5DLENBQUE7UUFFRDtZQXdCRSx3QkFDVSxXQUFxQyxFQUN0QyxZQUF1QyxFQUN2QyxNQUEyQixFQUMzQixNQUFNO2dCQUhMLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtnQkFDdEMsaUJBQVksR0FBWixZQUFZLENBQTJCO2dCQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFxQjtnQkFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBQTtnQkFFYixFQUFFLENBQUEsQ0FBQyxZQUFZLENBQUMsQ0FBQSxDQUFDO29CQUVmLElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtvQkFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDeEIsRUFBRSxDQUFBLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFBLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzt3QkFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQzt3QkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ3pCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7d0JBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO3dCQUNyQixNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQTtvQkFDNUQsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztZQXRDTSwrQkFBTSxHQUFiLFVBQWMsTUFBYSxFQUFFLEtBQVk7Z0JBQXpDLGlCQWVDO2dCQWRDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO2dCQUN4RCxFQUFFLENBQUEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUN2QyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQzlCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtnQkFDNUIsQ0FBQztnQkFDRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksSUFBSSxHQUFHO29CQUNULElBQUksRUFBRSxJQUFJLENBQUMsV0FBVztvQkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO2lCQUMzQixDQUFBO1lBQ0gsQ0FBQztZQXdCSCxxQkFBQztRQUFELENBQUMsQUEvQ0QsSUErQ0M7UUEvQ1ksMEJBQWMsaUJBK0MxQixDQUFBO1FBRUQ7WUF5RUUsOEJBQ1UsV0FBcUMsRUFDdEMsWUFBdUMsRUFDdkMsTUFBMkI7Z0JBRjFCLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtnQkFDdEMsaUJBQVksR0FBWixZQUFZLENBQTJCO2dCQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFxQjtnQkFFbEMsRUFBRSxDQUFBLENBQUMsWUFBWSxDQUFDLENBQUEsQ0FBQztvQkFDZixJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMvQyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ2hDLElBQUksT0FBTyxHQUFHO3dCQUNaLE9BQU8sRUFBQyxJQUFJLENBQUMsV0FBVzt3QkFDeEIsTUFBTSxFQUFDLElBQUksQ0FBQyxhQUFhO3FCQUMxQixDQUFBO29CQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUMvQixDQUFDO2dCQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDM0IsQ0FBQztZQXBGTSxzQ0FBTyxHQUFkO2dCQUFBLGlCQW9EQztnQkFsREMsRUFBRSxDQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELElBQUksSUFBSSxHQUFHO3dCQUNULElBQUksRUFBRSxJQUFJLENBQUMsV0FBVzt3QkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO3dCQUMxQixXQUFXLEVBQUUsT0FBTyxDQUFDLFFBQVE7d0JBQzdCLFFBQVEsRUFBQyxPQUFPLENBQUMsUUFBUTt3QkFDekIsYUFBYSxFQUFDLGNBQWM7d0JBQzVCLGFBQWEsRUFBQyxJQUFJLENBQUMsUUFBUTt3QkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNwQixDQUFBO29CQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO3dCQUN6QyxLQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7d0JBQzlDLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFBO29CQUN2QyxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFBLENBQUM7b0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO29CQUMzQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELElBQUksSUFBSSxHQUFHO3dCQUNULElBQUksRUFBRSxJQUFJLENBQUMsV0FBVzt3QkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO3dCQUMxQixXQUFXLEVBQUUsT0FBTyxDQUFDLFFBQVE7d0JBQzdCLFFBQVEsRUFBQyxPQUFPLENBQUMsUUFBUTt3QkFDekIsYUFBYSxFQUFDLGVBQWU7d0JBQzdCLGFBQWEsRUFBQyxJQUFJLENBQUMsUUFBUTt3QkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNwQixDQUFBO29CQUNELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUc7d0JBQ3pDLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFBO29CQUN2QyxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFJLFNBQVMsQ0FBQyxDQUFBLENBQUM7b0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUM3QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELElBQUksSUFBSSxHQUFHO3dCQUNULElBQUksRUFBRSxJQUFJLENBQUMsV0FBVzt3QkFDdEIsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhO3dCQUMxQixXQUFXLEVBQUUsT0FBTyxDQUFDLFFBQVE7d0JBQzdCLFFBQVEsRUFBQyxPQUFPLENBQUMsUUFBUTt3QkFDekIsYUFBYSxFQUFDLGFBQWE7d0JBQzNCLGFBQWEsRUFBQyxJQUFJLENBQUMsUUFBUTt3QkFDM0IsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNwQixDQUFBO29CQUNELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUc7d0JBQ3pDLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBQyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsQ0FBQyxDQUFBO29CQUN0QyxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztZQUNNLG9DQUFLLEdBQVosVUFBYSxHQUFHO2dCQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2hCLEVBQUUsQ0FBQSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQSxDQUFDO29CQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBQzdCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztvQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7Z0JBQzdCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztnQkFDL0IsQ0FBQztZQUNILENBQUM7WUFxQkgsMkJBQUM7UUFBRCxDQUFDLEFBN0ZELElBNkZDO1FBN0ZZLGdDQUFvQix1QkE2RmhDLENBQUE7UUFFRDtZQThHRSx3QkFDUyxZQUF1QyxFQUN0QyxXQUFxQyxFQUN0QyxNQUEwQjtnQkFGMUIsaUJBQVksR0FBWixZQUFZLENBQTJCO2dCQUN0QyxnQkFBVyxHQUFYLFdBQVcsQ0FBMEI7Z0JBQ3RDLFdBQU0sR0FBTixNQUFNLENBQW9CO2dCQUVqQyxFQUFFLENBQUEsQ0FBQyxZQUFZLENBQUMsQ0FBQSxDQUFDO29CQUNmLElBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9DLElBQUksQ0FBQyxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQzNCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7b0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO29CQUUvQixFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLGNBQWMsQ0FBQyxDQUFBLENBQUM7d0JBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO3dCQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDdkIsQ0FBQztvQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsS0FBSyxlQUFlLENBQUMsQ0FBQyxDQUFDO3dCQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRSxJQUFJLENBQUM7b0JBQ3RCLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssYUFBYSxDQUFDLENBQUMsQ0FBQzt3QkFDakQsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7d0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUN6QixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7b0JBQzlCLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUE1SE0sK0JBQU0sR0FBYjtnQkFBQSxpQkEwRUM7Z0JBeEVDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDaEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDekMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxJQUFJLElBQUksR0FBRzt3QkFDVCxXQUFXLEVBQUMsSUFBSSxDQUFDLFdBQVc7d0JBQzVCLE1BQU0sRUFBQyxJQUFJLENBQUMsYUFBYTt3QkFDekIsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO3dCQUNYLFFBQVEsRUFBQyxPQUFPLENBQUMsUUFBUTt3QkFDekIsYUFBYSxFQUFDLGNBQWM7d0JBQzVCLGFBQWEsRUFBQyxJQUFJLENBQUMsUUFBUTt3QkFDM0IsUUFBUSxFQUFFOzRCQUNSLEdBQUcsRUFBQyxJQUFJLENBQUMsT0FBTzs0QkFDaEIsR0FBRyxFQUFDLElBQUksQ0FBQyxPQUFPOzRCQUNoQixLQUFLLEVBQUMsSUFBSSxDQUFDLFNBQVM7NEJBQ3BCLElBQUksRUFBQyxJQUFJLENBQUMsUUFBUTs0QkFDbEIsSUFBSSxFQUFDLElBQUksQ0FBQyxRQUFROzRCQUNsQixHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU87eUJBQ2xCO3dCQUNELEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztxQkFDZCxDQUFBO29CQUNELElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUc7d0JBQ3pDLEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFBO29CQUMzQixDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFBLENBQUM7b0JBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO29CQUMzQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6QyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNELElBQUksSUFBSSxHQUFHO3dCQUNULFdBQVcsRUFBQyxJQUFJLENBQUMsV0FBVzt3QkFDNUIsTUFBTSxFQUFDLElBQUksQ0FBQyxhQUFhO3dCQUN6QixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7d0JBQ1gsUUFBUSxFQUFDLE9BQU8sQ0FBQyxRQUFRO3dCQUN6QixhQUFhLEVBQUMsZUFBZTt3QkFDN0IsYUFBYSxFQUFDLElBQUksQ0FBQyxRQUFRO3dCQUMzQixRQUFRLEVBQUU7NEJBQ1IsR0FBRyxFQUFDLElBQUksQ0FBQyxPQUFPOzRCQUNoQixHQUFHLEVBQUMsSUFBSSxDQUFDLE9BQU87NEJBQ2hCLEtBQUssRUFBQyxJQUFJLENBQUMsU0FBUzs0QkFDcEIsSUFBSSxFQUFDLElBQUksQ0FBQyxRQUFROzRCQUNsQixJQUFJLEVBQUMsSUFBSSxDQUFDLFFBQVE7NEJBQ2xCLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTzt5QkFDbEI7d0JBQ0QsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO3FCQUNkLENBQUE7b0JBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRzt3QkFDekMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUE7b0JBQzNCLENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQyxXQUFXLEtBQUksU0FBUyxDQUFDLENBQUEsQ0FBQztvQkFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7b0JBQzdCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0QsSUFBSSxJQUFJLEdBQUc7d0JBQ1QsV0FBVyxFQUFDLElBQUksQ0FBQyxXQUFXO3dCQUM1QixNQUFNLEVBQUMsSUFBSSxDQUFDLGFBQWE7d0JBQ3pCLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRTt3QkFDWCxRQUFRLEVBQUMsT0FBTyxDQUFDLFFBQVE7d0JBQ3pCLGFBQWEsRUFBQyxhQUFhO3dCQUMzQixhQUFhLEVBQUMsSUFBSSxDQUFDLFFBQVE7d0JBQzNCLFFBQVEsRUFBRTs0QkFDUixHQUFHLEVBQUMsSUFBSSxDQUFDLE9BQU87NEJBQ2hCLEdBQUcsRUFBQyxJQUFJLENBQUMsT0FBTzs0QkFDaEIsS0FBSyxFQUFDLElBQUksQ0FBQyxTQUFTOzRCQUNwQixJQUFJLEVBQUMsSUFBSSxDQUFDLFFBQVE7NEJBQ2xCLElBQUksRUFBQyxJQUFJLENBQUMsUUFBUTs0QkFDbEIsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPO3lCQUNsQjt3QkFDRCxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7cUJBQ2QsQ0FBQTtvQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO3dCQUN6QyxLQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFDM0IsQ0FBQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7WUFFTSw4QkFBSyxHQUFaLFVBQWEsR0FBRztnQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNoQixFQUFFLENBQUEsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUEsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7b0JBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUUsSUFBSSxDQUFDO2dCQUN0QixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7b0JBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixDQUFDO1lBQ0gsQ0FBQztZQXFDSCxxQkFBQztRQUFELENBQUMsQUFqSkQsSUFpSkM7UUFqSlksMEJBQWMsaUJBaUoxQixDQUFBO1FBQ0Q7WUFjQSwyQkFDVSxTQUE2QyxFQUM3QyxXQUFxQyxFQUN0QyxZQUF1QyxFQUN2QyxNQUEwQjtnQkFIekIsY0FBUyxHQUFULFNBQVMsQ0FBb0M7Z0JBQzdDLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtnQkFDdEMsaUJBQVksR0FBWixZQUFZLENBQTJCO2dCQUN2QyxXQUFNLEdBQU4sTUFBTSxDQUFvQjtnQkFFakMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO2dCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDdkIsRUFBRSxDQUFBLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUMxQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUN6QixDQUFDO1lBQ0gsQ0FBQztZQTFCUSxrQ0FBTSxHQUFiLFVBQWMsTUFBYSxFQUFFLEtBQVk7Z0JBQXpDLGlCQVVEO2dCQVRHLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO2dCQUN4RCxFQUFFLENBQUEsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUN2QyxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRTlCLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtnQkFDNUIsQ0FBQztZQUNILENBQUM7WUFpQkgsd0JBQUM7UUFBRCxDQUFDLEFBOUJDLElBOEJEO1FBOUJjLDZCQUFpQixvQkE4Qi9CLENBQUE7UUFFRDtZQXlFQSxpQ0FDVSxjQUEyQyxFQUMzQyxXQUFxQyxFQUN0QyxNQUEwQixFQUMxQixPQUEwQixFQUMxQixTQUFTLEVBQ1QsU0FBNkI7Z0JBTDVCLG1CQUFjLEdBQWQsY0FBYyxDQUE2QjtnQkFDM0MsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO2dCQUN0QyxXQUFNLEdBQU4sTUFBTSxDQUFvQjtnQkFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBbUI7Z0JBQzFCLGNBQVMsR0FBVCxTQUFTLENBQUE7Z0JBQ1QsY0FBUyxHQUFULFNBQVMsQ0FBb0I7WUFFdEMsQ0FBQztZQTVFUSwwQ0FBUSxHQUFmO2dCQUFBLGlCQTRCQztnQkExQkMsSUFBSSxVQUFVLEdBQUcsbUZBQW1GLENBQUM7Z0JBQ3JHLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxNQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDMUMsSUFBSSxTQUFTLEdBQUcsTUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDL0IsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUN4QyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDdkIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7b0JBQzdCLElBQUksSUFBSSxHQUFFO3dCQUNSLE9BQU8sRUFBRSxnQkFBZ0I7d0JBQ3pCLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYTtxQkFDM0IsQ0FBQTtvQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO29CQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO3dCQUNqRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxLQUFLLG1CQUFtQixDQUFDLENBQUMsQ0FBQzs0QkFDeEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTt3QkFDcEIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDTixLQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQzt3QkFDekIsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO2dCQUNqQyxDQUFDO1lBQ0gsQ0FBQztZQUVNLDZDQUFXLEdBQWxCLFVBQW1CLE1BQU07Z0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsR0FBRSxNQUFNLENBQUM7WUFDbEQsQ0FBQztZQUVNLDhDQUFZLEdBQW5CLFVBQW9CLE1BQU07Z0JBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLHVCQUF1QixHQUFFLE1BQU0sQ0FBQztZQUMvRCxDQUFDO1lBRU0sOENBQVksR0FBbkIsVUFBb0IsTUFBTTtnQkFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLEdBQUUsTUFBTSxDQUFDO1lBQy9ELENBQUM7WUFFSSw2Q0FBVyxHQUFsQixVQUFtQixNQUFNO2dCQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxzQkFBc0IsR0FBRyxNQUFNLENBQUM7WUFDL0QsQ0FBQztZQUNNLGdEQUFjLEdBQXJCLFVBQXNCLE1BQU07Z0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLHlCQUF5QixHQUFHLE1BQU0sQ0FBQztZQUNsRSxDQUFDO1lBQ00sMkNBQVMsR0FBaEIsVUFBaUIsYUFBYTtnQkFBOUIsaUJBT0M7Z0JBTkMsSUFBSSxJQUFJLEdBQUc7b0JBQ1QsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXO2lCQUMxQixDQUFBO2dCQUNELElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQUc7b0JBQ2pELEtBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUE7Z0JBQ3BDLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNRLDRDQUFVLEdBQWpCO2dCQUNFLElBQUksT0FBTyxHQUFHO29CQUNaLElBQUksRUFBQyxJQUFJLENBQUMsV0FBVztpQkFDdEIsQ0FBQTtnQkFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFBQSxDQUFDO1lBV04sOEJBQUM7UUFBRCxDQUFDLEFBbEZDLElBa0ZEO1FBbEZjLG1DQUF1QiwwQkFrRnJDLENBQUE7UUFDQztZQUtFLG9DQUNVLGNBQTJDLEVBQzVDLFlBQXVDO2dCQUZoRCxpQkFnQkM7Z0JBZlMsbUJBQWMsR0FBZCxjQUFjLENBQTZCO2dCQUM1QyxpQkFBWSxHQUFaLFlBQVksQ0FBMkI7Z0JBRTlDLEVBQUUsQ0FBQSxDQUFDLFlBQVksQ0FBQyxDQUFBLENBQUM7b0JBQ2YsSUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQ3ZDLElBQUksT0FBTyxHQUFHO3dCQUNaLE9BQU8sRUFBQyxJQUFJLENBQUMsV0FBVztxQkFDekIsQ0FBQTtvQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxHQUFHO3dCQUM5QyxLQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTt3QkFDM0MsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7d0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO3dCQUMxQixLQUFJLENBQUMsT0FBTyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFBO29CQUN2QyxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDO1lBQ0gsQ0FBQztZQUNILGlDQUFDO1FBQUQsQ0FBQyxBQXRCRCxJQXNCQztRQXRCWSxzQ0FBMEIsNkJBc0J0QyxDQUFBO1FBQ0QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDbkUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDckUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMzRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ2pGLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDekUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMseUJBQXlCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUNyRixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQzdGLENBQUMsRUFwakJlLFdBQVcsR0FBWCxlQUFXLEtBQVgsZUFBVyxRQW9qQjFCO0FBQUQsQ0FBQyxFQXBqQlcsR0FBRyxLQUFILEdBQUcsUUFvakJkIn0=