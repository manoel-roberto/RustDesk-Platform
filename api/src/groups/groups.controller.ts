import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Post()
  create(@Body() createGroupDto: { name: string; description?: string }) {
    return this.groupsService.create(createGroupDto);
  }
}
