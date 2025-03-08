import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();

  private messagesUrl =
    'https://angularirina-default-rtdb.firebaseio.com/messages.json';
  private messages: Message[] = [];
  private maxMessageId: number;

  constructor(private http: HttpClient) {}

  getMessages(): Message[] {
    this.http.get<Message[]>(this.messagesUrl).subscribe((msgs: Message[]) => {
      this.messages = msgs;
      this.maxMessageId = this.getMaxId();
      this.messages.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
      this.messageChangedEvent.next(this.messages.slice());
    });

    return this.messages.slice();
  }

  storeMessages() {
    this.http
      .put(this.messagesUrl, JSON.stringify(this.messages), {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .subscribe(() => {
        this.messages.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        this.messageChangedEvent.next(this.messages.slice());
      });
  }

  getMessage(id: string): Message {
    if (!this.messages) {
      return null;
    }

    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
 
    return null;
  }
  addMessage(newMessage: Message) {
    if (newMessage === null || newMessage === undefined) return;
    this.maxMessageId++;
    newMessage.id = `${this.maxMessageId}`;
    this.messages.push(newMessage);
    this.storeMessages();
  }

  getMaxId(): number {
    let maxID = 0;
    for (let message of this.messages) {
      let currentID = +message.id;
      if (currentID > maxID) {
        maxID = currentID;
      }
    }
    return maxID;
  }
}
