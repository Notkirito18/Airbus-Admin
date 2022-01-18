export class Guest {
  constructor(
    public id: string,
    public name: string,
    public roomNumber: number,
    public type: string,
    public validUntill: Date,
    public vouchersLis: Voucher[],
    public createdDate?: Date
  ) {}
}
// add pin code to the guest model (instruct of guarding in routing modules)

// rebrand the whole app to it's new name : VouchyQR
export class Voucher {
  constructor(
    public id: string,
    public holderId: string,
    public validUntill: Date,
    public createdDate?: Date,
    public unvalid?: boolean
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
export class Record {
  constructor(
    public date: Date,
    public type: string,
    public guest: Guest,
    public Voucher?: Voucher
  ) {}
}
