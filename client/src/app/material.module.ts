import {
  MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatListModule, MatMenuModule,
  MatProgressSpinnerModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { NgModule } from '@angular/core';

const COMPONENTS = [
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatDialogModule,
  MatListModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTabsModule,
  MatSidenavModule,
  MatSelectModule
];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS,
})
export class MaterialModule {
}
