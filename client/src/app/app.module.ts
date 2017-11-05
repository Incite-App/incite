import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { ComponentsModule } from './components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from './services/services.module';
import { ErrorNotifierService } from './services/error-notifier.service';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ComponentsModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyB8CAh3Cddj9SQdadar8ULN9nLFGXF2fCU',
      authDomain: 'incite-10624.firebaseapp.com',
      databaseURL: 'https://incite-10624.firebaseio.com',
      projectId: 'incite-10624',
      storageBucket: 'incite-10624.appspot.com',
      messagingSenderId: '681440609050'
    }),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    AngularFireAuth,
    ErrorNotifierService
  ],
  bootstrap: [AppComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AppModule {
  constructor(private _userService: UserService) {
    console.log('INIT');
    this._userService.init();
  }
}
