import { Component, OnInit } from '@angular/core';
import { LastfmService } from '../../services/lastfm.service';
import { Song } from '../../interfaces/song.interface';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  songs: Song[] = []

  constructor(private lastfmService: LastfmService) {}

  ngOnInit(): void {
      this.getTopTracks()
  }

  getTopTracks() {
    this.lastfmService.getTopTracks()
      .subscribe(songs => {
        this.songs = songs;
        console.log(this.songs);
      })
  }
}
