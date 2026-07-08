export interface ICreateBooking {
  technicianServiceId: string;
  availabilityId: string;
  address: string;
  problemDescription?: string;
}