import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Add CommonModule and FormsModule to imports
})
export class ChatComponent implements OnInit {
  messages: { text: string, sender: string }[] = [];
  userMessage: string = '';
  @Output() minimize = new EventEmitter<void>(); // Add output event for minimizing

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.messages.push({ text: this.userMessage, sender: 'user' });
      this.chatService.sendMessage(this.userMessage).subscribe(response => {
        const botResponse = response.answers[0]?.answer || 'Sorry, I did not understand that.';
        this.messages.push({ text: botResponse, sender: 'bot' });
      });
      this.userMessage = '';
    }
  }

  minimizeChat(): void {
    this.minimize.emit(); // Emit the minimize event
  }
}