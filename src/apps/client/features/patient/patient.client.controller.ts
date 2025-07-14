import {
  ApiResponseWithData,
  ClientController,
  PatientEntity,
} from '@lib/shared';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Scope,
  UseGuards,
} from '@nestjs/common';

import { ApiConflictResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientApiService } from './services/patient-api.client.service';
import { IBaseCRUDController } from '@lib/shared/base/base-controller.interface';
import { CreatePatientDto, PatientResponseDto, UpdatePatientDto } from './dtos';
import { PaginationQueryDto } from '@lib/shared/dto';
import { JwtAuthGuard } from '@lib/shared/modules/jwt-auth';
import { FillFormDto, FormAnswersResponseDto } from '../form/dtos';
import { PatientFormApiService } from './services/patient-form-api.client.service';

@ApiTags('Patients')
@UseGuards(JwtAuthGuard)
@Injectable({ scope: Scope.REQUEST })
@ClientController('patients')
export class PatientsController
  implements
    IBaseCRUDController<PatientEntity, CreatePatientDto, UpdatePatientDto>
{
  constructor(
    protected readonly patientApiService: PatientApiService,
    protected readonly patientFormApiService: PatientFormApiService,
  ) {}

  @Get()
  @ApiOperation({ description: 'Get all patients' })
  @ApiResponseWithData(PatientResponseDto, { isArray: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.patientApiService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get patient by id' })
  @ApiResponseWithData(PatientResponseDto)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientApiService.findOne(id);
  }

  @Post()
  @ApiOperation({ description: 'Create new patient' })
  @ApiResponseWithData(PatientResponseDto, { status: HttpStatus.CREATED })
  @ApiConflictResponse({ description: 'Patient already exists' })
  create(@Body() dto: CreatePatientDto) {
    return this.patientApiService.create(dto);
  }

  @Patch(':id')
  @ApiResponseWithData(PatientResponseDto)
  @ApiOperation({ description: 'Update patient' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientApiService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Soft delete patient' })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientApiService.remove(id);
  }

  @Post('restore/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithData(PatientResponseDto)
  @ApiOperation({ description: 'Restore deleted patient' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientApiService.restore(id);
  }

  // TODO: define swagger response DTO
  @Post(':patientId/forms/:formId/answers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Fill a form for a patient' })
  async fillPatientForm(
    @Body() dto: FillFormDto,
    @Param('formId', ParseUUIDPipe) formId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return await this.patientFormApiService.fillPatientForm(
      patientId,
      formId,
      dto,
    );
  }

  @Get(':patientId/forms/:formId/answers')
  @ApiResponseWithData(FormAnswersResponseDto)
  @ApiOperation({ description: 'Get patient form answers' })
  async getPatientFormAnswers(
    @Param('formId', ParseUUIDPipe) formId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return await this.patientFormApiService.getPatientFormAnswers(
      patientId,
      formId,
    );
  }
}
