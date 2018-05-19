import * as Config from '../config/config';


export class WordpressService {
  //constructor(public http){}

  static getRecentPosts(categoryId, page = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return fetch(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + '&per_page=' + Config.QUERY_SIZE
      + '&fields=id,title.rendered'
      + category_url)
    .map(res => res.json());
  }

  static getComments(postId, page = 1){
    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + "comments?post=" + postId
      + '&page=' + page)
    .then(res => res.json());
  }

  static getAuthor(author){
    return fetch(Config.WORDPRESS_REST_API_URL + "users/" + author)
    .then(res => res.json());
  }

  static getPostCategories(post){
    let observableBatch = [];

    post.categories.forEach(category => {
      observableBatch.push(this.getCategory(category));
    });

    return Observable.forkJoin(observableBatch);
  }

  static getCategory(categoryId){
    return fetch(Config.WORDPRESS_REST_API_URL + "categories/" + categoryId)
    .then(res => res.json());
  }

  static getCategories(categoryId, page = 1,order="desc", orderby = "slug") {
    return fetch(Config.WORDPRESS_REST_API_URL + "categories?orderby=" + orderby + "&order=" + order + "&page=" + page + (categoryId ? "&parent=" + categoryId : ""))
    .then(res => res.json());
  }


  static getPosts(categoryId, page = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return fetch(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + '&per_page=' + Config.QUERY_SIZE_BIG
      + '&fields=id,title.rendered'
      + '&order=asc'
      + category_url)
    .then(res => res.json());
  }

  static getPost(postId){
    return this.http.get(Config.WORDPRESS_REST_API_URL + "posts/" + postId)
    .then(res => res.json());
  }

  static getGallery(categoryId, page = 1){
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return fetch(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + '&per_page=' + Config.QUERY_SIZE_GALLERY
     // + '&fields=id,title.rendered,featured_media,_links'
      + category_url)
    .then(res => res.json());
  }

  static createComment(postId, user, comment){
    let header = new Headers();
    header.append('Authorization', 'Bearer ' + user.token);

    return fetch(Config.WORDPRESS_REST_API_URL + "comments?token=" + user.token, {
      author_name: user.displayname,
      author_email: user.email,
      post: postId,
      content: comment
    },{ headers: header })
    .then(res => res.json());
  }
}
