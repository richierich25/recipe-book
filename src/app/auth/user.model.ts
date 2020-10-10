export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string, // private inorder to ensure that while retrieving the token, we validate it
    private _tokenExpirationDate: Date
  ) {}

  //  setters wont work ie user.token = 'random'
  get token() {
    // if expirationDate does not exist or current date is after tokenExpirationDate
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
