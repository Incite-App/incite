import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable()
export class ErrorNotifierService {
  private _snackBarRefs: MatSnackBarRef<SimpleSnackBar>[] = [];

  constructor(private _snackBar: MatSnackBar) {
  }

  public showError(message: string): MatSnackBarRef<SimpleSnackBar> {
    const newSnackBarRef = this._snackBar.open(message, 'OK', {
      duration: 5000,
      announcementMessage: message,
      verticalPosition: 'top',
      extraClasses: ['error']
    });

    newSnackBarRef.afterDismissed()
      .toPromise()
      .then(() => {
        this._snackBarRefs.splice(this._snackBarRefs.indexOf(newSnackBarRef), 1);
      });

    this._snackBarRefs.push(newSnackBarRef);
    return newSnackBarRef;
  }

  public closeAll(): void {
    this._snackBarRefs.forEach((ref: MatSnackBarRef<SimpleSnackBar>) => {
      ref.dismiss();
    });
    this._snackBarRefs.length = 0;
  }
}
