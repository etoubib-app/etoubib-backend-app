import { Body, Get, Param, Patch, Post } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { BaseEntity } from './base.entity';
import { IBaseService } from './base.service.interface';

export abstract class BaseController<
  Entity extends BaseEntity,
  CreateBaseDto extends DeepPartial<Entity>,
  UpdateBaseDto extends DeepPartial<Entity>,
  BaseService extends IBaseService<Entity, CreateBaseDto, UpdateBaseDto>,
> {
  constructor(readonly baseService: BaseService) {}

  @Post()
  create(@Body() createBaseDto: CreateBaseDto) {
    return this.baseService.create(createBaseDto);
  }

  @Get()
  findAll() {
    return this.baseService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.baseService.getOne(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateBaseDto: UpdateBaseDto) {}
}
