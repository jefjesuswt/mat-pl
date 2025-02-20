import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject, Subscription } from "rxjs";

@Component({
  selector: 'shared-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  
  // private debouncer: Subject<string> = new Subject;
  // private debouncerSubscription?: Subscription;

  @Input()
  public initialValue: string = '';

  @Output()
  public onValue: EventEmitter<string> = new EventEmitter;

  // ngOnInit(): void {
  //     this.debouncerSubscription = this.debouncer
  //       .pipe(
  //         debounceTime(400)
  //       )
  //       .subscribe(value => {
  //         this.emitValue(value);
  //       })
  // }

  // ngOnDestroy(): void {
  //     this.debouncerSubscription?.unsubscribe();
  // }

  emitValue(value: string) {
    this.onValue.emit(value);
  }

  onKeyPress(event: KeyboardEvent, searchTerm: string) {
    if (event.key === 'Enter') {
      this.emitValue(searchTerm)
    }
  }
}
