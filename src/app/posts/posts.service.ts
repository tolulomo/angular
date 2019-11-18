import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{posts: any }>('http://localhost:3000/posts/')
      .pipe(map(recievedPosts => {
        return recievedPosts.posts.map(el => {
          return {
            id: el._id,
            title: el.title,
            content: el.content
          };
        });
      }))
      .subscribe((recData) => {
        this.posts = recData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdate() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{posts: string}>('http://localhost:3000/posts/addpost', post)
      .subscribe(recData => {
        post.id = recData.posts;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  editPost(postId: string, title: string, content: string) {
    const update = {title, content};
    this.http.patch('http://localhost:3000/posts/edit-post/' + postId, update)
      .subscribe(recData => {
        const allPosts = [...this.posts];
        const updatedPostIndex = allPosts.findIndex(el => el.id === postId);
        allPosts[updatedPostIndex] = {id: postId, title, content};
        this.posts = allPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getEditPost(postId: string) {
    // return {...this.posts.find(post => post.id === postId)};
    return this.http.get<any>('http://localhost:3000/posts/singlepost/' + postId);
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/posts/post-delete/' + postId)
      .subscribe(recData => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
