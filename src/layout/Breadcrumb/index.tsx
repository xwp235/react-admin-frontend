import {MenuItem} from '@/types/Menu'
import {useLocation, useRouteLoaderData} from 'react-router-dom'
import {ReactNode, useEffect, useState} from 'react'
import {IAuthLoader} from '@/router/AuthLoader'
import {Breadcrumb} from 'antd'

/**
 * 递归查找树的路径
 */
const findTreeNode = (tree: MenuItem[], pathname: string, path: string[]): string[] => {
  if (!tree) {
    return []
  }
  for (const data of tree) {
    path.push(data.menuName)
    if (data.path === pathname) {
      return path
    }
    if (data.children?.length) {
      const list = findTreeNode(data.children, pathname, path)
      if (list?.length) {
        return list
      }
    }
    path.pop()
  }
  return []
}

export default function BreadcrumbFC() {
  const {pathname} = useLocation()
  const [breadList, setBreadList] = useState<(string | ReactNode)[]>([])
  // 权限判断
  const data = useRouteLoaderData('layout') as IAuthLoader

  useEffect(() => {
    const list = findTreeNode(data.menuList, pathname, [])
    setBreadList([<a href="/welcome">首页</a>, ...list])
  }, [pathname, data.menuList])
  return <Breadcrumb items={breadList.map(item => ({title: item}))} style={{marginLeft: 10}}/>
}
