export interface ICreateService {
  categoryId: string;
  name: string;
  description?: string;
}

export interface IUpdateService
  extends Partial<ICreateService> {}