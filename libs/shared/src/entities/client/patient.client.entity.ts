import { BaseEntity } from '@lib/shared/base';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { FormAnswerEntity } from './form-answer.client.entity';
import { AddressEntity } from './address.client.entity';

@Entity({ name: 'patients' })
export class PatientEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 100, name: 'first_name' })
    firstName: string;

    @Column({ type: 'varchar', length: 100, name: 'last_name' })
    lastName: string;

    @Column({ type: 'varchar', length: 20, name: 'phone_number' })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    cin: string;

    @Column({ name: 'birth_date', type: 'date' })
    birthDate: Date;

    @Column({ type: 'varchar', length: 100, name: 'guardian_first_name', nullable: true })
    guardianFirstName?: string;

    @Column({ type: 'varchar', length: 100, name: 'guardian_last_name', nullable: true })
    guardianLastName?: string;

    @Column({ type: 'varchar', length: 20, name: 'guardian_phone_number', nullable: true })
    guardianPhoneNumber?: string;

    @Column({ type: 'varchar', length: 30, nullable: true })
    cnss?: string; // TODO: should be unique

    @ManyToOne(() => AddressEntity, { onDelete: 'SET NULL', eager: true, nullable: true })
    address?: AddressEntity;

    @ManyToOne(() => PatientEntity, patient => patient.members, { onDelete: 'SET NULL', nullable: true })
    guardian?: PatientEntity;

    @OneToMany(() => PatientEntity, patient => patient.guardian)
    members: PatientEntity[];

    @OneToMany(() => FormAnswerEntity, answer => answer.patient)
    answers: FormAnswerEntity[];

    get isMinor(): boolean {
        if (!this.birthDate) throw Error("birth date must be provided.")
        const age = new Date().getFullYear() - this.birthDate.getFullYear();
        return age < 18;
    }

    constructor(data: Partial<PatientEntity> = {}) {
        super();
        Object.assign(this, data);
    }
}






