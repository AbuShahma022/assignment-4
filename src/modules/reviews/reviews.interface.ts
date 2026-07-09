export interface ICreateReview {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface IUpdateReview
  extends Partial<Omit<ICreateReview, "bookingId">> {}