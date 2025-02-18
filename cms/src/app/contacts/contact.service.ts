import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  private maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
 }

 getContacts(): Contact[] {
  return this.contacts.slice();
}

getContact(id: string): Contact {
  if (!this.contacts) {
    return null;
  }

  for (let contact of this.contacts) {
    if (contact.id === id) {
      return contact;
    }
  }

  return null;
}
deleteContact(contact: Contact) {
  if (!contact) return;
  const pos = this.contacts.indexOf(contact);
  if (pos < 0) return;
  this.contacts.splice(pos, 1);
  this.contactListChangedEvent.next(this.contacts.slice());
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
  if (newContact === null || newContact === undefined) return;
  this.maxContactId++;
  newContact.id = `${this.maxContactId}`;
  this.contacts.push(newContact);
  this.contactListChangedEvent.next(this.contacts.slice());
}

updateContact(originalContact: Contact, newContact: Contact) {
  if (
    newContact === null ||
    newContact === undefined ||
    originalContact === null ||
    originalContact === undefined
  ) {
    return;
  }
  const pos = this.contacts.indexOf(originalContact);
  if (pos < 0) return;

  newContact.id = originalContact.id;
  this.contacts[pos] = newContact;
  this.contactListChangedEvent.next(this.contacts.slice());
}

}
