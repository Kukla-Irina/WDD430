import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  standalone: false,
  
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {
 document: Document;
 nativeWindow: any;
  constructor(
    private documentService: DocumentService,
    private windowRefService: WindRefService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.nativeWindow = this.windowRefService.getNativeWindow();
    this.route.params.subscribe((params: Params) => {
      this.document = this.documentService.getDocument(params['id']);
    });
  }
  onView() {
    if (this.document.url) this.nativeWindow.open(this.document.url);
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['../'], { relativeTo: this.route });
 }
}
