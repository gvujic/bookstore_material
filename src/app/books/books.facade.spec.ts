import { map, of } from "rxjs"
import { Author, BooksFacade, BookState } from "./books.facade"
import { BooksService } from "./books.service"
import { Book } from "./models/book"

import { BookGenre } from "./models/bookGenre"

describe('BooksFacade', () => {
    let testClass: BooksFacade
    let bookServiceMock:BooksService

    let BOOKS:Book[]
    let GENRES:BookGenre[]

    beforeEach(() => {
        BOOKS = [
            {id:1, author:'Author 1', title:'Title 1', price:1, pagesNumber:1, description:'desc 1', bookGenreId:1},
            {id:2, author:'Author 2', title:'Title 2', price:2, pagesNumber:2, description:'desc 2', bookGenreId:2},
            {id:3, author:'Author 3', title:'Title 3', price:3, pagesNumber:3, description:'desc 3', bookGenreId:3},
            {id:4, author:'Author 4', title:'Title 4', price:4, pagesNumber:4, description:'desc 4', bookGenreId:4},
            {id:5, author:'Author 4', title:'Title 4', price:4, pagesNumber:4, description:'desc 4', bookGenreId:4},
            {id:6, author:'Author 3', title:'Title 3', price:3, pagesNumber:3, description:'desc 3', bookGenreId:3}
           ]
        GENRES = [
            {id:1, name:'genre 1', books:[]},
            {id:2, name:'genre 2', books:[]},
            {id:3, name:'genre 3', books:[]} 
        ]

        bookServiceMock = jasmine.createSpyObj(['updateBook', 'insertBook','getAllBooks','getAllBookGenres','removeBook'])
        bookServiceMock.getAllBooks = jasmine.createSpy().and.returnValue(of(BOOKS))
        bookServiceMock.getAllBookGenres = jasmine.createSpy().and.returnValue(of(GENRES))
        bookServiceMock.insertBook = jasmine.createSpy().and.returnValue(of(BOOKS[0]))
        bookServiceMock.updateBook = jasmine.createSpy().and.returnValue(of(BOOKS[0]))
        bookServiceMock.removeBook  =jasmine.createSpy().and.returnValue(of())

        testClass = new BooksFacade(bookServiceMock)
    })

    describe('getAuthors', () => {
        it('Should return 4 authors', () => {
            let state:BookState = { 
                books:[] = BOOKS,
                authors:[],
                genres:[] = GENRES
             }

            let authors:Author[] = testClass.getAuthors(state)

            expect(authors.length).toBe(4)
        })

        it('Should return 1 author named: Author 3', () => {
            let state:BookState = { 
                books:[] = [{id:6, author:'Author 3', title:'Title 3', price:3, pagesNumber:3, description:'desc 3', bookGenreId:3}],
                authors:[],
                genres:[] = GENRES
             }

            let authors:Author[] = testClass.getAuthors(state)

            expect(authors.length).toBe(1)
            expect(authors[0].name).toBe('Author 3')
        })

        it('Should return 2 books of Author 3', () => {
            let state:BookState = {
                books:[] = BOOKS,
                authors:[],
                genres:[] = GENRES
            }

            let authors:Author[] = testClass.getAuthors(state)

            expect(authors[2].name).toBe('Author 3')
            expect(authors[2].authorBooks.length).toBe(2)
        })

        it('Should return 2 books of Author 4', () => {
            let state:BookState = {
                books:[] = BOOKS,
                authors:[],
                genres:[] = GENRES
            }

            let authors:Author[] = testClass.getAuthors(state)

            expect(authors[3].name).toBe('Author 4')
            expect(authors[3].authorBooks.length).toBe(2)
        })

        it('Should return 1 book of Author 1', () => {
            let state:BookState = {
                books:[] = BOOKS,
                authors:[],
                genres:[] = GENRES
            }

            let authors:Author[] = testClass.getAuthors(state)

            expect(authors[0].name).toBe('Author 1')
            expect(authors[0].authorBooks.length).toBe(1)
        })

    })

    describe('updateState', () => {
        it('Should update books stream', () => {

            let updatedBook  = { id:1, author:'cc', title:'cc', description:'updated', price:44, pagesNumber:500, bookGenreId:1}
            BOOKS[0] = updatedBook
            bookServiceMock.getAllBooks = jasmine.createSpy().and.returnValue(of(BOOKS))

            testClass.update(updatedBook)

            testClass.books$.subscribe((results:Book[]) => expect(results.includes(updatedBook)).toBe(true))
        })

        it('Should add book to books stream', () => {

            let updatedBook  = { id:1, author:'cc', title:'cc', description:'updated', price:44, pagesNumber:500, bookGenreId:1}
            BOOKS[0] = updatedBook
            bookServiceMock.getAllBooks = jasmine.createSpy().and.returnValue(of(BOOKS))

            testClass.add(updatedBook)

            testClass.books$.subscribe((results:Book[]) => expect(results.includes(updatedBook)).toBe(true))
        })
    })
})