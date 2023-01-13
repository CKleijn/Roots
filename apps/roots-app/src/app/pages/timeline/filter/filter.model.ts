export class Filter {
  radioValue: string | undefined;
  showArchivedEvents: boolean | undefined;

  constructor(radioValue: string | undefined, showArchivedEvents: boolean | undefined) {
    this.radioValue = radioValue;
    this.showArchivedEvents = showArchivedEvents;
  }
}
