namespace app.Services {
  // UserService for users.ts
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
  // Feed service for post.ts
  export class FeedService {
      public FeedResource;
      public createPost(postData) {
      let post = {
        text: postData.text,
        id: postData.id,
        author:postData.username
      }
      console.log(postData)
      return this.FeedResource.save(post).$promise 
    }
    constructor(
      private $resource: ng.resource.IResourceService
    ){

    }

  }

  angular.module('app').service('userService', UserService);
  angular.module('app').service('feedService', FeedService);

}
