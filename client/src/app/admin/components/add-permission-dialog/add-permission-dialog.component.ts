import { Component } from '@angular/core';
import { allPermissionSetOptions, PermissionSetOption } from '../../../data/permissions';

@Component({
  selector: 'incite-add-permission-dialog',
  template: `
    <h3 mat-dialog-title>Choose a permission set...</h3>
    <mat-dialog-content>
      <mat-select [(ngModel)]="selectedPermissionSet" placeholder="Permission">
        <mat-option *ngFor="let option of allOptions" [value]="option.id">{{option.displayName}}</mat-option>
      </mat-select>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="selectedPermissionSet">Select</button>
    </mat-dialog-actions>`
})
export class AddPermissionDialogComponent {
  public allOptions = allPermissionSetOptions;
  public selectedPermissionSet: PermissionSetOption;
}
