import { PermissionSet } from './permission-set';

export interface Role {
  id?: string;
  name: string;
  isSuperUser: boolean;
  permissions?: PermissionSet[];
}
