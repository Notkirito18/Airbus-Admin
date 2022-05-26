import { Pipe, PipeTransform } from '@angular/core';
import { Guest, Record } from './models';

@Pipe({
  name: 'filterRecords',
  pure: false,
})
export class filterRecordsPipe implements PipeTransform {
  transform(items: Record[], filter: string, guest?: Guest): any {
    if (!items || !filter) {
      return items;
    }
    if (filter === 'guest') {
      let filtered = items.filter((item) => {
        item.type === 'voucher_use';
      });
      //TODO fix this
      // filtered = items.filter((item) => {
      //   item.Voucher?.holderId === guest?._id;
      // });
      return filtered;
    }
    if (filter === 'vender') {
      return items.filter((item) => {
        item.type === 'voucher_use';
      });
    }
    if (filter === 'admin') {
      return items;
    }
  }
}
