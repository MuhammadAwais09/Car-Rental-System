import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private toaster: ToastrService) { }

  baseURL: any;
  ngOnInit() {
    this.baseURL = this.document.baseURI
  }

  copy() {
    navigator.clipboard.writeText(this.baseURL);
    this.toaster.success("URL Copied To Clipboard")
  }
}
