import { Directive, ElementRef, inject } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

/**
 * Minimalna implementacja FocusableOption dla FocusKeyManager.
 * CELOWO bez: roli menuitem, tabindex="-1" (roving tabindex), getLabel() (type-ahead).
 */
@Directive({ selector: '[appFocusable]' })
export class FocusableItem implements FocusableOption {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  focus(): void {
    this.el.nativeElement.focus();
  }
}
