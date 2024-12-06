import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ChatComponent],
})
export class AppComponent implements OnInit {
  selectedFilter: string = '';
  searchText: string = '';
  currentRoute: string = '';
  isChatOpen: boolean = false;
  selectedLanguage: string = 'en'; // Default language
  originalTexts: string[] = []; // Store original texts

  constructor(private router: Router, private translationService: TranslationService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  minimizeChat(): void {
    this.isChatOpen = false;
  }

  onLanguageChange(): void {
    this.translationService.setLanguage(this.selectedLanguage);
    this.translatePageContents();
  }

  translatePageContents(): void {
    const elements = Array.from(document.querySelectorAll('[data-translate]'));

    if (this.selectedLanguage === 'en') {
      // Restore original texts when switching back to English
      elements.forEach((element, index) => {
        element.textContent = this.originalTexts[index];
      });
    } else {
      // Store original texts before translating
      this.originalTexts = elements.map(element => element.textContent || '');

      const texts = this.originalTexts;

      this.translationService.translate(texts).subscribe((response) => {
        response.forEach((translation: any, index: number) => {
          if (translation.translations && translation.translations[0]) {
            elements[index].textContent = translation.translations[0].text;
          }
        });
      });
    }
  }
}