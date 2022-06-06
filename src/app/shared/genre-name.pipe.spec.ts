import { BookGenre } from "../books/models/bookGenre";
import { GenreNamePipe } from "./genre-name.pipe";

describe('GenreNamePipe', () => {

    let pipe;
    let genres:BookGenre[];
    beforeEach(() => {
        genres = 
        [
            { id:1, name:'Action and Adventure', books:[]},
            { id:2, name:'Classics', books:[]},
            { id:3, name:'Comic Book or Graphic Novel', books:[]},
            { id:4, name:'Detective and Mystery', books:[]},
            { id:5, name:'Fantasy', books:[]},
            { id:6, name:'Historical Fiction', books:[]},
            { id:7, name:'Horror', books:[]},
            { id:8, name:'Literary Fiction', books:[]}
        ]
    })

    it('Should transform 1 to  Action and Adventure', () => {
        pipe = new GenreNamePipe();
        expect(pipe.transform(1, genres)).toEqual('Action and Adventure')
    })

    it('Should transform 7 to  Horror', () => {
        pipe = new GenreNamePipe();
        expect(pipe.transform(7, genres)).toEqual('Horror')
    })

    it('Should transform 3 to  Comic Book or Graphic Novel', () => {
        pipe = new GenreNamePipe();
        expect(pipe.transform(3, genres)).toEqual('Comic Book or Graphic Novel')
    })

    it('Should transform 9 to  undefined', () => {
        pipe = new GenreNamePipe();
        let val =  pipe.transform(9, genres)
        expect(val).toEqual(undefined)
    })

    it('Should return undefined if receives empty array of genres', () => {
        pipe = new GenreNamePipe();
        let val =  pipe.transform(8, [])
        expect(val).toEqual(undefined)
    })
})