export class Guest {
  constructor(
    public id: string,
    public name: string,
    public roomNumber: number,
    public type: string,
    public vouchers: number,
    public vouchersValidUntill: String
  ) {}
}
