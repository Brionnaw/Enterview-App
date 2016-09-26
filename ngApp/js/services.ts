namespace app.Services {
  export class UserService {
      public RegisterResource;
      public LoginResource;

      public login(user){
        return this.LoginResource.save(user).$promise;
      }
      public register(user){
        return this.RegisterResource.save(user).$promise;
      }
      constructor(
        $resource:ng.resource.IResourceService
      ){
        this.RegisterResource = $resource('api/users/register');
        this.LoginResource = $resource('api/users/login');
      }
  }
  angular.module('app').service('userService', UserService)

}
