  namespace app.Controllers {
  //home.html
  export class HomeController {
    public file;
    public id;
    public photoUrl;
    public username;
    public interviewVideo;
    public payload;
    public user;
    // logout in home.html
    public logout(){
      window.localStorage.removeItem('token');
      this.$state.go("Login");
    }
    public pickFile() {
      this.filepickerService.pick(
        { mimetype: 'image/*' },
        this.fileUploaded.bind(this)
      );
    }

    public fileUploaded(file) {
      let fileInfo = {
        url:file.url,
        id:this.id
      }
      this.userService.updateUserImage(fileInfo).then((res) => {
        this.$state.go('Home').then (() => {
          location.reload();
        })
      })
    }
    constructor(
      public $state: ng.ui.IStateService,
      private userService: app.Services.UserService,
      public $stateParams: ng.ui.IStateParamsService,
      private filepickerService,
      public $scope: ng.IScope,
    ) {
      let token = window.localStorage["token"];
      let payload = JSON.parse(window.atob(token.split('.')[1]));
        this.id = payload.id;
        this.user = this.userService.getUser();

    }
  }
  //LOGIN USER IN LOGIN.HTML
  export class LoginController {
    public user;
    public login(){
      this.userService.login(this.user).then((res) => {
        if(res.message === "Correct"){
          window.localStorage["token" ] =res.jwt;
          this.$state.go('Home');
        } else {
          alert(res.message);
        }
      });
    }
    constructor(
      private  userService: app.Services.UserService,
      public $state: ng.ui.IStateService,
    ){
      // TOKEN
      let token = window.localStorage["token"];
      if(token) {
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        if(payload.exp > Date.now()/ 1000) {
          this.$state.go('Home');
        }
      }
    }
  }   //REGISTER USER IN REGISTER.HTML
  export class RegisterController{
    public id;
    public user;
    public photoUrl;
    public register(){
      this.user.photoUrl = this.photoUrl,
      this.userService.register(this.user).then((res) => {
        if(res.message === "username already exist") {
          alert(res.message);
        } else {
          window.localStorage["token" ] =res.token;
          this.$state.go("Home");
        }
      });
    }
    public pickFile() {

      this.filepickerService.pick(
        { mimetype: 'image/*' },
        this.fileUploaded.bind(this)
      );
    }
    public fileUploaded(file) {
      this.photoUrl = file.url
    }
    constructor(
      private userService: app.Services.UserService,
      public $state: ng.ui.IStateService,
      private filepickerService,
      ){
      let token = window.localStorage["token"];
      if(token) {
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        if(payload.exp > Date.now()/ 1000) {
          this.$state.go('Home');
        }
      }
    }
  }
  export class LandingPageController {
    public loggedIn;
    constructor(
      private userService: app.Services.UserService,

    ){

      let token = window.localStorage["token"];
      if(token){ // does this variable 'token' exist? "truthy statement"
      this .loggedIn = true
    } else {
      this.loggedIn = false;
    }
  }
}
  //SHOW POSTS IN FEED.HTML
  export class FeedController{
    public posts;
    public companyName;
    public companyDomain;
    public id;

    public remove(postId:string, index:number) {
      let answer = confirm('Are you sure you want to delete?')
      if(answer === true) {
        this.feedService.deletePost(postId).then(() => {
          this.posts.splice(index, 1);
        });
      } else {
        console.log('not deleted')
      }
      let token = window.localStorage["token"];
      let payload = JSON.parse(window.atob(token.split('.')[1]));
      let info = {
        name: this.companyName,
        domain: this.companyDomain
      }
    }
    constructor(
      private feedService: app.Services.FeedService,
      public $stateParams: ng.ui.IStateParamsService,
      public $state: ng.ui.IStateService,
      public $scope,
    ){
      if($stateParams){
        let seperate = $stateParams["info"].split(",");
        this.companyName = seperate[0]
        console.log(this.companyName)
        this.companyDomain = seperate[1]
        let company = {
          name: this.companyName,
          domain: this.companyDomain,
        }
        this.posts = this.feedService.getAllPosts(this.companyName);
        console.log(this.posts.length);
        if(this.posts.length < 1) {
          console.log('not found');
          this.$scope.notFound === true;
          this.$scope.found === false;
          this.$scope.$apply();
        } else {
          this.$scope.found === true;
          this.$scope.found === false;
          this.$scope.$apply();
          console.log('found');
        }
      }
    }
  }
  //CREATE POSTS IN CREATEPOST.HTML
  export class CreatePostController {
    public position;
    public post;
    public optionOne;
    public optionTwo;
    public optionThree;
    public companyName;
    public companyDomain;
    public addPost(){
      //TYPE OF INTERVIEW
      if(this.optionOne === 'checked') {
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          name: this.companyName,
          domain: this.companyDomain,
          authorPhoto: payload.photoUrl,
          username:payload.username,
          interviewType:'Phone Screen',
          positionTitle:this.position,
          question: this.post
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Feed')
        })
      } else if (this.optionTwo === 'checked'){
        console.log(this.optionTwo)
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          name: this.companyName,
          domain: this.companyDomain,
          authorPhoto: payload.photoUrl,
          username:payload.username,
          interviewType:'In Person 1:1',
          positionTitle:this.position,
          question: this.post
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Feed')
        })
      } else if(this.optionThree ==='checked'){
        console.log(this.optionThree)
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          name: this.companyName,
          domain: this.companyDomain,
          authorPhoto: payload.photoUrl,
          username:payload.username,
          interviewType:'Group/Panel',
          positionTitle:this.position,
          question: this.post
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Feed')
        })
      }
    }
    public check(num) {
      console.log(num)
      if(num === 'one'){
        this.optionOne = 'checked';
        console.log(this.optionOne)
      } else if(num === 'two') {
        this.optionTwo = 'checked';
        console.log(this.optionTwo)
      } else if (num === 'three') {
        this.optionThree = 'checked';
      }
    }
    constructor(
      private feedService: app.Services.FeedService,
      public $stateParams: ng.ui.IStateParamsService,
      public $state: ng.ui.IStateService,
    ){
      if($stateParams){
        let seperate = $stateParams["info"].split(",");
        this.companyName = seperate[0]
        this.companyDomain = seperate[1]
        let company = {
          company:this.companyName,
          domain:this.companyDomain
        }
        console.log(this.companyName)
      }
      // set values to false
      this.optionOne = false;
      this.optionTwo = false;
      this.optionThree = false;
    }
  }
  //UPDATE POST IN EDITPOST.HTML
  export class EditController {
    public position;
    public post;
    public postOne;
    public postTwo;
    public postThree;
    public postFour;
    public postFive;
    public postSix;
    public optionOne;
    public optionTwo;
    public optionThree;
    public inputOne;
    public inputTwo;
    public inputThree;
    public id;
    public interviewType;
    public tag;
    public companyDomain;
    public authorPhoto;
    public update(){
      //UPDATE INTERVIEW TYPE
      if(this.optionOne === 'checked') {
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          authorPhoto:this.authorPhoto,
          domain:this.companyDomain,
          id: this.id,
          username:payload.username,
          interviewType:'Phone Screen',
          positionTitle:this.position,
          question: {
            one:this.postOne,
            two:this.postTwo,
            three:this.postThree,
            four:this.postFour,
            five:this.postFive,
            six: this.postSix
          },
          tag: this.tag,
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Profile')
        })
      } else if (this.optionTwo === 'checked'){
        console.log(this.optionTwo)
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          authorPhoto:this.authorPhoto,
          domain:this.companyDomain,
          id: this.id,
          username:payload.username,
          interviewType:'In-Person 1:1',
          positionTitle:this.position,
          question: {
            one:this.postOne,
            two:this.postTwo,
            three:this.postThree,
            four:this.postFour,
            five:this.postFive,
            six: this.postSix
          },
          tag: this.tag
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Profile')
        })
      } else if(this.optionThree ==='checked'){
        console.log(this.optionThree)
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          authorPhoto:this.authorPhoto,
          domain:this.companyDomain,
          id: this.id,
          username:payload.username,
          interviewType:'Group/Panel',
          positionTitle:this.position,
          question: {
            one:this.postOne,
            two:this.postTwo,
            three:this.postThree,
            four:this.postFour,
            five:this.postFive,
            six: this.postSix
          },
          tag: this.tag
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Profile')
        })
      }
    }
    //INTERVIEW TYPE CHECK() METHOD
    public check(num) {
      console.log(num)
      if(num === 'one'){
        this.optionOne = 'checked';
        this.inputOne = true;

        console.log(this.optionOne)
        console.log(this.inputOne)

      } else if(num === 'two') {
        this.optionTwo = 'checked';
        this.inputTwo= true;

        console.log(this.optionTwo)
        console.log(this.inputTwo)

      } else if (num === 'three') {
        this.optionThree = 'checked';
        this.inputThree = true;

        console.log(this.optionThree)
        console.log(this.inputThree)
      }
    }
    //QUESTION UPDATE
    constructor(
      public $stateParams: ng.ui.IStateParamsService,
      private feedService: app.Services.FeedService,
      public $state:ng.ui.IStateService
      ){
        if($stateParams){
          let seperate = $stateParams["info"].split(",");
          this.id = seperate[0]
          this.interviewType = seperate[1]
          this.companyDomain = seperate[2]
          this.position = seperate[3]
          this.postOne = seperate[4]
          this.postTwo = seperate[5]
          this.postThree = seperate[6]
          this.postFour = seperate[7]
          this.postFive = seperate[8]
          this.postSix = seperate[9]
          this.tag = seperate[10]
          this.authorPhoto = seperate[11]
          console.log(this.companyDomain)

          // set values to false
          if(this.interviewType === 'Phone Screen'){
            this.optionOne = 'checked';
            this.inputOne = true;
          } else if (this.interviewType === 'In-Person 1:1') {
            this.optionTwo = 'checked';
            this.inputTwo= true;
        } else if  (this.interviewType === 'Group/Panel') {
            this.optionThree = 'checked';
            this.inputThree = true;
      } else {
        console.log('Do not exist!')
      }
    }
  }
}
  export class ProfileController{
      public posts;
      // Delete Comment
      public remove(postId:string, index:number) {
        let answer = confirm('Are you sure you want to delete?')
        if(answer === true) {
          this.feedService.deletePost(postId).then(() => {
            this.posts.splice(index, 1);
            //splice - take out the array
          });
        } else {
        console.log('not deleted')
      }
    }
    constructor(
      private $uibModal: angular.ui.bootstrap.IModalService,
      private feedService: app.Services.FeedService,
      public $stateParams: ng.ui.IStateParamsService,
      public $state:ng.ui.IStateService
    ) {
      let token = window.localStorage["token"];
      let payload = JSON.parse(window.atob(token.split('.')[1]));
      this.posts = this.feedService.getAllProfilePosts(payload.username) // this line get all posts
      console.log(this.posts)
      if(token) {
        console.log('logged in') // redirect user to login if token is expired.
      } else {
        this.$state.go('Login')
      }
    }
  }
  //  SEARCHCOMPANY.HTML
  export class SearchCompanyController {
    public companyName;
    public companyDomain;
    public companyData;
    public addReview;
    public research(){
      //form validation
      let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
      let regex = new RegExp(expression);
      let url = this.companyDomain;
      if (url.match(regex)) {
        let name = this.companyName;
        let seperated = name.split('');
        let result = seperated[0].toUpperCase();
        seperated.splice(0, 1);
        seperated.unshift(result);
        let uppercaseCompany = seperated.join('')
        let info ={
          company: uppercaseCompany,
          domain: this.companyDomain
        }
        this.companyService.researchCompany(info).then((res) => {
          if (res.message === 'company not found') {
            alert(res.message)
          } else {
            this.companyData = res;
          }
        })
      }
    }
    //webpage click //change to external href
    public goToWebsite(domain) {
      console.log(this.$location.url)
      this.$window.location.href = 'https://'+ domain;
    }
    //webpage click //change to external href
    public goToLinkedin(handle) {
      console.log(this.$location.url)
      this.$window.location.href = 'https://linkedin.com/'+ handle;
    }
    //webpage click //change to external href
    public goToFacebook(handle) {
      console.log(this.$location.url)
      this.$window.location.href = 'https://facebook.com/'+ handle;
    }
  //twitter click //change to external href
  public goToTwitter(handle) {
    console.log(this.$location.url)
    this.$window.location.href = 'https://twitter.com/' + handle;
  }
  public goToCrunchBase(handle) {
    console.log(this.$location.url)
    this.$window.location.href = 'https://crunchbase.com/' + handle;
  }
  public glassdoor(glassdoorInfo){
    let info = {
      company: this.companyName
    }
    this.companyService.researchCompany(info).then((res) => {
      this.$state.go('CompanyGlassdoor')
    })
  }
  constructor(
    private companyService: app.Services.CompanyService,
    public $state:ng.ui.IStateService,
    public $window: ng.IWindowService,
    public $document,
    public $location:ng.ILocationService
  ){
  }
}
  export class CompanyGlassdoorController{
      public glassdoorData;
      public companyName;
      public reviews;
      public employer;
    constructor(
      private companyService: app.Services.CompanyService,
      public $stateParams: ng.ui.IStateParamsService
    ){
      if($stateParams){
        this.companyName = $stateParams['info']
        let company = {
          company:this.companyName
        }
        this.companyService.glassdoor(company).then((res) => {
          this.glassdoorData = (JSON.parse(res.body))
          this.employer = this.glassdoorData.response.employers[0]
          console.log(this.employer)
          this.reviews = this.employer.featured
        })
      }
    }
  }
  angular.module('app').controller('HomeController', HomeController);
  angular.module('app').controller('LoginController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('LandingPageController', LandingPageController);
  angular.module('app').controller('FeedController', FeedController);
  angular.module('app').controller('EditController', EditController);
  angular.module('app').controller('ProfileController', ProfileController);
  angular.module('app').controller('SearchCompanyController', SearchCompanyController);
  angular.module('app').controller('CompanyGlassdoorController', CompanyGlassdoorController);
}
