import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject();
console.log('here is sub', subject)
export const payloadService = {
passpayload: payload => subject.next({ payload }),
getpayload: () => subject.asObservable()
};