import { Pipe, PipeTransform } from '@angular/core';
import { Guest } from './models';

@Pipe({
  name: 'myfilter',
  pure: false,
})
export class MyFilterPipe implements PipeTransform {
  transform(items: Guest[], filter: string): any {
    let filterToUse = filter.toLocaleLowerCase();
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter((item) =>
      item.name.toLocaleLowerCase().includes(filterToUse)
    );
  }
}
