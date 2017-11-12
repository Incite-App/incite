import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'incite-admin-main',
  template: `<mat-sidenav-container>
    <mat-sidenav mode="side" opened="true">
      <mat-nav-list>
        <a mat-list-item routerLink="roles">Roles</a>
      </mat-nav-list>
    </mat-sidenav>
    <router-outlet></router-outlet>
  </mat-sidenav-container>`,
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
