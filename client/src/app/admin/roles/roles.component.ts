import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Role } from '../../models/role';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'incite-roles',
  template: `
    <mat-list>
      <mat-list-item *ngFor="let role of roles | async">
        {{role | json}}
      </mat-list-item>
    </mat-list>`,
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  public roles: Observable<Role[]>;
  private _rolesCollection: AngularFirestoreCollection<Role>;

  constructor(private _afs: AngularFirestore) {
  }

  public ngOnInit() {
    this._rolesCollection = this._afs.collection('roles');
    this.roles = this._rolesCollection.valueChanges();
  }

}
