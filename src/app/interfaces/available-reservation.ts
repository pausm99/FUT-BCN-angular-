export interface AvailableReservation {
  id?: number;
  type?: string;
  field_id: number;
  date_time_start: Date;
  date_time_end: Date;
  price: number;
}
