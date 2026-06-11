import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-print-admission-form',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './print-admission-form.component.html'
})
export class PrintAdmissionFormComponent {
  
  printForm() {
    window.print();
  }
}
