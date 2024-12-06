import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private endpoint = 'https://autovaulttranslate.cognitiveservices.azure.com/language/:query-knowledgebases?projectName=autovault&api-version=2021-10-01&deploymentName=production';
//   here

  constructor(private http: HttpClient) {}

  sendMessage(question: string): Observable<any> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': this.subscriptionKey,
      'Content-Type': 'application/json'
    });

    const body = {
      top: 3,
      question: question,
      includeUnstructuredSources: true,
      confidenceScoreThreshold: 0.5,
      answerSpanRequest: {
        enable: true,
        topAnswersWithSpan: 1,
        confidenceScoreThreshold: 0.5
      },
      filters: {
        metadataFilter: {
          logicalOperation: 'AND',
          metadata: []
        }
      }
    };

    return this.http.post(this.endpoint, body, { headers });
  }
}