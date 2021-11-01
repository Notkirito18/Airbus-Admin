import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(private http: HttpClient) {}

  recordsUrl =
    'https://airbus-900f9-default-rtdb.firebaseio.com/records.json?auth=';
}
