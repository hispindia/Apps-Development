import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/apiService'
const subject = new BehaviorSubject();
export const payloadService = {
passpayload: payload => subject.next({ payload }),
getpayload: () => subject.asObservable()
};
