export interface ICreateTechnicianProfile {
  bio?: string;
  experienceYears?: number;

  location: {
    country: string;
    division: string;
    district: string;
    area: string;
    postalCode?: string;
  };
}

export interface IUpdateTechnicianProfile
  extends Partial<ICreateTechnicianProfile> {}

  export interface IGetAllTechniciansQuery {
  search?: string;
  district?: string;
  minRating?: string;
  minPrice?: string;
  maxPrice?: string;
}