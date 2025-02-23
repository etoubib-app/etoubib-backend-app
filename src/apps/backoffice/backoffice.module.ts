import { Module } from '@nestjs/common';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { Router } from 'express';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [ClinicsModule],
})
export class BackofficeModule {}
