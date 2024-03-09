export interface Event {
  id?: number;
  name: string;
  reservation_id: number;
  field_id: number;
  user_id: number;
  date_time_start: Date;
  date_time_end: Date;
  incomplete: boolean;
  max_players?: number;
  field_name?: string;
  address?: string;
  user_name?: string;
  field_type?: string;
}
