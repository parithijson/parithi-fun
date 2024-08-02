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
    private accumulatedDistance: number = 0;
  private distanceThreshold: number = 30; // Change text every 30px of scroll

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
    this.accumulatedDistance = 0; // Reset accumulated distance on a new touch start
  }

  onTouchMove(event: TouchEvent) {
    const currentTouchY = event.touches[0].clientY;
    const movement = currentTouchY - this.lastTouchY;

    // Update accumulated distance
    this.accumulatedDistance += Math.abs(movement);
    this.lastTouchY = currentTouchY; // Update last touch position

    // Check if accumulated distance exceeds the threshold
    if (this.accumulatedDistance > this.distanceThreshold) {
      this.changeText();
      this.accumulatedDistance = 0; // Reset accumulated distance after a text change
    }
  }

  onWheel(event: WheelEvent) {
    this.wheelSubject.next(); // Trigger throttle for wheel
  }

  private changeText() {
    this.currentIndex = (this.currentIndex + 1) % this.texts.length;
    this.displayedText = this.texts[this.currentIndex];
  }
}
