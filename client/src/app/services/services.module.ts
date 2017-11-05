import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [
    UserService
  ]
})
export class ServicesModule {
}
