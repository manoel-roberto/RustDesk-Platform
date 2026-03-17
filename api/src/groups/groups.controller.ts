import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Grupos')
@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('tree')
  findTree() {
    return this.groupsService.findTree();
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  create(@Body() createGroupDto: { name: string; description?: string; parent_id?: string }) {
    return this.groupsService.create(createGroupDto);
  }
}
