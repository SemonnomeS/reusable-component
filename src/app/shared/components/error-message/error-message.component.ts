import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div class="error-message" *ngIf="show">
      {{ message }}
    </div>
  `,
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input() show: boolean = false;
  @Input() message: string = 'Invalid';
}
