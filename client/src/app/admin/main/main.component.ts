import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'incite-admin-main',
  template: `<mat-sidenav-container>
    <mat-sidenav mode="side" opened="true">
      <button mat-button routerLink="roles">Roles</button>
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
