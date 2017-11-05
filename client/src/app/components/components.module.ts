import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MatSnackBar } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ControlMessagesDirective } from './control-messages/control-messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';

const COMPONENTS = [
  LoginComponent,
  UserMenuComponent,
  ControlMessagesDirective
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AngularFireModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [LoginComponent],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    AngularFireAuth,
    MatSnackBar
  ]
})
export class ComponentsModule {
}
