import { Pipe, PipeTransform } from "@angular/core";
import { BookGenre } from "../books/models/bookGenre";

@Pipe({name:'genreName'})
export class GenreNamePipe implements PipeTransform{    
    transform(value: number, args:BookGenre[]):string | undefined{
        if(args){
            return args.find(x => {
                return x.id == value
            })?.name
        }
        return "";
    }
}