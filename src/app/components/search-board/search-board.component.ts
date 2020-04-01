import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { TweetService } from '../../services/tweet.service';
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import uuidV4 from 'uuid/v4';
declare var SiteJS: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './search-board.component.html',
  providers: [TweetService]
})
export class SearchBoardComponent implements OnInit {
  testData =[
    {  
      "dateTime":"2018-08-27T10:00:53",
      "date":"2018-08-27",
      "time": "23:59:01",
      "likes":0,
      "name":"Manish Pareek",
      "retweet":0,
      "screenName":"mpjpr00",
      "source":"Twitter for Android",
      "tweet":"@BBCBreaking @NewYorkTimesGHS @PTI_News @aajtak @ZeeNews @indiatvnews @rpbreakingnews @danikbhaskar @freepress Rahu… https://t.co/4S1gqE0Qcm",
      "tweetId":"1033141662753554432",
      "user":{  
        "favourities":15,
        "followers":48,
        "follows":58,
        "location":"Jaipur, India",
        "memberSince":"2014-02-05"
      }
    },
    {  
    "dateTime":"2018-08-27T08:00:53",
    "date":"2018-08-27",
    "time": "20:59:01",
    "likes":10,
    "name":"abc Pareek",
    "retweet":50,
    "screenName":"mpvcxr00",
    "source":"Twitter for Android",
    "tweet":" @PTI_News @aajtak @ZeeNews @indiatvnews @rpbreakingnews @danikbhaskar @freepress Rahu… https://t.co/4S1gqE0Qcm",
    "tweetId":"1033141662753554432",
    "user":{  
      "favourities":95,
      "followers":100,
      "follows":20,
      "location":"Jaipur, India",
      "memberSince":"2014-02-05"
    }
    }
  ]


  searchForm: FormGroup;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  tweets: any;
  copyTweets: any;

  defaultFilter: any = {
    sortField: '',
    sortOrder: '1',
    pageSize: '20'
  }

  totalTweets: Number = 0;
  searchData: any = {query:'', until:'', geocode: '', channel: ''};
  startIndex: number = 0;
  endIndex: number = 0;
  latitude: any;
  longitude: any;
  searchStart: boolean = false;

  constructor(private formBuilder: FormBuilder, private TweetService: TweetService) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      query: [''],
      since: [''],
      until: [''],
      radius: [''],
      location:['']
    });
    // this.tweets = this.testData
    // this.copyTweets = this.tweets;
    // console.log(this.copyTweets)
    // this.totalTweets = 2;
  }

  Sidebar(){
    SiteJS.openSidebar();
  }

  onSubmit(){
    //window.document.getElementById("seaarchButton").click(); // Use to close the side bar
    if(this.searchForm.value.query){
      this.totalTweets = 0;
      this.tweets = [] 
      this.copyTweets = []
  
      const channel = uuidV4();
      if(this.searchForm.value.since)
        this.searchData.query = `${this.searchForm.value.query} since:${this.searchForm.value.since}`  ;
      else
        this.searchData.query = this.searchForm.value.query
  
      this.searchData.until = this.searchForm.value.until;
      this.search(channel);
      this.searchTweets(channel);
    }
  }

  search(channel){
    this.searchStart = true;
    if(this.latitude && this.longitude && !this.searchForm.value.radius)
      this.searchForm.controls.radius.setValue('10')
    if(this.searchForm.value.radius && this.latitude && this.longitude)
      this.searchData.geocode = `${this.latitude},${this.longitude},${this.searchForm.value.radius}mi`

    // console.log(this.searchData.geocode) 
    this.searchData.channel = channel
    this.TweetService.tweetSearch(this.searchData).subscribe(res=>{    
    // console.log(res);
    }, err =>{})

  }

  onFilterChange(e){
    this.startIndex = (e.pageIndex - 1) * e.pageSize 
    this.endIndex =  this.startIndex + parseInt(e.pageSize) 
    
    this.defaultFilter.sortOrder = e.sortOrder;
    this.defaultFilter.sortField = e.sortField;
    // console.log(e);
    
    if(this.copyTweets)
      this.copyTweets.sort((a: any, b: any) => {
        if ( this.deepFind(a, this.defaultFilter.sortField) > this.deepFind(b, this.defaultFilter.sortField) )
          if(this.defaultFilter.sortOrder)  return -1; else return 1;
        else if( this.deepFind(a, this.defaultFilter.sortField) < this.deepFind(b, this.defaultFilter.sortField) ) 
          if(this.defaultFilter.sortOrder)  return 1; else return -1;
        else return 0;	
      });  
  }

  deepFind(obj, path) {
    path.split('.').forEach(el => {obj = obj[el];});
    return obj;
  }

  handleAddressChange(address) {
    this.latitude= address.geometry.location.lat();
    this.longitude= address.geometry.location.lng();
  }

  curEventStream:any;



  exportData(){

    var copiedTweets = [];


    this.copyTweets.forEach(element => {
      
      for( var key in element){
        var copiedTweet = {};
        if(key === 'user') {
          for( var keyUser in element[key]){ 
  
            copiedTweet[keyUser] =  element[key][keyUser]
  
          }
        } else {
          copiedTweet[key] = element[key];
        }
  
        copiedTweets.push(copiedTweet)
      }
  

    });

 
    console.log('this.copyTweets-->', copiedTweets);
    this.TweetService.downloadFile(copiedTweets, 'jsontocsv');
  }
  searchTweets(channel) {
    this.totalTweets = 0;
    this.tweets = [] 
    this.copyTweets = []
    if(this.curEventStream) this.curEventStream.close();

    this.TweetService.searchTweets(channel).subscribe(arg => {
      if(arg['data']){
        this.curEventStream = arg['eventStream']
        if(arg['data']['status']=="DONE")
          this.searchStart = false;
        this.tweets = this.tweets.concat(arg['data']['tweets']);
        console.log(this.tweets)
        this.totalTweets += arg['data']['tweet_count'];
        console.log(this.copyTweets)
        this.copyTweets = this.tweets;
       
      }
    });
  }

  filter(type, xtraInfo=null){
    this.copyTweets = this.tweets;
    var d = new Date();
    switch (type) {
      case 'clear':
        this.copyTweets = this.tweets;
      break;
      case 'hour':
        this.copyTweets = this.copyTweets.filter(t=> (new Date(t.dateTime).getTime()) >= (d.setHours(d.getHours() - xtraInfo)) );
      break;
    
      default:
        
    }
    this.totalTweets = this.copyTweets.length;
  }

  reset(){
    this.searchForm.reset();
    this.latitude = null;
    this.longitude = null;
    this.totalTweets = 0;
    this.tweets = [] 
    this.copyTweets = []
    this.searchStart = false;
    this.searchData = {query:'', until:'', geocode: '', channel: ''};
    if(this.curEventStream) this.curEventStream.close();
  }
}

