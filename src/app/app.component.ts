import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subject, debounceTime, throttleTime } from 'rxjs';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Parithi';
  displayedText: string = 'cooking';
  private lightModeTexts: string[] = ['cooking','crafting', 'prepping'];
  private darkModeTexts:string[] = ['crying','contemplating','ruminating'];
  private texts: string[] = this.lightModeTexts;
  private currentIndex: number = 0;
  private lastTouchY: number = 0;
  private accumulatedDistance: number = 0;
  private distanceThreshold: number = 30; // Change text every 30px of scroll
  themeText = 'switch dark';
  audioSource: string = '../assets/audio/bg-audio.mp3';
  isPlaying: boolean = true;
fadeDuration: number = 500;



  // Create a Subject for debouncing
  private touchMoveSubject = new Subject<void>();
  private wheelSubject = new Subject<void>();

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  constructor(private themeService: ThemeService) {
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

    this.themeService.theme$.subscribe(theme => {
      this.updateThemeText(theme);
    });

  }


  updateTextsBasedOnTheme() {
    // Check the current theme (this is an example; replace with your actual theme detection)
    const isDarkMode = document.body.classList.contains('dark'); // Adjust as needed

    this.texts = isDarkMode ? this.darkModeTexts : this.lightModeTexts;
    this.displayedText = this.texts[this.currentIndex]; // Update displayed text to match the new texts array
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.updateTextsBasedOnTheme();

  }

   togglePlayPause(): void {
    if (this.isPlaying) {
      this.fadeOutAudio();
    } else {
      this.fadeInAudio();
    }
  }

  private updateThemeText(theme: string): void {
    this.themeText = theme === 'dark' ? 'switch normal' : 'switch dark';
  }

  fadeInAudio(): void {
    const audio = this.audioPlayer.nativeElement;
    let volume = 0;
    const fadeInStep = 1 / (this.fadeDuration / 50); // Incremental step per 50ms

    audio.volume = 0; // Start with zero volume
    audio.play().then(() => {
      this.isPlaying = true;

      const fadeInInterval = setInterval(() => {
        if (volume < 1) {
          volume = Math.min(1, volume + fadeInStep);
          audio.volume = volume;
        } else {
          clearInterval(fadeInInterval);
        }
      }, 50);
    }).catch(error => {
      console.error('Error playing audio:', error);
    });
  }

  fadeOutAudio(): void {
    const audio = this.audioPlayer.nativeElement;
    let volume = audio.volume;
    const fadeOutStep = volume / (this.fadeDuration / 50);

    const fadeOutInterval = setInterval(() => {
      if (volume > 0) {
        volume = Math.max(0, volume - fadeOutStep);
        audio.volume = volume;
      } else {
        clearInterval(fadeOutInterval);
        audio.pause();
        this.isPlaying = false;
      }
    }, 50);
  }

    ngOnInit() {
    // Add global event listeners
    this.updateTextsBasedOnTheme();
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
  enableDarkMode(){

    localStorage.getItem('theme')
  }
}
