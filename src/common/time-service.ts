import { UTCDate } from '@date-fns/utc';

export class TimeService {
  getNow() {
    return new UTCDate(); // ToDo: Use temporal JS new type
  }
}
