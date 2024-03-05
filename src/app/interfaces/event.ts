export interface Event {
  id?: number;
  reservation_id: number;
  field_id: number;
  user_id: number;
  date_time_start: Date;
  date_time_end: Date;
  incomplete: boolean;
}
