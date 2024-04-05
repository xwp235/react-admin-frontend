import React from 'react'
import {createBrowserRouter, Navigate} from 'react-router-dom'
import AuthLoader from '@/router/AuthLoader'
import Layout from '@/layout'
import Welcome from '@/views/welcome'
import Error403 from '@/views/403'
import Error404 from '@/views/404'
import Error500 from '@/views/500'
import Login from '@/views/login'
import LazyLoad from './LazyLoad'

export const router = [
  {
    path: '/',
    element: <Navigate to="/welcome"/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    id: 'layout',
    element: <Layout/>,
    loader: AuthLoader,
    errorElement: <Error500/>,
    children: [
      {
        path: '/welcome',
        element: <Welcome/>
      },
      {
        path: '/dashboard',
        element: LazyLoad(React.lazy(() => import('@/views/dashboard')))
      },
      // 用户管理
      {
        path: '/user-manage',
        element: LazyLoad(React.lazy(() => import('@/views/system/user-manage')))
      },
      // 菜单管理
      {
        path: '/menu-manage',
        element: LazyLoad(React.lazy(() => import('@/views/system/menu-manage')))
      },
      // 角色管理
      {
        path: '/role-manage',
        element: LazyLoad(React.lazy(() => import('@/views/system/role-manage')))
      },
      // 日志管理
      {
        path: '/log-manage',
        element: LazyLoad(React.lazy(() => import('@/views/system/log-manage')))
      },
      // 部门管理
      {
        path: '/dept-manage',
        element: LazyLoad(React.lazy(() => import('@/views/dept-manage')))
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/404"/>
  },
  {
    path: '/404',
    element: <Error404/>
  },
  {
    path: '/403',
    element: <Error403/>
  }
]

const browserRouter = createBrowserRouter(router)
export default browserRouter
