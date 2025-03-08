import { EventEmitter, Injectable } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  selectedDocumentEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();

  private documentsUrl =
    'https://angularirina-default-rtdb.firebaseio.com/documents.json';
  private documents: Document[] = [];
  private maxDocumentId: number;

  constructor(private http: HttpClient) {}

  getDocuments(): Document[] {
    this.http
      .get<Document[]>(this.documentsUrl)
      .subscribe((docs: Document[]) => {
        this.documents = docs;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
      });

    return this.documents.slice();
  }

  storeDocuments() {
    this.http
      .put(this.documentsUrl, JSON.stringify(this.documents), {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .subscribe(() => {
        this.documents.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  getDocument(id: string): Document {
    return this.documents.find((d) => d.id === id);
  }

deleteDocument(document: Document) {
  if (!document) return;
  const pos = this.documents.indexOf(document);
  if (pos < 0) return;
  this.documents.splice(pos, 1);
  this.storeDocuments();
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

addDocument(newDoc: Document) {
  if (newDoc === null || newDoc === undefined) return;
  this.maxDocumentId++;
  newDoc.id = `${this.maxDocumentId}`;
  this.documents.push(newDoc);
  this.storeDocuments();
}


updateDocument(original: Document, newDoc: Document) {
  if (
    newDoc === null ||
    newDoc === undefined ||
    original === null ||
    original === undefined
  ) {
    return;
  }
  const pos = this.documents.indexOf(original);
  if (pos < 0) return;

  newDoc.id = original.id;
  this.documents[pos] = newDoc;
  this.storeDocuments();
}


}
