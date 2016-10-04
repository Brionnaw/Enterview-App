namespace app.Services {
  // UserService for users.ts
  export class UserService {
      public RegisterResource;
      public LoginResource;
      public PhotoResource;
      public login(user){
        return this.LoginResource.save(user).$promise;
      }
      public register(user){
        return this.RegisterResource.save(user).$promise;
      }
      public updateUserImage(url){
        return this.PhotoResource.save(url).$promise
      }
      constructor(
        $resource:ng.resource.IResourceService
      ){
        this.RegisterResource = $resource('api/users/register');
        this.LoginResource = $resource('api/users/login');
        this.PhotoResource = $resource('api/users/photo');
      }
  }
  // Feed service for post.ts
  export class FeedService {
      public FeedResource;
      public createPost(postData) {
        console.log(postData)
        let post = {
        id: postData.id,
        author:postData.username,
        interviewType:postData.interviewType,
        positionTitle:postData.postion,
        text: postData.text
      }
      return this.FeedResource.save(postData).$promise
    }
      public getAllPosts(){
        return this.FeedResource.query();
      }
      public deletePost(id) {
      return this.FeedResource.remove({id: id}).$promise
      }
      public getAllProfilePosts(username){
          return this.FeedResource.query({id:username});
        }
    constructor(
      private $resource: ng.resource.IResourceService
    ){
      this.FeedResource = $resource('api/posts/feed/:id');
    }
  }
      //Company.html
    export class CompanyService {
          public CompanyResource;
          public researchCompany(companyInfo){
            let company = {
              company: companyInfo.company,
              domain: companyInfo.domain
            }
            console.log(company)
            return this.CompanyResource.save(companyInfo);

          }
    constructor(
      private $resource: ng.resource.IResourceService

    ){
      this.CompanyResource = $resource('api/company/');

    }
  }
  angular.module('app').service('userService', UserService);
  angular.module('app').service('feedService', FeedService);
  angular.module('app').service('companyService', CompanyService);

}
