import BaseApiClass from "./BaseApiClass";
import { pull } from "./Fetch";
export default class MetadataApiClass extends BaseApiClass {
  getMe = () =>
    pull(this.baseUrl, this.username, this.password, "/api/me", { paging: false }, [
      "fields=id,name,organisationUnits[id,name]",
    ]);
}
