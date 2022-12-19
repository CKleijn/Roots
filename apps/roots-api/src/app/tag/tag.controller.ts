import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Put } from '@nestjs/common';
import { Public } from '../auth/auth.module';
import { ParseObjectIdPipe } from '../shared/pipes/ParseObjectIdPipe';
import { TagDto } from './tag.dto';
import { Tag } from './tag.schema';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
    constructor(private readonly tagService: TagService) { }

    @Public()
    @Get('organizations/:organizationId')
    async getAllTagsByOrganization(@Param('organizationId', ParseObjectIdPipe) organizationId: string): Promise<Tag[]> {
        Logger.log('Retrieving all tags by organization (READ)');

        return await this.tagService.getAllByOrganization(organizationId);
    }

    @Public()
    @Get(':tagId')
    async getTagById(@Param('tagId', ParseObjectIdPipe) tagId: string): Promise<Tag> {
        try {
            Logger.log(`Retrieve tag with id: ${tagId} (READ)`);

            return await this.tagService.getById(tagId);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Public()
    @Post('new/organizations/:organizationId/events/:eventId')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async createTag(@Param('organizationId', ParseObjectIdPipe) organizationId: string,@Param('eventId', ParseObjectIdPipe) eventId: string, @Body() tagDto: TagDto): Promise<Object> {
        try {
            Logger.log(`Create tag (POST)`);

            const tag = await this.tagService.create(organizationId, eventId, tagDto);

            return {
                status: 201,
                message: 'De tag is succesvol aangemaakt!'
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
    }

    @Public()
    @Put(':tagId')
    // eslint-disable-next-line @typescript-eslint/ban-types
    async updateTag(@Param('tagId', ParseObjectIdPipe) tagId: string, @Body() tagDto: TagDto): Promise<Object> {
        try {
            Logger.log(`Update tag ${tagId} (PUT)`);

            const tag = await this.tagService.update(tagId, tagDto);

            return {
                status: 200,
                message: 'De tag is succesvol aangepast!'
            }
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_MODIFIED)
        }
    }
}