export class Guest {
  constructor(
    public id: string,
    public name: string,
    public roomNumber: number,
    public type: string,
    // public vouchers: number,
    public validUntill: Date,
    public vouchersLis: Voucher[],
    public createdDate?: Date
  ) {}
}
export class Voucher {
  constructor(
    public id: string,
    public holderId: string,
    public validUntill: Date,
    public createdDate?: Date
  ) {}
}
export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    } else {
      return this._token;
    }
  }
}
