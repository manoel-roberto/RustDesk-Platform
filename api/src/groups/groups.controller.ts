import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Grupos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get('tree')
  @ApiOperation({ summary: 'Obter árvore de grupos', description: 'Retorna a estrutura hierárquica completa dos grupos de dispositivos.' })
  findTree() {
    return this.groupsService.findTree();
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os grupos' })
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter grupo por ID' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo grupo' })
  @ApiResponse({ status: 201, description: 'Grupo criado com sucesso.' })
  create(@Body() createGroupDto: { name: string; description?: string; parent_id?: string }) {
    return this.groupsService.create(createGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover grupo' })
  @ApiResponse({ status: 200, description: 'Grupo removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
