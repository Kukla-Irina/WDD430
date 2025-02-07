import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';



@Component({
  selector: 'cms-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {

  @ViewChild('subject', { static: false }) subject: ElementRef;
  @ViewChild('msgText', { static: false }) msgText: ElementRef;

  constructor(private messageService: MessageService) {}

  onSendMessage() {
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;
    const message = new Message("1" , subject, msgText, "Irina");
    this.messageService.addMessage(message);
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
