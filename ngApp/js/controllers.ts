namespace app.Controllers {
  export class HomeController {


// method for logout button
    public logout(){
            window.localStorage.removeItem('token');
            this.$state.go("Login");
          }


    constructor(
      public $state: ng.ui.IStateService

    ) {

    }
  }
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
}
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
  angular.module('app').controller('HomeController', HomeController);
  angular.module('app').controller('LoginController', LoginController);
  angular.module('app').controller('RegisterController', RegisterController);
  angular.module('app').controller('LandingPageController', LandingPageController);



}
