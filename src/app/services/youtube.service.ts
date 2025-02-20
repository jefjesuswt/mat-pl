import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable } from "rxjs";
import {map } from "rxjs/operators";
import { YoutubeSearchResult } from '../interfaces/youtube-interfaces/youtube-search-result.interface';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiKey: string = 'AIzaSyCpD1YRlRFLC1hCIYRzP8BlOd1rZG2t00A'; 
  private apiUrl: string = 'https://www.googleapis.com/youtube/v3';
  private isApiReady: boolean = false;
  private isApiReadyPromise?: Promise<void>;
  private volume: number = 50;
  private player?: YT.Player;

  constructor(private httpClient: HttpClient) {
    this.isApiReadyPromise = this.loadYoutubeApi();
  }

  // Cargar la API de YouTube 
  public loadYoutubeApi(): Promise<void> {
    return new Promise((resolve) => {
      if (!window['YT']) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        window['onYouTubeIframeAPIReady'] = () => {
          this.isApiReady = true;
          console.log('YouTube API is ready');
          resolve();
        };
      } else {
        this.isApiReady = true;
        resolve();
      }
    });
  }

  // buscar en youtube 
  public searchVideo(query: string): Observable<string | null> {
    const url = `${this.apiUrl}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${this.apiKey}&maxResults=1`;
    return this.httpClient.get<YoutubeSearchResult>(url).pipe(
      map(response => {
        const items = response.items;
        return items.length > 0 ? items[0].id.videoId : null;
      })
    );
  }

  // cargar video de youtube
  public loadPlayer(videoId: string, elementId: string) {
    this.isApiReadyPromise?.then(() => {
      if (!this.player) {
        this.player = new window['YT'].Player(elementId, {
          height: '0',
          width: '0',
          videoId: videoId,
          playerVars: {
            'autoplay': 1,
            'playsinline': 1
          },
          events: {
            'onReady': (event: any) => {
              event.target.playVideo()
              this.player?.setVolume(this.volume)
            },
            'onStateChange': this.onPlayerStateChange.bind(this),
            'onError': this.onPlayerError.bind(this)
          }
        });
      } else {
        this.player.loadVideoById(videoId);
        this.player?.setVolume(this.volume)
      }
    });
  }

  public onPlayerStateChange(event: any) {
    const playerState = event.data;
    if (playerState === window['YT'].PlayerState.ENDED) {
      console.log('Video terminado');
    } else if (playerState === window['YT'].PlayerState.PLAYING) {
      console.log('El video está reproduciéndose.');
    } else if (playerState === window['YT'].PlayerState.PAUSED) {
      console.log('El video está en pausa.');
    } else if (playerState === window['YT'].PlayerState.BUFFERING) {
      console.log('El video está cargando.');
    }
  }

  public onPlayerError(event: any) {
    console.error('Error en el reproductor de YouTube:', event.data);
    if (event.data === 151 || event.data === 101) {
      console.log('video bloqueado, buscando otro...')
    }
  }

  public playVideo(): void {
    this.player?.playVideo();
  }

  public pauseVideo(): void {
    this.player?.pauseVideo();
  }

  public stopVideo(): void {
    this.player?.stopVideo();
  }

  public seekTo(value: number): void {
    this.player?.seekTo(value, true);
  }

  public setVolume(value: number): void {
    this.volume = value;
    this.player?.setVolume(value);
  }

  public getDuration(): number {
    return this.player?.getDuration() || 0;
  }

  public getCurrentTime(): number {
    return this.player?.getCurrentTime() || 0;
  }

  public getVolume(): number {
    return this.volume;
  }

  public isPlaying(): boolean {
    return this.player?.getPlayerState() === window['YT'].PlayerState.PLAYING;
  }
 
}
