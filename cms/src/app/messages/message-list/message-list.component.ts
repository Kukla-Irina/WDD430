import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(1, 'Message 1', 'Hi!', 'Irina'),
    new Message(2, 'Message 2', 'How are you?', 'Maxim'),
    new Message(3, 'Message 3', 'Bye!', 'Marina'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
