export type ReservationItem = {
  id: string;
  reservationId: string;
  seatId: string;
  seatCode: string;
  zoneId: string;
  price: number;
  createdAt: string;
};

export type Reservation = {
  id: string;
  userId: string;
  showTimeId: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  items: ReservationItem[];
};       