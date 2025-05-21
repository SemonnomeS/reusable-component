import {
  Component,
  forwardRef,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  // Label for the input field
  @Input() label: string = '';
  // Unit label (e.g., months, years)
  @Input() unit: string = '';
  // Minimum value
  @Input() min: number = 1;
  // Maximum value
  @Input() max: number = 9999999;
  // Step value for increment/decrement
  @Input() step: number = 1;
  // Whether the field is required
  @Input() required: boolean = false;
  // Default value
  @Input() default: number = 1000;
  // Tooltip for increment button
  @Input() tooltipIncrement: string = 'Increase';
  //Tooltip for decrement button
  @Input() tooltipDecrement: string = 'Decrease';

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  value: number = this.default;
  lastValidValue: number = this.default;
  disabled: boolean = false;
  touched: boolean = false;
  error: boolean = false;
  focused: boolean = false;
  hovered: boolean = false;

  onChange = (value: number | null) => {};
  onTouched = () => {};

  ngOnInit() {
    this.setValue(this.default, false);
  }

  writeValue(value: number | null): void {
    if (value === null || isNaN(value)) {
      this.setValue(this.default, false);
    } else {
      this.setValue(value, false);
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Handle manual input, validate and format.
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/,/g, '');
    let num = Number(rawValue);

    if (rawValue === '' || isNaN(num)) {
      this.error = true;
      this.value = null as any;
      this.onChange(null);
      return;
    }

    this.setValue(num, true);

    input.value = this.formatNumber(this.value);
  }

  onBlur(): void {
    this.focused = false;
    this.markAsTouched();
  }

  onFocus(): void {
    this.focused = true;
  }

  increment(): void {
    if (this.disabled) return;
    const step = this.getDynamicStep();
    this.setValue((this.value || 0) + step, true);
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }

  decrement(): void {
    if (this.disabled) return;
    const step = this.getDynamicStep();
    this.setValue((this.value || 0) - step, true);
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }

  setValue(val: number, emit: boolean = true): void {
    const isValid = !isNaN(val) && val !== null;
    const isInRange = isValid && val >= this.min && val <= this.max;

    if (isInRange) {
      this.value = val;
      this.lastValidValue = val;
      this.error = false;
    } else {
      if (isValid) {
        // Value is a number but out of range
        if (val < this.min) {
          this.value = this.min;
        } else if (val > this.max) {
          this.value = this.max;
        }
      } else {
        // Value is invalid (NaN or null) - use last valid value
        this.value = this.lastValidValue;
      }
      this.error = true;
    }

    if (emit) {
      this.onChange(this.value);
    }
  }

  // Format number with thousand separators
  formatNumber(val: number | null): string {
    if (val === null || isNaN(val)) return '';
    return val.toLocaleString();
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  get isMinusDisabled(): boolean {
    return this.disabled || this.value <= this.min;
  }

  get isPlusDisabled(): boolean {
    return this.disabled || this.value >= this.max;
  }

  resetToDefault(): void {
    this.setValue(this.default, true);
    setTimeout(() => this.inputRef?.nativeElement.focus());
  }

  getDynamicStep(): number {
    if (this.value >= 100000) {
      return 20000;
    } else if (this.value >= 50000) {
      return 10000;
    } else if (this.value >= 20000) {
      return 5000;
    } else if (this.value >= 10000) {
      return 1000;
    }
    return this.step;
  }
}
