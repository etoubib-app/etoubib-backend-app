import { ApiResponseWithData, ClientController, FormEntity } from '@lib/shared';
import { Body, Delete, Get, HttpCode, HttpStatus, Injectable, Param, ParseUUIDPipe, Patch, Post, Query, Scope, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IBaseCRUDController } from '@lib/shared/base/base-controller.interface';
import { PaginationQueryDto } from '@lib/shared/dto';
import { FormApiService } from '../services/form-api.client.service';
import { AddQuestionToFormDto, CreateFormDto, FormResponseDto, QuestionResponseDto, UpdateFormDto } from '../dtos';
import { QuestionApiService } from '../services/question-api.client.service';
import { ClientJwtAuthGuard } from '@lib/shared/modules/jwt-auth';

@ApiTags('Forms')
@UseGuards(ClientJwtAuthGuard)
@Injectable({ scope: Scope.REQUEST })
@ClientController('forms')
export class FormController implements IBaseCRUDController<FormEntity, CreateFormDto, UpdateFormDto> {
  constructor(
    protected readonly formApiService: FormApiService,
    protected readonly questionApiService: QuestionApiService
  ) { }

  /* Forms management */
  @Get()
  @ApiOperation({ description: 'Get all forms' })
  @ApiResponseWithData(FormResponseDto, { isArray: true })
  findAll(@Query() query: PaginationQueryDto) {
    return this.formApiService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get form by id' })
  @ApiResponseWithData(FormResponseDto)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.formApiService.findOne(id);
  }

  @Post()
  @ApiOperation({ description: 'Create new form' })
  @ApiResponseWithData(FormResponseDto, { status: HttpStatus.CREATED })
  create(@Body() dto: CreateFormDto) {
    return this.formApiService.createFormWithQuestions(dto);
  }

  @Patch(':id')
  @ApiResponseWithData(FormResponseDto)
  @ApiOperation({ description: 'Update form' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFormDto) {
    return this.formApiService.update(id, dto); // TODO: Add questions bulk updates functionality
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete form' })
  async softDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.formApiService.remove(id)
  }

  @Post('restore/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithData(FormResponseDto)
  @ApiOperation({ description: 'Restore deleted form' })
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.formApiService.restore(id)
  }

  /* Questions management */
  @Post("/questions")
  @ApiOperation({ description: 'Add new question to a form' })
  @ApiResponseWithData(QuestionResponseDto, { status: HttpStatus.CREATED })
  createQuestion(@Body() dto: AddQuestionToFormDto) {
    return this.questionApiService.addQuestionToForm(dto);
  }

  @Patch('/questions/:id')
  @ApiResponseWithData(FormResponseDto)
  @ApiOperation({ description: 'Update question form' })
  updateQuestion(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AddQuestionToFormDto) {
    return this.questionApiService.updateQuestion(id, dto);
  }

  @Delete('/questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete question form' })
  async deleteQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionApiService.deleteQuestion(id)
  }
}
