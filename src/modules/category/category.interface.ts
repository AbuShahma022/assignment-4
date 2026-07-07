export interface ICreateCategory {
  name: string;
  description?: string;
}

export interface IUpdateCategory
  extends Partial<ICreateCategory> {}