import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AdminAuthGuard } from './admin-auth-guard.service';
import { MaterialModule } from '../material.module';
import { RolesComponent } from './roles/roles.component';
import { RoleComponent } from './components/role/role.component';
import { FormsModule } from '@angular/forms';
import { AddPermissionDialogComponent } from './components/add-permission-dialog/add-permission-dialog.component';

const adminRoutes: Routes = [{
  path: 'admin',
  component: MainComponent,
  children: [{
    path: 'roles',
    component: RolesComponent
  }]
}];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(adminRoutes)
  ],
  declarations: [
    MainComponent,
    RolesComponent,
    RoleComponent,
    AddPermissionDialogComponent
  ],
  entryComponents: [
    AddPermissionDialogComponent
  ],
  providers: [
    AdminAuthGuard
  ]
})
export class AdminModule {
}
