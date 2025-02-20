import { Component } from '@angular/core';
import { LastfmService } from './services/lastfm.service';
import { Song } from './interfaces/song.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  tracks: Song[] = []
  selectedSong?: Song

  constructor(private lastfmService: LastfmService) {}

  searchByTrack(term: string) {
    this.lastfmService.searchTrackWithAlbum(term)
      .subscribe(tracks => {
        this.tracks = tracks
        console.log(this.tracks)
      });
  }

  onSelectSong(song: Song) {
    this.selectedSong = song;
  }

}
