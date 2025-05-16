import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  imports: [NgFor],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() pages: number = 0;

  @Output() pageChange = new EventEmitter<number>();

  get pagesList(): number[] {
    return Array.from({ length: this.pages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
