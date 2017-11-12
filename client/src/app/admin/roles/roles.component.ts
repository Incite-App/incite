import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Role } from '../../models/role';
import { DocumentChangeAction } from 'angularfire2/firestore/interfaces';

@Component({
  selector: 'incite-roles',
  template: `
    <mat-list>
      <incite-role *ngFor="let role of roles" [role]="role"></incite-role>
    </mat-list>`,
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public roles: Role[] = [];
  private _rolesCollection: AngularFirestoreCollection<Role>;

  constructor(private _afs: AngularFirestore) {
  }

  public ngOnInit() {
    this._rolesCollection = this._afs.collection('roles');
    this._rolesCollection.snapshotChanges()
      .subscribe((actions: DocumentChangeAction[]) => {
        this.roles = actions.map((action: DocumentChangeAction) => {
          const role = action.payload.doc.data() as Role;
          role.id = action.payload.doc.id;
          return role;
        });
      });


  }


}
