import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function responsiveWidth(
  screenSize: string,
  xs: number,
  sm: number,
  md: number,
  lg: number
) {
  switch (screenSize) {
    case 'xs':
      return {
        'width.px': xs,
      };
      break;
    case 'sm':
      return {
        'width.px': sm,
      };
      break;
    case 'md':
      return {
        'width.px': md,
      };
      break;
    default:
      return {
        'width.px': lg,
      };
  }
}
export function responsiveContainerPaddingPx(
  screenSize: string,
  xs: number,
  sm: number,
  md: number,
  lg: number
) {
  switch (screenSize) {
    case 'xs':
      return {
        'padding.px': xs,
        'paddingTop.px': 70,
      };
      break;
    case 'sm':
      return {
        'padding.px': sm,
        'paddingTop.px': 70,
      };
      break;
    case 'md':
      return {
        'padding.px': md,
        'paddingTop.px': 80,
      };
      break;
    default:
      return {
        'padding.px': lg,
        'paddingTop.px': 80,
      };
  }
}

export function hideElementResponsivly(
  screenSize: string,
  xs: boolean,
  sm: boolean,
  md: boolean,
  lg: boolean
) {
  switch (screenSize) {
    case 'xs':
      return {
        display: xs ? 'block' : 'none',
      };
      break;
    case 'sm':
      return {
        display: sm ? 'block' : 'none',
      };
      break;
    case 'md':
      return {
        display: md ? 'block' : 'none',
      };
      break;
    default:
      return {
        display: lg ? 'block' : 'none',
      };
  }
}

export function displayFlexOrBlock(
  screenSize: string,
  xs: boolean,
  sm: boolean,
  md: boolean,
  lg: boolean
) {
  switch (screenSize) {
    case 'xs':
      return {
        display: xs ? 'block' : 'flex',
      };
      break;
    case 'sm':
      return {
        display: sm ? 'block' : 'flex',
      };
      break;
    case 'md':
      return {
        display: md ? 'block' : 'flex',
      };
      break;
    default:
      return {
        display: lg ? 'block' : 'flex',
      };
  }
}
export function dateShower(date: Date): string {
  let dateString =
    date.getFullYear().toString() +
    '-' +
    date.getMonth().toString() +
    '-' +
    date.getDate().toString();
  return dateString;
}
