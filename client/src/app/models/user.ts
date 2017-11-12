import { Role } from './role';
import * as firebase from 'firebase';

export interface InciteUser {
  displayName?: string;
  email?: string;
  photoURL?: string;
  role?: Role;
}

export interface InciteUserDocument {
  displayName?: string;
  email?: string;
  photoURL?: string;
  role?: firebase.firestore.DocumentReference;
}
