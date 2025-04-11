import { Clinic } from '../entities/backoffice';

export function generate_id(name: string, date: Date): string {
  const sanitizedName = name.toLowerCase().replace(/\s+/g, '');
  const timestamp = date.getTime();
  return `${sanitizedName}${timestamp}`;
}

// generate a function accept argument Clinic and return a Repository<Clinic>
export function generate_clinic_tenant_id(clinic: Clinic): void {
  // Check if the name has spaces and and all characters with lowerCase replace them with a dash
  clinic.name = clinic.name.replace(/\s/g, '-').toLowerCase();
  // Generate the tenantId using the clinic's name and the database-created timestamp
  clinic.tenantId = generate_id(clinic.name, new Date(clinic.createdAt));

  console.log('Generated tenantId:', clinic.tenantId);
}
