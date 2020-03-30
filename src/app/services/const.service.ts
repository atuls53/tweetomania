import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstService {
  public baseUrl: string = 'https://tweetobacend.herokuapp.com';
  constructor() {
    if (window.location.hostname == 'localhost') {
      this.baseUrl = 'http://192.168.1.55:8000';
    }
  }



}
