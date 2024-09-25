import { forEachVaue } from '../util'

export default class Module {
  constructor(module) {
    this._raw = module
    this._children = {}
    this.state = module.state
  }
  get namespaced() {
    return !!this._raw.namespaced
  }
  addChild(key, module) {
    this._children[key] = module
  }
  getChild(key) {
    return this._children[key]
  }
  forEachMutation(cb) {
    if (this._raw.mutations) {
      forEachVaue(this._raw.mutations, cb)
    }
  }
  forEachAction(cb) {
    if (this._raw.actions) {
      forEachVaue(this._raw.actions, cb)
    }
  }
  forEachGetter(cb) {
    if (this._raw.getters) {
      forEachVaue(this._raw.getters, cb)
    }
  }
  forEachModule(cb) {
    //这里循环模块，应该循环包装后的，这样拿到的是带有模块方法的对象
    forEachVaue(this._children, cb)
  }
}
