import ApplicationPolicy from "./application";

export default class FavoritePolicy extends ApplicationPolicy {
  destroy() {
    return this._isOwner();
  }
}