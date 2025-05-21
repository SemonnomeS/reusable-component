import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'reusable-component';
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      fhwaTerm: [
        11,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      miles: [
        11000,
        [Validators.required, Validators.min(1000), Validators.max(500000)],
      ],
    });
  }

  ngOnInit(): void {
    this.myForm.valueChanges.subscribe((value) => {
      console.log('Form value changed:', value);
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form submitted:', this.myForm.value);
    }
  }
}
