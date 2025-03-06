import { Controller } from '@nestjs/common';

export const BackofficeController = (route: string) =>
  Controller(`backoffice/${route}`);

export const CoreController = (route: string) => Controller(`core/${route}`);
