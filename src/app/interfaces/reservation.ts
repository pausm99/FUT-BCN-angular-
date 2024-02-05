export interface Reservation {
  id?: number;
  type?: string;
  user_id: number;
  field_id: number;
  date_time_start: Date;
  date_time_end: Date;
  amount: number;
  paid: boolean;
  date_time_reservation?: Date;
}
