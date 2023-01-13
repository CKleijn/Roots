import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimelineComponent } from '../timeline.component';
import { Filter } from './filter.model';

@Component({
  selector: 'roots-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  radioValue: string | undefined;
  showArchivedEvents: boolean | undefined;

  constructor(
    private dialogRef: MatDialogRef<TimelineComponent>,
    @Inject(MAT_DIALOG_DATA) private passedData: Filter
  ) {}

  ngOnInit(): void {
    this.passedData.radioValue &&
      (this.radioValue = this.passedData.radioValue);
    this.passedData.showArchivedEvents &&
      (this.showArchivedEvents = this.passedData.showArchivedEvents);
  }

  toggleArchivedEvents(): void {
    this.showArchivedEvents
      ? (this.showArchivedEvents = false)
      : (this.showArchivedEvents = true);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  filterSubmit(): void {
    this.dialogRef.close(new Filter(this.radioValue, this.showArchivedEvents));
  }
}
