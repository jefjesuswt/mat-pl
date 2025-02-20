import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Song } from '../../interfaces/song.interface';

@Component({
  selector: 'content-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  @Input()
  public songs: Song[] = [];

  @Input()
  public query: string = '';

  @Output()
  public onSongSelect: EventEmitter<Song> = new EventEmitter;

  public selectSong(song: Song): void {
    this.onSongSelect.emit(song)
  }

}
