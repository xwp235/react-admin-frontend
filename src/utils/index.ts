// 获取页面路径
import {MenuItem} from '@/types/Menu'

// 递归获取路由对象
export const searchRoute: any = (path: string, routes: MenuItem[] = []) => {
  for (const item of routes) {
    if (item.path === path) {
      return item
    }
    if (item.children) {
      const result = searchRoute(path, item.children)
      if (result) {
        return result
      }
    }
  }
  return null
}
