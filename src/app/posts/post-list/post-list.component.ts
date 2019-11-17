import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: `This is my first post's content`},
  //   {title: 'Second Post', content: `This is my second post's content`},
  //   {title: 'Third Post', content: `This is my third post's content`}
  // ];
  posts: Post[] = [];
  private postListPageSubscription;

  constructor(public postsService: PostsService) {}
  ngOnInit() {
    this.postsService.getPosts();
    this.postListPageSubscription = this.postsService.getPostUpdate()
      .subscribe((post: Post[]) => {
        this.posts = post;
      });
  }

  ngOnDestroy() {
    this.postListPageSubscription.unsubscribe();
  }
}
