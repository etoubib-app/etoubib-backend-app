import { ApiResponseWithData, ClientController } from '@lib/shared';
import { Body, Delete, Get, HttpCode, HttpStatus, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Scope, UseGuards } from '@nestjs/common';

import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientJwtAuthGuard } from '../auth/guards/jwt-auth.client.guard';
import { PatientEntity } from '@lib/shared/entities/client/patient.client.entity';
import { PatientsApiService } from './services/patients-api.client.service';
import { IBaseController } from '@lib/shared/base/base-controller.interface';
import { CreatePatientDto, UpdatePatientDto } from './dtos';
import { PaginationQueryDto } from '@lib/shared/dto';
import { PatientResponseDto } from './dtos/patient-response.client.dto';

@ApiTags('Patients')
@UseGuards(ClientJwtAuthGuard)
@Injectable({ scope: Scope.REQUEST })
@ClientController('patients')
export class PatientsController implements IBaseController<PatientEntity, CreatePatientDto, UpdatePatientDto> {
  constructor(protected readonly patientsApiService: PatientsApiService) { }

  @Get()
  @ApiOperation({ description: 'Get all patients' })
  @ApiResponseWithData(PatientResponseDto, { isArray: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.patientsApiService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get patient by id' })
  @ApiResponseWithData(PatientResponseDto)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsApiService.findOne(id);
  }

  @Post()
  @ApiOperation({ description: 'Create new patient' })
  @ApiResponseWithData(PatientResponseDto, { status: HttpStatus.CREATED })
  @ApiConflictResponse({ description: 'Patient already exists' })
  create(@Body() dto: CreatePatientDto) {
    return this.patientsApiService.create(dto);
  }

  @Patch(':id')
  @ApiResponseWithData(PatientResponseDto)
  @ApiOperation({ description: 'Update patient' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsApiService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete patient' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    this.patientsApiService.remove(id)
  }

  @Post('restore/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithData(PatientResponseDto)
  @ApiOperation({ description: 'Restore deleted patient' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsApiService.restore(id)
  }
}
