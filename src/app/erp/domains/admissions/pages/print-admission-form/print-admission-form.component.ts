import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-print-admission-form',
  standalone: true,
  imports: [
        CommonModule, ButtonModule, TranslatePipe
    ],
  templateUrl: './print-admission-form.component.html'
})
export class PrintAdmissionFormComponent {
  
  printForm() {
    window.print();
  }
}
