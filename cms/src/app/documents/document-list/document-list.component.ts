import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter();

  documents = [
    new Document(1, "Document 1", "Description 1.", "url/1", null),
    new Document(1, "Document 2", "Description 2.", "url/2", null),
    new Document(1, "Document 3", "Description 3.", "url/3", null),
    new Document(1, "Document 4", "Description 4.", "url/4", null),
    new Document(1, "Document 5", "Description 5.", "url/5", null),
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
