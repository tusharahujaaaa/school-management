import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventData } from '../../models/dashboard.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="surface-card p-3 border-round-xl border-1 surface-border mb-3 flex align-items-center border-left-3 hover:shadow-1 transition-all"
         [ngClass]="{
           'border-left-blue-500': event.type === 'Exam',
           'border-left-orange-500': event.type === 'Meeting',
           'border-left-teal-500': event.type === 'Event',
           'border-left-purple-500': event.type === 'Holiday'
         }">
      <div class="flex-grow-1">
        <h4 class="m-0 text-900 font-medium mb-2">{{ event.title }}</h4>
        <span class="text-500 text-sm flex align-items-center">
          <i class="pi pi-calendar mr-2"></i> {{ event.date }}
        </span>
      </div>
      <div class="text-sm font-medium px-2 py-1 border-round"
           [ngClass]="{
             'bg-blue-50 text-blue-600': event.type === 'Exam',
             'bg-orange-50 text-orange-600': event.type === 'Meeting',
             'bg-teal-50 text-teal-600': event.type === 'Event',
             'bg-purple-50 text-purple-600': event.type === 'Holiday'
           }">
        {{ event.type }}
      </div>
    </div>
  `
})
export class EventCardComponent {
  @Input() event!: EventData;
}
