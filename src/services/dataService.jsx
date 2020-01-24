import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject();
console.log('here is sub', subject)
export const PlayloadService = {
passPlayload: playload => subject.next({ playload }),
getPlayload: () => subject.asObservable()
};