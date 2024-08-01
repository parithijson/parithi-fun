import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subject, debounceTime, throttleTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Parithi';

    displayedText: string = 'cooking';
  private texts: string[] = ['cooking','crafting', 'prepping'];
 private currentIndex: number = 0;
  private lastTouchY: number = 0;

  // Create a Subject for debouncing
  private touchMoveSubject = new Subject<void>();
  private wheelSubject = new Subject<void>();

  constructor() {
    // Apply debounce for touch events (touch devices)
    this.touchMoveSubject.pipe(
      debounceTime(200) // Adjust debounce time for touch devices
    ).subscribe(() => {
      this.changeText();
    });


    // Apply throttle for wheel events (mouse and touchpad)
    this.wheelSubject.pipe(
      throttleTime(200) // Adjust throttle time for mouse/touchpad
    ).subscribe(() => {
      this.changeText();
    });
  }

    ngOnInit() {
    // Add global event listeners
    document.addEventListener('wheel', this.onWheel.bind(this));
    document.addEventListener('touchstart', this.onTouchStart.bind(this));
    document.addEventListener('touchmove', this.onTouchMove.bind(this));
  }

  ngOnDestroy() {
    // Clean up global event listeners
    document.removeEventListener('wheel', this.onWheel.bind(this));
    document.removeEventListener('touchstart', this.onTouchStart.bind(this));
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
  }

  onTouchStart(event: TouchEvent) {
    this.lastTouchY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent) {
    const currentTouchY = event.touches[0].clientY;
    if (Math.abs(currentTouchY - this.lastTouchY) > 10) { // Change threshold as needed
      this.touchMoveSubject.next(); // Trigger debounce for touch
    }
    this.lastTouchY = currentTouchY; // Update last touch position
  }

  onWheel(event: WheelEvent) {
    this.wheelSubject.next(); // Trigger throttle for wheel
  }

  private changeText() {
    this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    this.displayedText = this.texts[this.currentIndex];
  }
}
