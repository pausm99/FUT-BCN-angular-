export interface Field {
  id?: number
  company_id: number;
  name: string;
  type: string;
  location_lat: number;
  location_lng: number;
  address : string;
  public : boolean;
  width : number;
  length : number;
  opening_time : string;
  closing_time : string;
}
