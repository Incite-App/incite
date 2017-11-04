import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyB8CAh3Cddj9SQdadar8ULN9nLFGXF2fCU',
      authDomain: 'incite-10624.firebaseapp.com',
      databaseURL: 'https://incite-10624.firebaseio.com',
      projectId: 'incite-10624',
      storageBucket: 'incite-10624.appspot.com',
      messagingSenderId: '681440609050'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
