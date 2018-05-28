import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CitiesService {

  constructor(private _http: HttpClient) { }


  getCitiesByName(name: string): Observable<Object> {
    return this._http.jsonp(`https://www.israelpost.co.il/zip_data.nsf/CreateLocationsforAutocomplete?OpenAgent&StartsWith=${name}`,
      `callback=jsonp1374348764727`)
      .map(res => res, err => Observable.throw(err.json()));
  }

  // getCitiesByName(name: string): Observable<Object> {
  //   return this._http.get(
  //     `https://data.gov.il/api/3/action/datastore_search?plain=false&resource_id=d4901968-dad3-4845-a9b0-a57d027f11ab&offset=0&q={"שם_ישוב":"${name}"}`,
  //     {
  //       observe: 'body',
  //       withCredentials: true,
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json;charset=utf-8'
  //       })
  //     }).map(res => {
  //       console.log(res.toString());
  //       return res;
  //     }, err => Observable.throw(err.json()));
  // }
}
