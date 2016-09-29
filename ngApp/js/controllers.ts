//CONTROLLER PAGE FOR EACH VIEW IN APP.TS

namespace app.Controllers {
  //HOME CONSTROLLER USED FOR HOME.HTML
  export class HomeController {


// METHOD FOR LOGOUT BUTTON ON HOME.HTML
    public logout(){
            window.localStorage.removeItem('token');
            this.$state.go("Login");
          }


    constructor(
      public $state: ng.ui.IStateService

    ) {

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
    constructor( private  userService: app.Services.UserService,
                  public $state: ng.ui.IStateService
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
      public user;
      public register(){
        this.userService.register(this.user).then((res) => {
          if(res.message === "username already exist") {
            alert(res.message);
          } else {
            this.$state.go("Home");
          }
        });
  }
      constructor(
        private userService: app.Services.UserService,
        public $state: ng.ui.IStateService
      ){
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
            question: this.post,
            username:payload.username,
            interviewType:'Phone Screen'
          }
          this.feedService.createPost(info).then((res) => {
            this.$state.go('Feed')
          })
        } else if (this.optionTwo === 'checked'){
          console.log(this.optionTwo)
          let token = window.localStorage["token"];
          let payload = JSON.parse(window.atob(token.split('.')[1]));
          let info = {
            question: this.post,
            username:payload.username,
            interviewType:'In-Person 1:1'
          }
          this.feedService.createPost(info).then((res) => {
            this.$state.go('Feed')
          })
        } else if(this.optionThree ==='checked'){
          console.log(this.optionThree)
          let token = window.localStorage["token"];
          let payload = JSON.parse(window.atob(token.split('.')[1]));
          let info = {
            question: this.post,
            username:payload.username,
            interviewType:'Group/Panel'
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
          public questionOne;
          public questionTwo;
          public questionThree;
          public questionFour;
          public questionFive;
          public questionSix;
          public id;
          public interviewType;
          public update(){
          let info = {
            question: {
              one: this.questionOne,
              two: this.questionTwo,
              three: this.questionThree,
              four: this.questionFour,
              five: this.questionFive,
              six: this.questionSix,
            },
            id: this.id,
            interviewType: this.interviewType

        }
        this.feedService.createPost(info).then((res) =>  {
                  this.$state.go('Feed')
                })          }
       constructor(
        public $stateParams: ng.ui.IStateParamsService,
        private feedService: app.Services.FeedService,
        public $state:ng.ui.IStateService
      ){
         if($stateParams){
        let seperate = $stateParams["info"].split(",");
          this.id = seperate[0]
          this.interviewType = seperate[1]
          this.questionOne = seperate[2]
          this.questionTwo = seperate[3]
          this.questionThree = seperate[4]
          this.questionFour = seperate[5]
          this.questionFive = seperate[6]
          this.questionSix = seperate[7]
      }
      else {
        console.log('Do not exist!')
      }
       }
     }

  angular.module('app').controller('HomeController', HomeController);
  angular.module('app').controller('LoginController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('LandingPageController', LandingPageController);
  angular.module('app').controller('FeedController', FeedController);
  angular.module('app').controller('EditController', EditController);





}
