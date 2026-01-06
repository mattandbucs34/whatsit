import ApplicationPolicy from "./application.js";

export default class FavoritePolicy extends ApplicationPolicy {
  destroy() {
    return this._isOwner();
  }
}