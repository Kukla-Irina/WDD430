import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [];

  constructor() {
    this.documents = MOCKDOCUMENTS;
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

}
