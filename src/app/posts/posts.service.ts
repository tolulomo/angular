import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) {}
  getPosts() {
    this.http.get<{posts: Post[]}>('http://localhost:3000/post')
      .subscribe((recData) => {
        this.posts = recData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdate() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http.post<{message: string}>('http://localhost:3000/addpost', post)
      .subscribe(recData => {
        console.log(recData);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
