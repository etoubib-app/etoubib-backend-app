import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClinicEvents } from './clinic-events';

@Injectable()
export class ClinicEvent {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  emitClinicCreationUpdate(clinicId: string): void {
    this.eventEmitter.emit(ClinicEvents.ClinicCreationUpdated, {
      clinicId,
    });
  }

  emitMigrationStarted(clinicId: string): void {
    this.eventEmitter.emit(ClinicEvents.MigrationStarted, {
      clinicId,
    });
  }

  emitMigrationSuccess(clinicId: string): void {
    this.eventEmitter.emit(ClinicEvents.MigrationSuccess, {
      clinicId,
    });
  }

  emitMigrationFailed(clinicId: string): void {
    this.eventEmitter.emit(ClinicEvents.MigrationFailed, {
      clinicId,
    });
  }
}
