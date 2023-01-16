// Create instance of Event
export class Event {
    title = "";
    description = "";
    content = "";
    tags = [];
    eventDate: Date = <Date>{};
    isActive!: boolean;
}