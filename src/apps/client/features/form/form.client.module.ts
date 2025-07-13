import { Module } from '@nestjs/common';
import { ClientDatabaseModule } from '@lib/shared/modules';

import { FormController } from './controllers/form.client.controller';
import { FormApiService } from './services/form-api.client.service';
import { QuestionApiService } from './services/question-api.client.service';
import { JWTAuthModule } from '@lib/shared/modules/jwt-auth';

@Module({
  imports: [ClientDatabaseModule, JWTAuthModule],
  controllers: [FormController],
  providers: [FormApiService, QuestionApiService],
  exports: [],
})
export class FormModule { }
