import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  private contactsUrl =
    'http://localhost:3000/contacts';
  private contacts: Contact[] = [];
  private maxContactId: number;

  constructor(private http: HttpClient) {}

  getContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(this.contactsUrl)
      .subscribe({
        next: (res) => {
          console.log(res.message);
          this.contacts = res.contacts;
          this.sortAndSend();
        },
        error: (err) => {
          console.error(err.message);
          console.error(err.error);
        },
      });
  }

  storeContacts() {
    this.http
      .put(this.contactsUrl, JSON.stringify(this.contacts), {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .subscribe(() => {
        this.contacts.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  getContact(id: string): Contact | undefined {
    return this.contacts.find((c) => c.id === id || c._id === id);
  }

  deleteContact(contact: Contact) {
    if (!contact) return;
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;
    this.http
      .delete<{ message: string }>(`${this.contactsUrl}/${contact.id}`)
      .subscribe({
        next: (res) => {
          console.log(res.message);
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        },
        error: (err) => {
          console.error(err.message);
          console.error(err.error);
        },
      });
  }

  getMaxId(): number {
    let maxID = 0;
    for (let contact of this.contacts) {
      let currentID = +contact.id;
      if (currentID > maxID) {
        maxID = currentID;
      }
    }
    return maxID;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;
    newContact.id = '';
    this.http
      .post<{ message: string; contact: Contact }>(
        this.contactsUrl,
        newContact,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') }
      )
      .subscribe({
        next: (res) => {
          console.log(res.message);
          this.contacts.push(res.contact);
          this.sortAndSend();
        },
        error: (err) => {
          console.error(err.message);
          console.error(err.error);
        },
      });
  }

  updateContact(original: Contact, newContact: Contact) {
    if (!newContact || !original) return;
    const pos = this.contacts.indexOf(original);
    if (pos < 0) return;

    newContact.id = original.id;
    newContact._id = original._id;
    this.http
      .put<{ message: string }>(
        `${this.contactsUrl}/${original.id}`,
        newContact,
        {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }
      )
      .subscribe({
        next: (res) => {
          console.log(res.message);
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
        error: (err) => {
          console.error(err.message);
          console.error(err.error);
        },
      });
  }

  sortAndSend() {
    this.contacts.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    this.contactListChangedEvent.next(this.contacts.slice());
  }

}
