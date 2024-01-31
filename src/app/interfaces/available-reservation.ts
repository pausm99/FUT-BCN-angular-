export interface AvailableReservation {
  id?: number;
  field_id: number;
  date: string;
  date_time_start: Date;
  date_time_end: Date;
  price: number;
}
