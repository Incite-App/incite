export interface PermissionSet {
  id?: string;
  collectionName: string;
  create: boolean;
  read: boolean;
  delete: boolean;
  update: boolean;
}
