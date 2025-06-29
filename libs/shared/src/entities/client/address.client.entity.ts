import { BaseEntity } from '@lib/shared/base';
import { Column, Entity } from 'typeorm';

@Entity('addresses')
export class AddressEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 200 })
    address: string;

    @Column({ type: 'varchar', length: 20 })
    postalCode?: string;

    @Column({ type: 'varchar', length: 100 })
    city?: string;

    @Column({ type: 'varchar', length: 100 })
    country?: string;

    constructor(data: Partial<AddressEntity> = {}) {
        super();
        Object.assign(this, data);
    }
}