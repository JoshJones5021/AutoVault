import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';
  private subscriptionKey = '3KTXrYl3JAV0xIW9NKQ6sM937gcLhhPLkrXFGKAqvMNkGztRVbbTJQQJ99ALACmepeSXJ3w3AAAbACOGAMlQ';
  private location = 'uksouth'; // Add location
  private language: string = 'en'; // Default language

  constructor(private http: HttpClient) {}

  setLanguage(language: string): void {
    this.language = language;
  }

  translate(texts: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Ocp-Apim-Subscription-Region': this.location, // Add location header
      'Content-Type': 'application/json'
    });

    const body = texts.map(text => ({ text }));

    return this.http.post(this.endpoint, body, { headers, params: new HttpParams().set('to', this.language) });
  }
}