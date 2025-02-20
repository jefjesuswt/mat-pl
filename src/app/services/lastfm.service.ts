import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, of, forkJoin, switchMap } from 'rxjs';
import { map } from "rxjs/operators";

import { Data, Track } from '../interfaces/lastfm-interfaces/lastfm-tracks.interface';
import { TrackInfo } from '../interfaces/lastfm-interfaces/lastfm-track-info.interface';
import { AlbumInfo } from '../interfaces/lastfm-interfaces/lastfm-album-info.interface';
import { TopTrackInfo } from '../interfaces/lastfm-interfaces/lastfm-top-tracks.interface';

@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  
  private apiKey: string = '5f3c5586d7560665a1bb9e778ce7df6b';
  private apiUrl: string = 'http://ws.audioscrobbler.com/2.0/';

  constructor(private httpClient: HttpClient) { }

  searchTrackWithAlbum(term: string): Observable<{ name: string; artist: string; album: string; image: string }[]> {
    const searchUrl: string = `${this.apiUrl}?method=track.search&track=${term}&format=json&api_key=${this.apiKey}`;

    return this.httpClient.get<Data>(searchUrl).pipe(
      switchMap((response: Data) => {
        if (response.results && response.results.trackmatches && response.results.trackmatches.track) {
          const tracks = response.results.trackmatches.track;

          const albumRequests = tracks.map((track: Track) =>
            this.getAlbumFromTrack(track.name, track.artist).pipe(
              // getAlbumInfo para obtener la imagen del album
              switchMap((albumTitle: string) => this.getAlbumInfo(albumTitle)),
              // error handling
              catchError(() => of({ title: 'Unknown Album', image: 'Image not available' }))
            )
          );

          // forkJoin para esperar a que todas las peticiones terminen
          return forkJoin(albumRequests).pipe(
            map((albums) => {
              return tracks.map((track, index) => ({
                name: track.name,
                artist: track.artist,
                album: albums[index].title || 'Album not found', // Título del álbum
                image: albums[index].image || 'Image not found', // Imagen del álbum
              }));
            })
          );
        }
        return of([]); // Si no hay resultados, retornamos un observable con un array vacío
      }),
      catchError((error) => {
        console.log('Error in track search:', error);
        return of([]); // Si hay un error, devolvemos un observable con un array vacío
      })
    );
  }

  public getTopTracks(): Observable<{ name: string, artist: string, album: string, image: string }[]> {
    const url = `${this.apiUrl}?method=chart.gettoptracks&api_key=${this.apiKey}&format=json`;
    
    return this.httpClient.get<TopTrackInfo>(url).pipe(
      map((response: TopTrackInfo) => {
        // Aseguramos que `tracks` y `track` existan en la respuesta
        if (response.tracks && response.tracks.track) {
          return response.tracks.track.map((track) => ({
            name: track.name,
            artist: track.artist.name,
            album: '', // En la respuesta no tenemos información del álbum
            image: track.image[2]['#text'] || 'Image not available', // Usamos la imagen tamaño 'large'
          }));
        } else {
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error fetching top tracks:', error);
        return of([]); // Si hay un error, devolvemos un array vacío
      })
    );
  }

  // Método para obtener el título del álbum
  private getAlbumFromTrack(name: string, artist: string): Observable<string> {
    const infoUrl: string = `${this.apiUrl}?method=track.getInfo&api_key=${this.apiKey}&artist=${artist}&track=${name}&format=json`;

    return this.httpClient.get<TrackInfo>(infoUrl).pipe(
      map((response: TrackInfo) => response.track.album?.title || 'Unknown Album'),
      catchError(() => of('Unknown Album')) // Si hay error, devolvemos 'Unknown Album'
    );
  }

  // Método para obtener la información del álbum (título e imagen)
  private getAlbumInfo(album: string): Observable<{ title: string; image: string }> {
    const albumInfoUrl: string = `${this.apiUrl}?method=album.search&api_key=${this.apiKey}&album=${album}&format=json`;
  
    return this.httpClient.get<AlbumInfo>(albumInfoUrl).pipe(
      map((response: AlbumInfo) => {
        const albumTitle = response.results.albummatches.album[0].name || 'Unknown Album';
        const albumImage = response.results.albummatches.album[0].image[1]['#text'] || 'Image not available'; // Imagen en tamaño mediano
        return { title: albumTitle, image: albumImage };
      }),
      catchError(() => of({ title: 'Unknown Album', image: 'Image not available' })) // Manejo de errores
    );
  }
}
