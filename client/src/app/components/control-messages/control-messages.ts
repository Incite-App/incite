import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators } from '../../services/custom-validators';

@Directive({
  selector: '[inciteControlMessages]'
})
export class ControlMessagesDirective implements OnChanges {
  @Input()
  public control: FormControl;

  private _exemptErrors: string[] = ['nonUniqueEmail', 'verifiedPassword', 'invalidDate', 'invalidRoutingNumberBankNotFound'];
  private _ignoredErrors: string[] = ['__zone_symbol__state', '__zone_symbol__value'];
  private _controlSubscription: Subscription;

  constructor(private _element: ElementRef) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.control && !!changes.control.currentValue) {
      if (!!this._controlSubscription) {
        this._controlSubscription.unsubscribe();
        this._controlSubscription = null;
      }

      this._controlSubscription = this.control.valueChanges
        .subscribe(() => {
          this._element.nativeElement.innerHTML = '';
          for (const propertyName in this.control.errors) {
            if (((this.control.touched && this.control.dirty) || this._exemptErrors.indexOf(propertyName) >= 0) &&
              this._ignoredErrors.indexOf(propertyName) === -1) {
              const newElement = document.createElement('span');
              newElement.innerHTML = CustomValidators.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
              newElement.appendChild(document.createElement('br'));
              this._element.nativeElement.appendChild(newElement);
            }
          }
        });
    }
  }
}
