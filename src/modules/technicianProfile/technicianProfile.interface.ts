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