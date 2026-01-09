import { pull } from "./Fetch";
import BaseApiClass from "./BaseApiClass";

export default class DataApiClass extends BaseApiClass {
  constructor(...agrs) {
    super(...agrs);
    this.this = this;
  }

  getTrackedEntityInstanceList = (orgUnit, lastName, clientCode) =>
    pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/sqlViews/bGUwuWtZsfR/data.json`,
       { paging: false },
      [`var=orgunit:${orgUnit}`, `var=clientCode:${clientCode}`, `var=lastName:${lastName}`],
    );
}
