export interface Event {
  id?: number;
  name: string;
  reservation_id: number;
  field_id: number;
  user_id: number;
  date_time_start: Date;
  date_time_end: Date;
  incomplete: boolean;
  field_name?: string;
}
