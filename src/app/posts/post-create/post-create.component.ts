import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  imageSelected = false;
  post: Post;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      file: new FormControl(null, {})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getEditPost(this.postId).subscribe(post => {
          this.isLoading = false;
          const editPost = post.post[0];
          // this.post = {id: editPost._id, title: editPost.title, content: editPost.content};
          this.form.setValue({title: editPost.title, content: editPost.content});
        });
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({file});
    this.form.get('file').updateValueAndValidity();
    if (file) {
      this.imageSelected = true;
    }
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
      this.imageSelected = false;
    } else {
      this.postsService.editPost(this.postId, this.form.value.title, this.form.value.content);
      this.imageSelected = false;
      // return this.post;   === use this line if you don't want to redirect====
    }
    this.form.reset();
  }
}
