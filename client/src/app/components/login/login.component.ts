import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorNotifierService } from '../../services/error-notifier.service';
import { CustomValidators } from '../../services/custom-validators';
import { AngularFirestore } from 'angularfire2/firestore';

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
                <input type="email" matInput [formControl]="loginEmailControl" placeholder="E-Mail Address">
                <mat-error inciteControlMessages [control]="loginEmailControl"></mat-error>
              </mat-form-field>
              <mat-form-field>
                <input type="password" matInput [formControl]="loginPasswordControl" placeholder="Password">
                <mat-error inciteControlMessages [control]="loginPasswordControl"></mat-error>
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
          <form [formGroup]="registerForm">
            <div fxLayout="column" fxLayoutAlign="start center">
              <mat-form-field>
                <input type="text" matInput [formControl]="firstNameControl" placeholder="First Name">
                <mat-error inciteControlMessages [control]="firstNameControl"></mat-error>
              </mat-form-field>
              <mat-form-field>
                <input type="text" matInput [formControl]="lastNameControl" placeholder="Last Name">
                <mat-error inciteControlMessages [control]="lastNameControl"></mat-error>
              </mat-form-field>
              <mat-form-field>
                <input type="email" matInput [formControl]="registerEmailControl" placeholder="E-Mail Address">
                <mat-error inciteControlMessages [control]="registerEmailControl"></mat-error>
              </mat-form-field>
              <mat-form-field>
                <input type="password" matInput [formControl]="registerPasswordControl" placeholder="Password">
                <mat-error inciteControlMessages [control]="registerPasswordControl"></mat-error>
              </mat-form-field>
              <mat-form-field>
                <input type="password" matInput [formControl]="registerPasswordConfirmControl" placeholder="Confirm Password">
                <mat-error inciteControlMessages [control]="registerPasswordConfirmControl"></mat-error>
              </mat-form-field>
            </div>

            <div fxLayout>
              <div fxFlex="1 0"></div>
              <button mat-raised-button
                      type="submit"
                      [disabled]="loginForm.invalid"
                      (click)="doEmailPasswordRegister()">Register
              </button>
            </div>
          </form>
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
  public registerPasswordConfirmControl: FormControl;
  public firstNameControl: FormControl;
  public lastNameControl: FormControl;

  public isBusy: boolean;

  constructor(private _afAuth: AngularFireAuth,
              private _af: AngularFirestore,
              private _formBuilder: FormBuilder,
              private _errorNotifier: ErrorNotifierService) {
  }

  public ngOnInit() {
    this.loginEmailControl = new FormControl('', [Validators.required, CustomValidators.validEmail]);
    this.loginPasswordControl = new FormControl('', Validators.required);

    this.loginForm = this._formBuilder.group({
      'email': this.loginEmailControl,
      'password': this.loginPasswordControl
    });

    this.registerEmailControl = new FormControl('', [Validators.required, CustomValidators.validEmail]);
    this.registerPasswordControl = new FormControl('', [Validators.required, CustomValidators.validPassword]);
    this.registerPasswordConfirmControl = new FormControl('', [
      Validators.required,
      CustomValidators.getValidVerifiedPasswordValidator(this.registerPasswordControl)
    ]);
    this.firstNameControl = new FormControl('', Validators.required);
    this.lastNameControl = new FormControl('', Validators.required);

    this.registerForm = this._formBuilder.group({
      'email': this.registerEmailControl,
      'password': this.registerPasswordControl,
      'passwordConfirm': this.registerPasswordConfirmControl
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

  public async doEmailPasswordRegister(): Promise<any> {
    this.isBusy = true;
    try {
      const result = await this._afAuth.auth.createUserWithEmailAndPassword(
        this.registerEmailControl.value,
        this.registerPasswordControl.value
      );
      console.log('REGISTRATION RESULT', result);
    } catch (error) {
      console.warn(error);
      this._errorNotifier.showError(error.message);
    }
    this.isBusy = false;
  }
}
