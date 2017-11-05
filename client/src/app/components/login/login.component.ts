import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorNotifierService } from '../../services/error-notifier.service';

@Component({
  selector: 'incite-login',
  template: `
    <div mat-dialog-content>
      <mat-progress-spinner mode="indeterminate" *ngIf="isBusy"></mat-progress-spinner>
      <mat-tab-group>
        <mat-tab label="Login">
          <form [formGroup]="loginForm">
            <div fxLayout="column" fxLayoutAlign="start center">
              <mat-form-field>
                <input type="email" matInput formControlName="email" placeholder="E-Mail Address">
              </mat-form-field>
              <mat-form-field>
                <input type="password" matInput formControlName="password" placeholder="Password">
              </mat-form-field>
            </div>

            <div fxLayout>
              <div fxFlex="1 0"></div>
              <button mat-raised-button
                      type="submit"
                      [disabled]="loginForm.invalid"
                      (click)="doEmailPasswordLogin()">Login
              </button>
            </div>
          </form>

          <mat-list>
            <mat-divider>Or Sign In With...</mat-divider>
            <mat-list-item>
              <button type="button" mat-raised-button (click)="doGoogleLogin()">Google</button>
            </mat-list-item>
          </mat-list>
        </mat-tab>
        <mat-tab label="Register">
          <!--<form [formGroup]="registerForm">-->
            <!--<div fxLayout="column" fxLayoutAlign="start center">-->
              <!--<mat-form-field>-->
                <!--<input type="email" matInput formControlName="email" placeholder="E-Mail Address">-->
              <!--</mat-form-field>-->
              <!--<mat-form-field>-->
                <!--<input type="password" matInput formControlName="password" placeholder="Password">-->
              <!--</mat-form-field>-->
            <!--</div>-->

            <!--<div fxLayout>-->
              <!--<div fxFlex="1 0"></div>-->
              <!--<button mat-raised-button-->
                      <!--type="submit"-->
                      <!--[disabled]="loginForm.invalid"-->
                      <!--(click)="doEmailPasswordLogin()">Login-->
              <!--</button>-->
            <!--</div>-->
          <!--</form>-->
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public loginEmailControl: FormControl;
  public loginPasswordControl: FormControl;

  public registerEmailControl: FormControl;
  public registerPasswordControl: FormControl;

  public isBusy: boolean;

  constructor(private _afAuth: AngularFireAuth,
              private _formBuilder: FormBuilder,
              private _errorNotifier: ErrorNotifierService) {
  }

  public ngOnInit() {
    this.loginEmailControl = new FormControl('', Validators.required);
    this.loginPasswordControl = new FormControl('', Validators.required);

    this.loginForm = this._formBuilder.group({
      'email': this.loginEmailControl,
      'password': this.loginPasswordControl
    });
  }

  public async doGoogleLogin(): Promise<any> {
    this.isBusy = true;
    try {
      const result: firebase.auth.UserCredential = await this._afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      console.warn(error);
    }
    this.isBusy = false;
  }

  public async doEmailPasswordLogin(): Promise<any> {
    console.log('TEST', this._errorNotifier);
    this.isBusy = true;
    try {
      const result: firebase.auth.UserCredential = await this._afAuth.auth.signInWithEmailAndPassword(
        this.loginEmailControl.value,
        this.loginPasswordControl.value
      );
      console.log('RESULT', result);
    } catch (error) {
      console.warn(error);
      this._errorNotifier.showError(error.message);
    }
    this.isBusy = false;
  }
}
