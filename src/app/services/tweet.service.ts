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
  exportHeaders = [];
  tweetSearch(data){
    return this.http.post( `${this.constService.baseUrl}/search/`, data);
  }

  
    

  downloadFile(data, filename='data') {
    console.log(this.exportHeaders);
  
    let csvData = this.ConvertToCSV(data, ["dateTime", "date", "time", "screenName", "name", "tweetId", "tweet", "retweet", "source", "likes", "followers", "follows", "favourities", "location", "memberSince"]);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}

ConvertToCSV(objArray, headerList) {
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     let str = '';
     let row = 'S.No,';

     for (let index in headerList) {
         row += headerList[index] + ',';
     }
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = '';
         for (let index in headerList) {
            let head = headerList[index];

             line += ',' + array[i][head];
         }
         str += line + '\r\n';
     }
     return str;
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
