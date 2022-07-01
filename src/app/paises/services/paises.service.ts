import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/pais.interface';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _regiones: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];
  private _baseUrl: string = 'https://restcountries.com/v2'; 
  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) {}

  getPaisesByRegion(region: string): Observable<PaisSmall[]>{
    const url: string = `${this._baseUrl}/region/${region}?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>(url);
  }
  getPaisesByCode(code: string): Observable<Pais| null>{
    if(!code){
      return of(null);
    }
    const url: string = `${this._baseUrl}/alpha/${code}`
    return this.http.get<Pais>(url);
  }
}
