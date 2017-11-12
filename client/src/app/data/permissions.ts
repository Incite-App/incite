export interface PermissionSetOption {
  id: string;
  displayName: string;
}

export const allPermissionSetOptions: PermissionSetOption[] = [{
  id: 'users',
  displayName: 'Users'
}, {
  id: 'organizations',
  displayName: 'Organizations (congregations)'
}, {
  id: 'roles',
  displayName: 'User Roles'
}];
