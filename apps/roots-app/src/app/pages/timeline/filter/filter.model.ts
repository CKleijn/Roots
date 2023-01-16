export class Filter {
  radioValue: string | undefined;
  showArchivedEvents: boolean | undefined;

  // Create instance of Filter
  constructor(
    radioValue: string | undefined,
    showArchivedEvents: boolean | undefined
  ) {
    this.radioValue = radioValue;
    this.showArchivedEvents = showArchivedEvents;
  }
}
