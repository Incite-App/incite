import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Role } from '../../../models/role';
import { PermissionSet } from '../../../models/permission-set';
import { MatDialog, MatListOptionChange } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { DocumentChangeAction } from 'angularfire2/firestore/interfaces';
import { AddPermissionDialogComponent } from '../add-permission-dialog/add-permission-dialog.component';

@Component({
  selector: 'incite-role',
  template: `
    <h3>{{role.name}}</h3>
    <div class="permissions-container">
      <div fxLayout>
        <span>Permissions</span>
        <button mat-button (click)="beginAddPermissionSet()">Add</button>
      </div>
      <div class="permission-set" *ngFor="let permissionSet of permissions">
        <span>{{permissionSet.collectionName}}</span>
        <mat-selection-list>
          <mat-list-option [selected]="permissionSet.create"
                           (selectionChange)="handlePermissionChange($event, permissionSet, 'create')">Create
          </mat-list-option>
          <mat-list-option [selected]="permissionSet.read"
                           (selectionChange)="handlePermissionChange($event, permissionSet, 'read')">Read
          </mat-list-option>
          <mat-list-option [selected]="permissionSet.update"
                           (selectionChange)="handlePermissionChange($event, permissionSet, 'update')">Update
          </mat-list-option>
          <mat-list-option [selected]="permissionSet.delete"
                           (selectionChange)="handlePermissionChange($event, permissionSet, 'delete')">Delete
          </mat-list-option>
        </mat-selection-list>
      </div>
    </div>`,
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnChanges {
  @Input()
  public role: Role;

  public permissions: PermissionSet[] = [];

  private _subscription: Subscription;

  constructor(private _afs: AngularFirestore,
              private _dialog: MatDialog) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.role && !!changes.role.currentValue) {
      if (!!this._subscription) {
        this._subscription.unsubscribe();
      }
      this._subscription = this._afs.collection('roles').doc(changes.role.currentValue.id).collection('permissions')
        .snapshotChanges()
        .subscribe((actions: DocumentChangeAction[]) => {
          this.permissions = actions.map((action: DocumentChangeAction) => {
            const permissionSet = action.payload.doc.data() as PermissionSet;
            permissionSet.id = action.payload.doc.id;
            return permissionSet;
          });
        });
    }
  }

  public async handlePermissionChange(changeEvent: MatListOptionChange, permissionSet: PermissionSet, property: string): Promise<any> {
    // TODO - change component to use form control or ngModel when mat-list-option supports it - this is dumb
    if (permissionSet[property] !== changeEvent.selected) {
      permissionSet[property] = changeEvent.selected;
      try {
        const permissionSetRef = this._afs.doc<PermissionSet>(`roles/${this.role.id}/permissions/${permissionSet.id}`);
        console.log('PERMISSION UPDATE', permissionSet);
        await permissionSetRef.update(permissionSet);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  public async beginAddPermissionSet(): Promise<any> {
    const dialogRef = this._dialog.open(AddPermissionDialogComponent, {
      width: '300px'
    });

    const dialogResult: string = await dialogRef.afterClosed().toPromise();
    console.log('RESULT', dialogResult);

    try {
      this._afs.collection<PermissionSet>(`roles/${this.role.id}/permissions`)
        .add({
          collectionName: dialogResult,
          create: false,
          read: false,
          update: false,
          delete: false
        });
    } catch (error) {
      console.warn(error);
    }
  }
}
