import { ICompany } from "@roots/data";
import { Event } from '../event/event.schema'

export class CompanyDTO implements ICompany {
    name: string;
    emailDomain: string;
    events: Event[];
}