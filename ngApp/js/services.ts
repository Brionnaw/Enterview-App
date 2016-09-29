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
      return this.FeedResource.save(postData).$promise
    }
      public getAllPosts(){
        return this.FeedResource.query();
      }
      public deletePost(id) {
      return this.FeedResource.remove({id: id}).$promise
      }
    constructor(
      private $resource: ng.resource.IResourceService
    ){
      this.FeedResource = $resource('api/posts/feed/:id');


    }
  }

  angular.module('app').service('userService', UserService);
  angular.module('app').service('feedService', FeedService);

}
