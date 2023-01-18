/* eslint-disable @typescript-eslint/no-var-requires */
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.prod';
import { TagService } from './tag.service';
import { Tag } from './tag.model';
import { Types } from 'mongoose';
import { Organization, Event, } from '@roots/data';
import { ToastrModule } from 'ngx-toastr';

const organizationId = '6391333037ceb01d296c5981';
const tagIdOne = new Types.ObjectId('6391333037ceb01d296c5982');
const tagIdTwo = new Types.ObjectId('6391333037ceb01d296c5983');

fdescribe('TagService', () => {
    let service: TagService;
    let httpMock: HttpTestingController;
    let dummyTags: Tag[] = [];
    let dummyOrgs: Organization[] = [];
    let dummyEvents: Event[] = [];

    beforeEach(() => {
        jest.setTimeout(600000);
        dummyEvents = [
            {
                _id: new Types.ObjectId(),
                title: 'Mock Title Event',
                description:'Mock Description Event',
                content: 'Mock Content Event',
                tags:[
                    tagIdOne,
                    tagIdTwo
                ],
                eventDate: new Date(),
                isActive: true
            }
        ]

        dummyTags = [
            {
                _id: tagIdOne,
                name: "Mock Tag One",
                organization: organizationId,
            },
            {
                _id: tagIdTwo,
                name: "Mock Tag Two",
                organization: organizationId,
            }
        ]

        dummyOrgs = [
            {
                _id: new Types.ObjectId(organizationId),
                name:'Mock Name Organization',
                emailDomain:'organization.mock',
                events: [dummyEvents[0]._id],
                tags: [dummyTags[0]._id,dummyTags[1]._id],
                logs: [],
            }
        ]

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                ToastrModule.forRoot()
            ],
            providers: [
                TagService
            ]
        });

        service = TestBed.inject(TagService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should return tags when calling getAllTagsByOrganization', (done) => {
        service.getAllTagsByOrganization(dummyOrgs[0]._id.toString()).subscribe((tags) => {
            expect(tags.length).toBe(2);

            expect(tags.at(0)?._id).toEqual(dummyTags.at(0)?._id);
            expect(tags.at(0).name).toEqual(dummyTags.at(0)?.name);
            expect(tags.at(0).organization).toEqual(dummyTags.at(0)?.organization);

            expect(tags.at(1)?._id).toEqual(dummyTags.at(1)?._id);
            expect(tags.at(1).name).toEqual(dummyTags.at(1)?.name);
            expect(tags.at(1).organization).toEqual(dummyTags.at(1)?.organization);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/organizations/' + organizationId);
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/organizations/' + organizationId);
        expect(req.request.method).toBe("GET");
        req.flush(dummyTags);
    });

    it('should return no tags when calling getAllTagsByOrganization', (done) => {
        dummyTags = [];

        service.getAllTagsByOrganization(dummyOrgs[0]._id.toString()).subscribe((tags) => {
            expect(tags.length).toBe(0);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/organizations/' + organizationId);
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/organizations/' + organizationId);
        expect(req.request.method).toBe("GET");
        req.flush(dummyTags);
    });

    it('should return tags when calling getTagById', (done) => {
        service.getTagById(dummyOrgs[0].tags[0].toString()).subscribe((tag) => {
            expect(tag.length).toBe(2);

            expect(tag.at(0)?._id).toEqual(dummyTags.at(0)?._id);
            expect(tag.at(0).name).toEqual(dummyTags.at(0)?.name);
            expect(tag.at(0).organization).toEqual(dummyTags.at(0)?.organization);

            expect(tag.at(1)?._id).toEqual(dummyTags.at(1)?._id);
            expect(tag.at(1).name).toEqual(dummyTags.at(1)?.name);
            expect(tag.at(1).organization).toEqual(dummyTags.at(1)?.organization);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/' + dummyOrgs[0].tags[0].toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/' + dummyOrgs[0].tags[0].toString());
        expect(req.request.method).toBe("GET");
        req.flush(dummyTags);
    });

    it('should return no tags when calling getTagById', (done) => {
        dummyTags = [];

        service.getTagById(dummyTags[0]?.toString()).subscribe((tag) => {
            expect(tag.length).toBe(0);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/' + undefined);
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/' + undefined);
        expect(req.request.method).toBe("GET");
        req.flush(dummyTags);
    });

    it('should return tag when calling postTagInEvent', (done) => {
        service.postTagInEvent(dummyOrgs[0].tags[0],dummyOrgs[0]._id.toString(),dummyEvents[0]._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(2);
            
            expect(tag.at(0)?._id).toEqual(dummyTags.at(0)?._id);
            expect(tag.at(0).name).toEqual(dummyTags.at(0)?.name);
            expect(tag.at(0).organization).toEqual(dummyTags.at(0)?.organization);

            expect(tag.at(1)?._id).toEqual(dummyTags.at(1)?._id);
            expect(tag.at(1).name).toEqual(dummyTags.at(1)?.name);
            expect(tag.at(1).organization).toEqual(dummyTags.at(1)?.organization);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString() + '/events/' + dummyEvents[0]._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString() + '/events/' + dummyEvents[0]._id.toString());
        expect(req.request.method).toBe("POST");
        req.flush(dummyTags);
    });

    it('should return no tag when calling postTagInEvent', (done) => {
        dummyTags = [];

        service.postTagInEvent(dummyOrgs[0].tags[0],dummyOrgs[0]._id.toString(),dummyEvents[0]._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(0);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString() + '/events/' + dummyEvents[0]._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString() + '/events/' + dummyEvents[0]._id.toString());
        expect(req.request.method).toBe("POST");
        req.flush(dummyTags);
    });

    it('should return tag when calling postTagInOrganization', (done) => {
        service.postTagInOrganization(dummyOrgs[0].tags[0],dummyOrgs[0]._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(2);
            
            expect(tag.at(0)?._id).toEqual(dummyTags.at(0)?._id);
            expect(tag.at(0).name).toEqual(dummyTags.at(0)?.name);
            expect(tag.at(0).organization).toEqual(dummyTags.at(0)?.organization);

            expect(tag.at(1)?._id).toEqual(dummyTags.at(1)?._id);
            expect(tag.at(1).name).toEqual(dummyTags.at(1)?.name);
            expect(tag.at(1).organization).toEqual(dummyTags.at(1)?.organization);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString());
        expect(req.request.method).toBe("POST");
        req.flush(dummyTags);
    });

    it('should return no tag when calling postTagInOrganization', (done) => {
        dummyTags = [];

        service.postTagInOrganization(dummyOrgs[0].tags[0],dummyOrgs[0]._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(0);

            done();
        });
        
        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/new/organizations/' + dummyOrgs[0]._id.toString());
        expect(req.request.method).toBe("POST");
        req.flush(dummyTags);
    });
    
    it('should return tag when calling putTagInEvent', (done) => {
        service.putTag(dummyTags[0], dummyTags[0]._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(2);
            
            expect(tag.at(0)?._id).toEqual(dummyTags.at(0)?._id);
            expect(tag.at(0).name).toEqual(dummyTags.at(0)?.name);
            expect(tag.at(0).organization).toEqual(dummyTags.at(0)?.organization);

            expect(tag.at(1)?._id).toEqual(dummyTags.at(1)?._id);
            expect(tag.at(1).name).toEqual(dummyTags.at(1)?.name);
            expect(tag.at(1).organization).toEqual(dummyTags.at(1)?.organization);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/' + dummyTags[0]._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/' + dummyTags[0]._id.toString());
        expect(req.request.method).toBe("PUT");
        req.flush(dummyTags);
    });

    it('should return no tag when calling putTagInEvent', (done) => {
        dummyTags = [];

        service.putTag(dummyTags[0], dummyTags[0]?._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(0);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/' + undefined);
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/' + undefined);
        expect(req.request.method).toBe("PUT");
        req.flush(dummyTags);
    });
    
    it('should return empty list when delete call has been made', (done) => {
        dummyTags = [];

        service.deleteTag(dummyTags[0]?.toString(), dummyOrgs[0]?._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(0)

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/' + dummyTags[0]?.toString() + "/organization/" + dummyOrgs[0]?._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/' + dummyTags[0]?.toString() + "/organization/" + dummyOrgs[0]?._id.toString());
        expect(req.request.method).toBe("DELETE");
        req.flush(dummyTags);
    });

    it('should return list when delete call has been made', (done) => {
        service.deleteTag(dummyTags[0]?.toString(), dummyOrgs[0]?._id.toString()).subscribe((tag) => {
            expect(tag.length).toBe(2);
            
            expect(tag.at(0)?._id).toEqual(dummyTags.at(0)?._id);
            expect(tag.at(0).name).toEqual(dummyTags.at(0)?.name);
            expect(tag.at(0).organization).toEqual(dummyTags.at(0)?.organization);

            expect(tag.at(1)?._id).toEqual(dummyTags.at(1)?._id);
            expect(tag.at(1).name).toEqual(dummyTags.at(1)?.name);
            expect(tag.at(1).organization).toEqual(dummyTags.at(1)?.organization);

            done();
        });

        const req = httpMock.expectOne(environment.SERVER_API_URL + '/tags/' + dummyTags[0]?.toString() + "/organization/" + dummyOrgs[0]?._id.toString());
        expect(req.request.url).toBe(environment.SERVER_API_URL + '/tags/' + dummyTags[0]?.toString() + "/organization/" + dummyOrgs[0]?._id.toString());
        expect(req.request.method).toBe("DELETE");
        req.flush(dummyTags);
    });
})
