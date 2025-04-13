import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        default: 'now()',
        update: false,
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp with time zone',
        default: 'now()',
        onUpdate: 'now()',
        nullable: false,
    })
    updatedAt: Date;
}