import {Component, OnInit} from '@angular/core';
import {NewsApiService} from './news-api.service';
import Speech from 'speak-tts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  mArticles: Array<any>;
  mSources: Array<any>;
  speech = new Speech();
  likes = 0;

  constructor(private newsapi: NewsApiService) {
    console.log('app component constructor called');
  }

  ngOnInit() {
    if (this.speech.hasBrowserSupport()) {
      console.log('speech synthesis supported');
    }

    this.speech.init().then((data) => {
      // The "data" object contains the list of available voices and the voice synthesis params
    }).catch(e => {
    });
    this.newsapi.initArticles().subscribe(data => this.mArticles = data['articles']);
    this.newsapi.initSources().subscribe(data => this.mSources = data['sources']);
  }


  textToSpeech(text) {
    this.speech.speak({
      text: text,
      queue: false,
      listeners: {
        onstart: () => {
          console.log('Start utterance');
        },
        onend: () => {
          console.log('End utterance');
        },
        onresume: () => {
          console.log('Resume utterance');
        },
        onboundary: (event) => {
          console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.');
        }
      }
    }).then(() => {
      console.log('Success !');
    }).catch(e => {
      console.error('An error occurred :', e);
    });
  }


  pause() {
    this.speech.pause();
  }

  resume() {
    this.speech.resume();
  }


  searchArticles(source) {
    console.log('selected source is: ' + source);
    this.newsapi.getArticlesByID(source).subscribe(data => this.mArticles = data['articles']);
  }

}
