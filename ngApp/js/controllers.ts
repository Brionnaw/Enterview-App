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
      addPost(){
        let token = window.localStorage["token"];
        let payload = JSON.parse(window.atob(token.split('.')[1]));
        let info = {
          question: this.post,
          username:payload.username,
        }
        console.log(this.post)

        this.feedService.createPost(info).then((res) => {
          this.$state.go('Feed')

      })
        }
      constructor(
        private feedService: app.Services.FeedService,
        public $state: ng.ui.IStateService
      ){


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
          public update(){
          let info = {
            questionOne: this.questionOne,
            questionTwo: this.questionTwo,
            questionThree: this.questionThree,
            questionFour: this.questionFour,
            questionFive: this.questionFive,
            questionSix: this.questionSix,
            id: this.id
        }
          console.log(info)
          }
       constructor(
        public $stateParams: ng.ui.IStateParamsService,
        private feedService: app.Services.FeedService,
       ){
         if($stateParams){
        let seperate = $stateParams["info"].split(",");
        this.id = seperate[0]
        this.questionOne = seperate[1]
        this.questionTwo = seperate[2]
        this.questionThree = seperate[3]
        this.questionFour = seperate[4]
        this.questionFive = seperate[5]
        this.questionSix = seperate[6]
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
