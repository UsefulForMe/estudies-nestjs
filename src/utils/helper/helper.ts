import { toUpper } from 'lodash';

class HelperUtil {
  static getSymbolOfText(str: string): string {
    return toUpper(str)
      .split(' ')
      .map(function (item) {
        return item[0];
      })
      .join('');
  }

  static randomNumberWithLength(length: number): number {
    return Math.floor(Math.random() * 10 ** length);
  }
}

export default HelperUtil;
