import { forEachVaue } from '../util';
import Module from './module';

export default class ModuleCollection {
  constructor(options) {
    this.root = null;
    this.register([], options)
  }

  getNamespace(path) {
    let module = this.root;
    //获取命名空间方法
    return path.reduce((str, key) => {
      module = module.getChild(key)
      return str + (module.namespaced ? `${key}/` : '')
    }, '')
  }
  register(path, rootModule) {
    let newModule = new Module(rootModule)
    rootModule.newModule = newModule;//将用户的属性和我包装后的关联在一起
    if (this.root == null) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((start, current) => {
        return start.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }
    if (rootModule.modules) {
      forEachVaue(rootModule.modules, (moduleName, moduleValue) => {
        this.register(path.concat(moduleName), moduleValue)
      })
    }
  }
}
