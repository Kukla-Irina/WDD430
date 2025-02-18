import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  selectedDocumentEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];
  private maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

getDocuments(): Document[] {
  return this.documents.slice();
}

getDocument(id: string): Document {
  if (!this.documents) {
    return null;
  }

  for (let document of this.documents) {
    if (document.id === id) {
      return document;
    }
  }

  return null;
}

deleteDocument(document: Document) {
  if (!document) {
     return;
  }
  const pos = this.documents.indexOf(document);
  if (pos < 0) {
     return;
  }
  this.documents.splice(pos, 1);
  this.documentListChangedEvent.next(this.documents.slice());
}

getMaxId(): number {
  let maxID = 0;
  for (let document of this.documents) {
    let currentID = +document.id;
    if (currentID > maxID) {
      maxID = currentID;
    }
  }
  return maxID;
}

addDocument(newDocument: Document) {
  if (newDocument === null || newDocument === undefined) return;
  this.maxDocumentId++;
  newDocument.id = `${this.maxDocumentId}`;
  this.documents.push(newDocument);
  this.documentListChangedEvent.next(this.documents.slice());
}

updateDocument(originalDocument: Document, newDocument: Document) {
  if (
    newDocument === null ||
    newDocument === undefined ||
    originalDocument === null ||
    originalDocument === undefined
  ) {
    return;
  }
  const pos = this.documents.indexOf(originalDocument);
  if (pos < 0) return;

  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
  this.documentListChangedEvent.next(this.documents.slice());
}

}
