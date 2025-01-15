import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { Editor } from 'ngx-editor';
import { PageTitles, RoutesNames, StringMap } from 'src/app/shared/common/titles';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent implements OnInit, OnDestroy {

  activePage!: string;
  pageTitle = 'Privacy Policy';
  RoutesNames: StringMap = RoutesNames;
  // editor!: Editor;
  html = '';
  
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  /*================== LIFECYCLE HOOKS =====================*/
  ngOnInit(): void {
    this.getCurrentPage();
    // this.editor = new Editor();
  }
  
  ngOnDestroy(): void {
    // this.editor.destroy();
  }
  /*================== LIFECYCLE HOOKS ENDS =====================*/


  /*================== GETTING CURRENT PAGE =====================*/
  getCurrentPage () {
    this.activeRoute.params.subscribe((res: any) => {
      this.activePage = res.id;
      this.pageTitle = PageTitles[this.activePage];
    })
  }
  /*================== GETTING CURRENT PAGE ENDS =====================*/


  /*================== GET TERMS & CONDITIONS =====================*/
  getTermsConditions () {
    // this.ac
    this.router.navigate(['/admin/content-management/terms-conditions'])
  }
  /*================== GET TERMS & CONDITIONS ENDS =====================*/


  /*================== GET PRIVACY POLICY =====================*/
  getPrivacyPolicy () {
    // this.ac
    this.router.navigate(['/admin/content-management/privacy-policy'])
  }
  /*================== GET PRIVAC POLICY ENDS =====================*/
}
