import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClientService } from './http-client.service';
import { Event } from '../models/event.model';

@Injectable()
export class EventService {
  public dataFound: any;
  constructor(private httpClient: HttpClientService) {}
  loadEvent(programId: string, orgUnitId: string, startDate: string, endDate: string): Observable<Event> {
    this.dataFound = this.httpClient.get(
      `events.json?program=${programId}&startDate=${startDate}&endDate=${endDate}&orgUnit=${orgUnitId}&paging=false`
    );
    return this.dataFound;
  }
  loadedData(): Observable<any>{
    return this.dataFound;
  }
  updateEventDataElement(eventID: string, dataElementID: string, payload: any): Observable<any> {
   // console.log('here is update',payload,eventID,dataElementID);
    return this.httpClient.put(`events/${eventID}/${dataElementID}`, payload);
  }
  updateEvent(eventID: string, payload: any): Observable<any> {
   // console.log('here is update',payload,eventID, payload);
    return this.httpClient.put(`events/${eventID}`, payload);
  }
  deleteEvent(eventID: string): Observable<any> {
    return this.httpClient.delete(`events/${eventID}`);
  }
  createEvent(payload: any): Observable<any> {
    return this.httpClient.post(`events`, payload);
  }
  createOrUpdateEVentFromAttributes(isNewEvent: boolean, payload: any, eventID?: string) {
    if (isNewEvent) {
      return this.createEvent(payload);
    }
    return this.updateEvent(eventID, payload);
  }
  editing(name): Observable<any>{
    return name;
  }
 }
