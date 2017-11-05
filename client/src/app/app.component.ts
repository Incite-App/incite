import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'incite-root',
  template: `
    <mat-toolbar color="primary">
      <span>Incite</span>
      <div fxFlex="1 0"></div>
      <incite-user-menu></incite-user-menu>
    </mat-toolbar>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {



  public ngOnInit(): void {

  }


}
