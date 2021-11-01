import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Record } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(private http: HttpClient) {}

  recordsUrl =
    'https://airbus-900f9-default-rtdb.firebaseio.com/records.json?auth=';

  recordsArray = new Subject<Record[]>();
}
