import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'theme';
  private themeSubject = new BehaviorSubject<string>(this.getSavedTheme());

  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.getSavedTheme());
  }

  toggleTheme(): void {
    const currentTheme = this.getSavedTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
    this.themeSubject.next(newTheme); // Update the observable
  }

  private applyTheme(theme: string): void {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }

  private getSavedTheme(): string {
    return localStorage.getItem(this.themeKey) || 'light';
  }

  private saveTheme(theme: string): void {
    localStorage.setItem(this.themeKey, theme);
  }
}
