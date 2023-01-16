export class Filter {
  radioValue: string | undefined;
  showArchivedEvents: boolean | undefined;
  searchType: string | undefined;

  // Create instance of Filter
  constructor(
    radioValue: string | undefined,
    showArchivedEvents: boolean | undefined,
    searchType: string | undefined
  ) {
    this.radioValue = radioValue;
    this.showArchivedEvents = showArchivedEvents;
    this.searchType = searchType;
  }
}
