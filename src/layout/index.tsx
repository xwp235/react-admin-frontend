import {Layout, Menu, MenuProps} from 'antd'
import React, {useEffect, useRef, useState} from 'react'
import styles from './index.module.scss'
import {Navigate, Outlet, useLocation, useNavigate, useRouteLoaderData} from 'react-router-dom'
import {IAuthLoader} from '@/router/AuthLoader'
import {MenuItem as IMenuItem} from '@/types/Menu'
import * as Icons from '@ant-design/icons'
import AuthApi from '@/api/AuthApi'
import {router} from '@/router'
import {useSystemStore, useUserStore} from '@/store'
import AppText from '@/i18n'
import AppHeader from '@/layout/AppHeader'
import PageTabs from '@/layout/PageTabs'
import {searchRoute} from '@/utils'
import AppFooter from '@/layout/AppFooter'

const {Sider} = Layout

type MenuItem = Required<MenuProps>['items'][number]

// 生成每一个菜单项
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    label,
    key,
    icon,
    children
  } as MenuItem
}

function createIcon(name?: string) {
  if (!name) {
    return <></>
  }
  const customerIcons: { [key: string]: any } = Icons
  const icon = customerIcons[name]
  if (!icon) {
    return <></>
  }
  return React.createElement(icon)
}

const getTreeMenu = (menuList: IMenuItem[], treeList: MenuItem[] = []) => {
  menuList.forEach((item, index) => {
    if (!item.children) {
      // path为空时把索引当作key值
      return treeList.push(getItem(item.menuName, item.path || index, createIcon(item.icon)))
    }
    treeList.push(
      getItem(item.menuName, item.path || index, createIcon(item.icon), getTreeMenu(item.children || []))
    )
  })
  return treeList
}

const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const {userInfo, updateUserInfo} = useUserStore()
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const {collapsed} = useSystemStore(state => ({collapsed: state.collapsed}))

  const isMounted = useRef(false)
  const data = useRouteLoaderData('layout') as IAuthLoader

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      // 首次挂载时的逻辑
      if (data && data.menuList) {
        const list = getTreeMenu(data.menuList)
        setMenuList(list)
        AuthApi.getProfile().then(userInfo => {
          const storeUserInfo = Object.assign({}, userInfo)
          storeUserInfo.createTime = new Date(userInfo.createTime)
          storeUserInfo.dataValidPeriod.start = new Date(userInfo.dataValidPeriod.start)
          storeUserInfo.dataValidPeriod.end = new Date(userInfo.dataValidPeriod.end)
          updateUserInfo(storeUserInfo)
        })
        setSelectedKeys([pathname])
      }
    }
  }, [data, userInfo, updateUserInfo])

  // 菜单点击
  const handleClickMenu = ({key}: { key: string }) => {
    setSelectedKeys([key])
    navigate(key)
  }

  const route = searchRoute(pathname, router)
  if (route && route.meta?.auth === false) {
    // 继续执行
  } else {
    const staticPath = ['/welcome', '/403', '/404']
    if (data.menuPathList && !data.menuPathList.includes(pathname) && !staticPath.includes(pathname)) {
      return <Navigate to="/403"/>
    }
  }

  const backToWelcome = () => {
    setSelectedKeys([])
    navigate('/welcome')
  }
  return (
    <>
      {userInfo.username ?
        (
          <Layout>
            <Sider collapsed={collapsed}>
              <nav className={styles.mainNav}>
                <div className="logo" onClick={backToWelcome}>
                  <img src="/logo.png" className="logo-image" alt="logo"/>
                  {collapsed ? '' : <span className="logo-text">{AppText.logoText}</span>}
                </div>
                <Menu
                  mode="inline"
                  defaultOpenKeys={['1']}
                  style={{
                    width: collapsed ? 80 : 'auto',
                    height: 'calc(100vh - 50px)'
                  }}
                  selectedKeys={selectedKeys}
                  onClick={handleClickMenu}
                  items={menuList}
                />
              </nav>
            </Sider>
            <Layout>
              <AppHeader/>
              <PageTabs/>
              <div className={styles.content}>
                <div className={styles.wrapper}>
                  <Outlet/>
                </div>
                <AppFooter/>
              </div>
            </Layout>
          </Layout>
        ) : null
      }
    </>
  )
}

export default AppLayout
