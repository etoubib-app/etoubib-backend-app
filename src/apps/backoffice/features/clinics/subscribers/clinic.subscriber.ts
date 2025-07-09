import { BoClinic, logcall } from '@lib/shared';
import { BACKOFFICE_CONNECTION } from '@lib/shared/modules';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

import { ClinicEvents } from '../events/clinic-events';

@Injectable()
@EventSubscriber()
export class BoClinicSubscriber implements EntitySubscriberInterface<BoClinic> {
  private readonly logger = new Logger(BoClinicSubscriber.name);

  constructor(
    @Inject(BACKOFFICE_CONNECTION)
    private readonly boDataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.boDataSource.subscribers.push(this);
  }

  listenTo(): typeof BoClinic {
    return BoClinic;
  }

  @logcall(true)
  afterUpdate(event: UpdateEvent<BoClinic>): void {
    this.logger.log(
      '[afterUpdate] +++++++++++++event.databaseEntity+++++++++++:',
    );
    this.logger.log(event.databaseEntity);
    this.logger.log('[afterUpdate] event.entity:');
    this.logger.log(event.entity);
    const afterUpdateEntity = event.entity as BoClinic;
    const updatedColumns = event.updatedColumns.map((uc) => uc.propertyName);
    this.logger.log(
      `[afterUpdate] updatedColumns: ${JSON.stringify(updatedColumns)}`,
    );
    const isUpdatedColumn = (s: string) => updatedColumns.indexOf(s) > -1;

    if (updatedColumns.length > 0) {
      if (isUpdatedColumn('stage')) {
        if (afterUpdateEntity.stage === 'ready_for_initialization') {
          this.eventEmitter.emit(ClinicEvents.ClinicInitializationStarted, {
            clinicId: afterUpdateEntity.id,
          });
        }
        if (afterUpdateEntity.stage === 'ready_for_setuping') {
          this.eventEmitter.emit(ClinicEvents.ClinicSetupingStarted, {
            clinicId: afterUpdateEntity.id,
          });
        }
        if (afterUpdateEntity.stage === 'ready_for_seeding') {
          this.eventEmitter.emit(ClinicEvents.ClinicSeedingStarted, {
            clinicId: afterUpdateEntity.id,
          });
        }
      }
    }
  }

  @logcall(true)
  afterInsert(event: InsertEvent<BoClinic>): Promise<any> | void {
    this.logger.log('[afterInsert] --------------event.entity--------------:');
    this.logger.log(event.entity);
    return Promise.resolve();
  }
}
