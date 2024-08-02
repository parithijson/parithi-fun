import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Subject, debounceTime, throttleTime } from 'rxjs';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHomeVisible: boolean = false;

  showHome(): void {
    this.isHomeVisible = true;
  }

}
