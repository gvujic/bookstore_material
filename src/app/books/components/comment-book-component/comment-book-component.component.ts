import { formatCurrency } from '@angular/common';
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-book-component',
  templateUrl: './comment-book-component.component.html',
  styleUrls: ['./comment-book-component.component.scss']
})
export class CommentBookComponent {
  headline:string = ''
  commentForm:FormGroup
  constructor(private dialogRef: MatDialogRef<CommentBookComponent>, @Inject(MAT_DIALOG_DATA) data:any) {
    this.headline = 'Leave comment on ' + "'" + data.book.title + "'"

    this.commentForm = new FormGroup({
      id: new FormControl(0),
      bookId: new FormControl(data.book.id),
      userName: new FormControl(localStorage.getItem('user')),
      plainComment: new FormControl('', Validators.required),
      date: new FormControl(new Date())
    })
   }

  postComment(){
    this.dialogRef.close(this.commentForm.value)
  }

  dismiss(){
    this.dialogRef.close()
  }
}
