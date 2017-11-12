import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { InciteUser, InciteUserDocument } from '../models/user';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Role } from '../models/role';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  public currentUser: BehaviorSubject<InciteUser> = new BehaviorSubject(undefined);
  private _firebaseUser: firebase.User;
  private _userSubscription: Subscription;

  constructor(private _afAuth: AngularFireAuth,
              private _af: AngularFirestore,
              private _router: Router) {
  }

  public init() {
    this._afAuth.authState
      .subscribe((user: firebase.User) => {
        this._firebaseUser = user;
        console.log('FIREBASE USER', this._firebaseUser);
        if (!!this._firebaseUser) {
          this.syncInciteUserToFirebase();
        } else {
          this.currentUser.next(undefined);
        }
      });
  }

  public async logout(): Promise<any> {
    await this._afAuth.auth.signOut();
    await this._router.navigate(['']);
  }

  public syncInciteUserToFirebase(displayName?: string): Promise<InciteUser> {
    const docRef = this._af.doc(`users/${this._firebaseUser.uid}`);

    if (!!this._userSubscription) {
      this._userSubscription.unsubscribe();
      this._userSubscription = undefined;
    }
    return new Promise((resolve, reject) => {
      this._userSubscription = docRef.valueChanges()
        .subscribe(async (document: InciteUserDocument) => {
          if (!document) {
            const inciteUser = this.createInciteUserFromFirebaseUser(this._firebaseUser);
            if (!!displayName) {
              inciteUser.displayName = displayName;
            }
            this._af.doc(`users/${this._firebaseUser.uid}`).set(inciteUser)
              .then(() => {
                console.log('INCITE USER CREATED', inciteUser);
              })
              .catch((error) => {
                console.warn('INCITE USER CREATE ERROR', error);
                reject(error);
              });
          } else if (document.displayName !== this._firebaseUser.displayName ||
            document.email !== this._firebaseUser.email ||
            document.photoURL !== this._firebaseUser.photoURL) {
            const inciteUser = this.createInciteUserFromFirebaseUser(this._firebaseUser);
            docRef.update(inciteUser)
              .then(() => {
                console.log('INCITE USER UPDATED');
                console.log('INCITE USER', inciteUser);
              })
              .catch((error) => {
                console.warn('UPDATE ERROR', error);
                reject(error);
              });
          } else {
            this.hydrateInciteUser(document)
              .then((inciteUser: InciteUser) => {
                console.log('INCITE USER', inciteUser);
                this.currentUser.next(inciteUser);
                resolve(inciteUser);
              });
          }
        }, (error: any) => {
          console.warn('ERROR SYNCING USER', error);
          if (!!this._userSubscription) {
            this._userSubscription.unsubscribe();
            this._userSubscription = undefined;
          }
          reject(error);
        });
    });
  }

  public async hydrateInciteUser(document: InciteUserDocument): Promise<InciteUser> {
    const returnValue: InciteUser = {
      displayName: document.displayName,
      email: document.email,
      photoURL: document.photoURL
    };

    if (!!document['role'] && document['role'] instanceof firebase.firestore.DocumentReference) {
      const roleRef = document.role as any;
      const data: firebase.firestore.DocumentSnapshot = await roleRef.get();
      returnValue.role = data.data() as Role;
      returnValue.role.id = data.id;
    }

    return returnValue;
  }

  public createInciteUserFromFirebaseUser(firebaseUser: firebase.User): InciteUser {
    return {
      displayName: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL
    };

    // if (!!inciteUser['role'] && inciteUser['role'] instanceof firebase.firestore.DocumentReference) {
    //   const roleRef = inciteUser.role as any;
    //   const data: firebase.firestore.DocumentSnapshot = await roleRef.get();
    //   inciteUser.role = data.data() as Role;
    //   inciteUser.role.id = data.id;
    // }
    //
    // return inciteUser;
  }
}
