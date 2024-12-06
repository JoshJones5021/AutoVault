import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';
  private subscriptionKey = "5FeMh5zGcrX55M635VUZqFn7zYdVepLrXYmF0gvDOOAzSeCpUxFg";

  constructor(private http: HttpClient) {}

  translate(texts: string[], to: string): Observable<any> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Content-Type': 'application/json'
    });

    const body = texts.map(text => ({ text }));

    return this.http.post(this.endpoint, body, { headers, params: new HttpParams().set('to', to) });
  }
}