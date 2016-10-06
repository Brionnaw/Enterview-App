  namespace app.Controllers {
  //home.html
  export class HomeController {
    public file;
    public id;
    public photoUrl;
    public username;
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
      console.log(file)
      let fileInfo = {
        url:file.url,
        id:this.id
      }
      console.log(fileInfo)
      this.userService.updateUserImage(fileInfo).then((res) => {
      })
    }
    constructor(
      public $state: ng.ui.IStateService,
      private userService: app.Services.UserService,
      public $stateParams: ng.ui.IStateParamsService,
      private filepickerService,
      private $scope: ng.IScope
    ) {
      let token = window.localStorage["token"];
      let payload = JSON.parse(window.atob(token.split('.')[1]));
      if(token) {
        this.username = payload.username
        this.id = payload.id,
        this.photoUrl = payload.photoUrl
        console.log('logged in')
      } else {
        this.$state.go('Login')
      }
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
    constructor(){
      let token = window.localStorage["token"];
      if(token){ // does this variable 'token' exist? "truthy statement"
      this.loggedIn = true
    } else {
      this.loggedIn = false;
    }
  }
}
  //SHOW POSTS IN FEED.HTML
  export class FeedController{
    public posts;
    public remove(postId:string, index:number) {
      let answer = confirm('Are you sure you want to delete?')
      if(answer === true) {
        this.feedService.deletePost(postId).then(() => {
          this.posts.splice(index, 1);
        });
      } else {
        console.log('not deleted')
      }
    }
    constructor(
      private feedService: app.Services.FeedService,
      public $state: ng.ui.IStateService
    ){
      this.posts = this.feedService.getAllPosts();
    }
  }
  //CREATE POSTS IN CREATEPOST.HTML
  export class CreatePostController {
    public position;
    public post;
    public optionOne;
    public optionTwo;
    public optionThree;
    public addPost(){
      //TYPE OF INTERVIEW
      if(this.optionOne === 'checked') {
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
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
      public $state: ng.ui.IStateService
    ){
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
    public optionOne;
    public optionTwo;
    public optionThree;
    public id;
    public interviewType;
    public update(){
      //UPDATE INTERVIEW TYPE
      if(this.optionOne === 'checked') {
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          id: this.id,
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
          id: this.id,
          username:payload.username,
          interviewType:'In-Person 1:1',
          positionTitle:this.position,
          question: this.post,
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Feed')
        })
      } else if(this.optionThree ==='checked'){
        console.log(this.optionThree)
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          id: this.id,
          username:payload.username,
          interviewType:'Group/Panel',
          positionTitle:this.position,
          question: this.post,
        }
        this.feedService.createPost(info).then((res) => {
          this.$state.go('Feed')
        })
      }
    }
    //INTERVIEW TYPE CHECK() METHOD
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
        // set values to false
        this.optionOne = false;
        this.optionTwo = false;
        this.optionThree = false;
      }
      else {
        console.log('Do not exist!')
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
    public research(){
      let info ={
        company: this.companyName,
        domain: this.companyDomain
      }
      console.log(info)
      this.companyService.researchCompany(info).then((res) => {
        this.companyData = (JSON.parse(res.body))
        console.log(JSON.parse(res.body)) // turn into json into actual object.
      })
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
    constructor(
      private companyService: app.Services.CompanyService,
      public $stateParams: ng.ui.IStateParamsService
    ){
      if($stateParams){
        this.companyName = $stateParams['info']
        let company = {
          name:this.companyName
        }
        this.companyService.glassdoor(company).then((res) => {
          this.glassdoorData = (JSON.parse(res.body))
          console.log(JSON.parse(res.body))
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
