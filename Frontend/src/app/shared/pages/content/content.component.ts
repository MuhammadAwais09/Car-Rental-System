import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit{

  pageTitle!: string;
  content!: string;
  pageCategory!: string;

  constructor (
    public _utilService: UtilsService,
    private _activeRoute: ActivatedRoute,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
      this._activeRoute.data.subscribe((res: any) => {
        this.pageTitle = res.title;
        this.pageCategory = res.key;
        this.content = this._dataService.contentData[this.pageCategory];
      })
  }

}
