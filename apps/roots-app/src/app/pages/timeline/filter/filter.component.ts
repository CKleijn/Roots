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
  searchType: string | undefined;

  constructor(
    private dialogRef: MatDialogRef<TimelineComponent>,
    @Inject(MAT_DIALOG_DATA) private passedData: Filter
  ) {}

  // Load everything when start up component
  ngOnInit(): void {
    this.passedData.radioValue &&
      (this.radioValue = this.passedData.radioValue);
    this.passedData.showArchivedEvents &&
      (this.showArchivedEvents = this.passedData.showArchivedEvents);
    this.passedData.searchType &&
      (this.searchType = this.passedData.searchType);
  }

  // Toggle if you want to show archive events or not
  toggleArchivedEvents(): void {
    this.showArchivedEvents
      ? (this.showArchivedEvents = false)
      : (this.showArchivedEvents = true);
  }

  // Submit the filter
  filterSubmit(): void {
    this.dialogRef.close(new Filter(this.radioValue, this.showArchivedEvents, this.searchType));
  }

  // Close the dialog
  closeDialog() {
    this.dialogRef.close();
  }
}
