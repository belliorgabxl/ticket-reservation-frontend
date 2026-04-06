export type SeatStatus = "AVAILABLE" | "BOOKED" | "HELD";

export type SeatItem = {
  seatId: string;
  showTimeID: string;
  zoneId: string;
  seatCode: string;
  rowLable: string;
  seatNumber: string;
  price: number;
  status: SeatStatus;
  holdExpiresIn?: number;
};
