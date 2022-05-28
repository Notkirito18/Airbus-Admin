export class Guest {
  constructor(
    public _id: string,
    public name: string,
    public roomNumber: number,
    public type: string,
    public validUntill: Date,
    public vouchersLis: Voucher[],
    public createdDate?: Date
  ) {}
}
export interface GuestAddObject {
  name: string;
  roomNumber: number;
  type: string;
  validUntill: Date;
  vouchersLis: { validUntill: Date }[];
}
export class Voucher {
  constructor(
    public _id: string,
    public holderId: string,
    public validUntill: Date,
    public createdDate?: Date,
    public unvalid?: boolean
  ) {}
}
export class User {
  constructor(
    public email: string,
    public _id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private admin: boolean,
    private userDataId: string
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
    public _id: string,
    public date: Date,
    public type: string,
    public guestId: string,
    public guestName: string,
    public userDataId: string,
    public voucherId?: string
  ) {}
}
export interface RecordAddObject {
  date: Date;
  type: string;
  guestId: string;
  guestName: string;
  userDataId: string;
  voucherId?: string;
}
