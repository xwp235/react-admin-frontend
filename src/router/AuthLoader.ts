import {MenuItem} from '@/types/Menu'
import AuthApi from '@/api/AuthApi'

export interface IAuthLoader {
  buttonList: string[]
  menuList: MenuItem[]
  menuPathList: string[]
}

const getMenuPath = (list: MenuItem[]): string[] => {
  return list.reduce((result: string[], item: MenuItem) => {
    return result.concat(item.children && item.children.length ? getMenuPath(item.children) : item.path + '')
  }, [])
}

export default async function AuthLoader() {
  const data = await AuthApi.getPermission()
  if (!data) {
    return {}
  }
  const menuPathList = getMenuPath(data.menuList)
  return {
    // 获取页面按钮权限
    buttonList: data.buttonList,
    // 渲染页面左侧主菜单
    menuList: data.menuList,
    menuPathList
  }
}
