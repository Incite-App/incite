import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialog } from '@angular/material';
import * as firebase from 'firebase';

@Component({
  selector: 'incite-user-menu',
  template: `
    <button *ngIf="!user" color="accent" mat-raised-button (click)="beginLogin()">Login</button>
    <button *ngIf="!!user" mat-button [matMenuTriggerFor]="userMenu">Welcome {{user?.displayName}}!</button>
    <mat-menu #userMenu="matMenu">
      <button mat-button (click)="logout()">Logout</button>
    </mat-menu>
  `,
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public user: firebase.User;

  constructor(private _afAuth: AngularFireAuth,
              private _dialog: MatDialog) {

  }

  public ngOnInit() {
    this._afAuth.authState
      .subscribe((user: firebase.User) => {
        this.user = user;
      });
  }

  public beginLogin(): void {
    this._dialog.open(LoginComponent, {
      position: {top: '10%'},
      width: '500px'
    });
  }

  public logout(): void {
    this._afAuth.auth.signOut();
  }
}
