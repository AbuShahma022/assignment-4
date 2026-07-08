export interface ICreateTechnicianService {
  serviceId: string;
  price: number;
  description?: string;
}

export interface IUpdateTechnicianService
  extends Partial<ICreateTechnicianService> {}