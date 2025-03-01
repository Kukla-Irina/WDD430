import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,

  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id === undefined || this.id === null) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id);
      if (this.originalContact === undefined || this.originalContact === null) {
        return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if (this.originalContact.group !== null) {
        this.groupContacts = this.contact.group;
      }
    });
  }

  onSubmit(form: NgForm) {
    let value = form.value;
    let newContact = new Contact(
      this.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup(event: CdkDragDrop<any[]>) {
    console.log('Drop event:', event); // Debugging: Log the event
    const selectedContact: Contact = event.item.data;
    console.log('Selected contact:', selectedContact); // Debugging: Log the dragged contact
  
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      console.log('Invalid contact, skipping drop.'); // Debugging: Log if contact is invalid
      return;
    }
  
    // Transfer the item from the source list to the target list
    if (event.previousContainer !== event.container) {
      console.log('Transferring contact between lists.'); // Debugging: Log transfer
      transferArrayItem(
        event.previousContainer.data, // Source list
        event.container.data, // Target list
        event.previousIndex, // Index in the source list
        event.currentIndex // Index in the target list
      );
    } else {
      console.log('Dropped within the same list.'); // Debugging: Log if dropped in the same list
    }
  }
  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }
}
