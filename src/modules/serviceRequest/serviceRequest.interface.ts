export interface ICreateServiceRequest {
  categoryId: string;
  requestedServiceName: string;
  description?: string;
}

export interface IRejectServiceRequest {
  adminFeedback: string;
}