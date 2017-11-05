import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { InciteUser } from '../models/user';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UserService {
  public currentUser: BehaviorSubject<InciteUser> = new BehaviorSubject(undefined);
  private _firebaseUser: firebase.User;
  private _userSubscription: Subscription;

  constructor(private _afAuth: AngularFireAuth,
              private _af: AngularFirestore) {
  }

  public init() {
    this._afAuth.authState
      .subscribe((user: firebase.User) => {
        this._firebaseUser = user;
        console.log('FIREBASE USER', this._firebaseUser);
        if (!!this._firebaseUser) {
          const inciteUser = this._createInciteUser(this._firebaseUser);
          console.log('INCITE USER', inciteUser);
          this.currentUser.next(inciteUser);
          this._syncInciteUserToFirebase(inciteUser);
        } else {
          this.currentUser.next(undefined);
        }
      });
  }

  public logout() {
    this._afAuth.auth.signOut();
  }

  private _createInciteUser(firebaseUser: firebase.User): InciteUser {
    const nameArray = firebaseUser.displayName.split(' ');

    const inciteUser: InciteUser = {
      firstName: '',
      lastName: '',
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL
    };
    if (!!nameArray.length) {
      inciteUser.firstName = nameArray[0];
      if (nameArray.length > 1) {
        nameArray.splice(0, 1);
        inciteUser.lastName = nameArray.join(' ');
      }
    }
    return inciteUser;
  }

  private _syncInciteUserToFirebase(inciteUser: InciteUser) {
    const docRef = this._af.doc(`users/${this._firebaseUser.uid}`);
    if (!!this._userSubscription) {
      this._userSubscription.unsubscribe();
      this._userSubscription = undefined;
    }
    this._userSubscription = docRef.valueChanges()
      .subscribe((document: InciteUser) => {
        if (!document) {
          this._af.doc(`users/${this._firebaseUser.uid}`).set(inciteUser)
            .then(() => {
              console.log('INCITE USER CREATED');
            })
            .catch((error) => {
              console.warn('INCITE USER CREATE ERROR', error);
            });
        } else {
          docRef.update(inciteUser)
            .then(() => {
              console.log('INCITE USER UPDATED');
            })
            .catch((error) => {
              console.warn('UPDATE ERROR', error);
            });
        }
      }, (error: any) => {
        console.warn(error);
        if (!!this._userSubscription) {
          this._userSubscription.unsubscribe();
          this._userSubscription = undefined;
        }
      });
  }
}
