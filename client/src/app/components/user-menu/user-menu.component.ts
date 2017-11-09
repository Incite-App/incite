import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { InciteUser } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Observable';
import { Role } from '../../models/role';

@Component({
  selector: 'incite-user-menu',
  template: `
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item routerLink="/admin" routerLinkActive="active" *ngIf="(user$ | async)?.role?.isSuperUser">Admin</button>
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu>
    <button *ngIf="!(user$ | async)" color="accent" mat-raised-button (click)="beginLogin()">Login</button>
    <button *ngIf="!!(user$ | async)" color="primary" mat-raised-button [matMenuTriggerFor]="userMenu">
      {{(user$ | async)?.displayName}}
      <img *ngIf="!!(user$ | async).photoURL" [src]="(user$ | async)?.photoURL" alt="avatar">
    </button>
  `,
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  public user$: Observable<InciteUser>;
  private _dialogRef: MatDialogRef<LoginComponent>;

  constructor(private _dialog: MatDialog,
              private _userService: UserService) {

  }

  public ngOnInit() {
    this.user$ = this._userService.currentUser;
    this.user$.subscribe((user: InciteUser) => {
      if (!!user && !!this._dialogRef) {
        this._dialogRef.close();
      }
    });
  }

  public beginLogin(): void {
    this._dialogRef = this._dialog.open(LoginComponent, {
      position: {top: '10%'},
      width: '500px'
    });
  }

  public logout(): void {
    this._userService.logout();
  }
}
