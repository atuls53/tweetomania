import { ConstService } from './const.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {EventSourcePolyfill} from 'ng-event-source';
@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor(private http: HttpClient, private constService: ConstService) { }

  tweetSearch(data){
    return this.http.post( `${this.constService.baseUrl}/search/`, data);
  }

  searchTweets(channel): Observable<Object> {
      return new Observable(observer => {
        let eventSource = new EventSource(`${this.constService.baseUrl}/events/?channel=${channel}`);
        // console.log(eventSource)
        eventSource.addEventListener('data', event =>{
          let parsedData = JSON.parse(event['data']);
          if(parsedData['status']=="DONE")
            eventSource.close();
          observer.next({data: parsedData, eventStream: eventSource})
        })  
        
      })
  }
}
