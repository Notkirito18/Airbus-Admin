import { Pipe, PipeTransform } from '@angular/core';
import { Record } from './models';

@Pipe({
  name: 'sortRecords',
  pure: false,
})
export class sortRecordsPipe implements PipeTransform {
  transform(items: Record[], sortBy: string): any {
    if (!items || !sortBy) {
      return items;
    }
    if (sortBy === 'newest') {
      return items.sort((item1, item2) => {
        return item1.date > item2.date ? -1 : item1.date < item2.date ? 1 : 0;
      });
    }
    if (sortBy === 'oldest') {
      return items.sort((item1, item2) => {
        return item1.date > item2.date ? 1 : item1.date < item2.date ? -1 : 0;
      });
    }

    // filter items array, items which match and return true will be
    // kept, false will be filtered out
  }
}
