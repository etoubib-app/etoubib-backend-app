import { BoClinic } from '../entities/backoffice';

function generateId(name: string, date: Date): string {
  const sanitizedName = name.toLowerCase().replace(/\s+/g, '');
  const timestamp = date.getTime();
  return `${sanitizedName}${timestamp}`;
}

// generate a function accept argument Clinic and return a Repository<Clinic>
export function generateClinicTenantId(clinic: BoClinic): void {
  clinic.name = clinic.name.replace(/\s/g, '-').toLowerCase();
  clinic.tenantId = generateId(clinic.name, new Date(clinic.createdAt));
}
