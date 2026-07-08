export interface ICreateBooking {
  technicianServiceId: string;
  availabilityId: string;
  scheduledAt: Date;
  address: string;
  problemDescription?: string;
}