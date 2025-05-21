import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

@NgModule({
  declarations: [NumberInputComponent, ErrorMessageComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [NumberInputComponent, ErrorMessageComponent],
})
export class SharedModule {}
