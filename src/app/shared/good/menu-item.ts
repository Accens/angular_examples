import { Directive, ElementRef, inject } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

/**
 * Pozycja menu dla FocusKeyManager:
 *  - role="menuitem" i tabindex="-1" (fokus przenosi menedżer, Tab wychodzi z menu),
 *  - getLabel() włącza type-ahead (wpisanie litery przenosi fokus na pasującą pozycję).
 */
@Directive({
  selector: '[appMenuItem]',
  host: { role: 'menuitem', tabindex: '-1' },
})
export class MenuItem implements FocusableOption {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly disabled = false;

  focus(): void {
    this.el.nativeElement.focus();
  }

  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() ?? '';
  }
}
