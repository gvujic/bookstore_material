import { BooksComment } from "./booksComment"
import { BooksThumbsUp } from "./booksThumbsUp"
export class Book{
    id:number
    title:string
    author:string
    pagesNumber:number
    description:string
    price:number
    bookGenreId:number
    comments:BooksComment[]
    thumbsUps:BooksThumbsUp[]
}