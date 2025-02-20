import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { YoutubeService } from '../../services/youtube.service';
import { Song } from '../../interfaces/song.interface';

@Component({
  selector: 'shared-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnChanges {

  @Input() 
  public song?: Song;
  
  public videoId?: string;
  public isPlaying: boolean = true;
  public isAdPlaying: boolean = false;
  public currentTime: number = 0;
  public currentVolume: number = 50
  public duration: number = 0;

  private intervalId?: any


  constructor(private youtubeService: YoutubeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['song'] && this.song) {
      const query: string = `${this.song.name} ${this.song.artist}`;
      console.log('buscando video para: ', query);
      
      this.youtubeService.searchVideo(query)
        .subscribe((videoId) => {

          if (videoId) {
            this.videoId = videoId;
            console.log('Video encontradito: ', this.videoId);
            this.youtubeService.loadPlayer(this.videoId, 'youtube-player');
            this.currentVolume = this.youtubeService.getVolume()
            setTimeout(() => {
              this.duration = this.youtubeService.getDuration();
              this.startUpdatingCurrentTime()
              console.log('current time: ', this.currentTime, 'duration: ', this.duration)
            }, 2000)
          } else {
            console.log('No encontre videos para: ', query);
          }
        });
    }
  }

  private stopUpdatingCurrentTime(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  private startUpdatingCurrentTime(): void {
    this.stopUpdatingCurrentTime() 

    this.intervalId = setInterval(() => {
      this.currentTime = this.youtubeService.getCurrentTime();
      console.log(this.currentTime)
    }, 1000)
  }

  public onPlayerReady(event: any) {
    event.target.playVideo();
  }

  public onPlayerStateChange(event: any) {
    const playerState = event.data;
  
    if (playerState === window['YT'].PlayerState.ENDED) {
      console.log('El video ha terminado');
      this.currentTime = 0;
      this.stopUpdatingCurrentTime()
      this.isAdPlaying = false;
    } else if (playerState === window['YT'].PlayerState.UNSTARTED || playerState === window['YT'].PlayerState.PAUSED) {
      console.log('Posiblemente un anuncio está en curso');
      this.isAdPlaying = true;
      event.target.playVideo(); // Intentar continuar después del anuncio
    } else if (playerState === window['YT'].PlayerState.PLAYING) {
      console.log('El video se está reproduciendo');
      this.isAdPlaying = false;
    }
  }

  public changePlayingStatus() {
    if (this.isPlaying) {
      this.youtubeService.pauseVideo();
      this.stopUpdatingCurrentTime();
    } else {
      this.youtubeService.playVideo();
      this.startUpdatingCurrentTime();
    }
    this.isPlaying = !this.isPlaying
  }

  public seekTo(seconds: number): void {
    this.youtubeService.seekTo(seconds);
  }

  public setVolume(vol: number): void {
    this.youtubeService.setVolume(vol)
  }

}
