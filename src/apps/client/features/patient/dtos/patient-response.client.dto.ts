import { BaseResponseDto } from '@lib/shared/base';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AddressResponseDto } from 'src/apps/client/modules/address/dtos';

export class PatientResponseDto extends BaseResponseDto {
    @ApiProperty({ example: 'John' })
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    lastName: string;

    @ApiProperty({ example: '0000' })
    phoneNumber: string;

    @ApiProperty({ example: '1234' })
    cin: string;

    @ApiProperty({ example: '2000-12-21' })
    birthDate: string;

    @ApiProperty({ example: "CR12345", nullable: true })
    cnss: string | null;

    @ApiProperty({ example: null, nullable: true })
    guardianFirstName: string | null;

    @ApiProperty({ example: null, nullable: true })
    guardianLastName: string | null;

    @ApiProperty({ example: null, nullable: true })
    guardianPhoneNumber: string | null;

    @ApiProperty({
        type: () => AddressResponseDto, nullable: true, example: {
            id: '9542089b-6e3f-41dd-b389-f7e110366dd4',
            address: '123 Main Street',
            postalCode: '20250',
            city: 'Casablanca',
            country: 'Morocco',
            createdAt: '2025-0&-01T12:00:00.216Z',
            updatedAt: '2025-0&-01T12:00:00.216Z'
        }
    })
    @Type(() => AddressResponseDto)
    address: AddressResponseDto | null;
}