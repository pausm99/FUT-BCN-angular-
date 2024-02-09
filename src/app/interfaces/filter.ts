export interface Filter {
  name: string;
  FutSala: boolean;
  Fut5: boolean;
  Fut7: boolean;
  Fut11: boolean;
  property: {
    private: boolean;
    public: boolean;
  };
  opening_time: string;
  closing_time: string;
}
