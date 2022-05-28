import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Record, RecordAddObject } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  constructor(private http: HttpClient) {}

  getAllRecords(token: string, userDataId: string): Observable<Record[]> {
    return this.http
      .get<{ records: Record[] }>('api/records', {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        map((responseGuests) => {
          return responseGuests.records;
        })
      );
  }

  addRecord(
    recordToAdd: RecordAddObject,
    token: string,
    userDataId: string
  ): Observable<Record> {
    return this.http
      .post<{ record: Record }>('api/records', recordToAdd, {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        map((responseGuests) => {
          return responseGuests.record;
        })
      );
  }

  updateRecord(
    id: string,
    updatedRecord: Record,
    token: string,
    userDataId: string
  ): Observable<Record> {
    return this.http
      .patch<{ record: Record }>('api/records/' + id, updatedRecord, {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      })
      .pipe(
        map((responseGuests) => {
          return responseGuests.record;
        })
      );
  }

  removeRecord(id: string, token: string, userDataId: string) {
    return this.http.delete('api/records/' + id, {
      headers: {
        key: environment.serverKey,
        authToken: token,
        userDataId: userDataId,
      },
    });
  }

  removeManyRecords(
    ids: string[],
    token: string,
    userDataId: string
  ): Observable<any> {
    return this.http.post(
      'api/records/deleteMany',
      { ids },
      {
        headers: {
          key: environment.serverKey,
          authToken: token,
          userDataId: userDataId,
        },
      }
    );
  }
}
