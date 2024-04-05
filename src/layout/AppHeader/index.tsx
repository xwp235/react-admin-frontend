import {useEffect} from 'react'
import {Dropdown, MenuProps} from 'antd'
import AppText from '@/i18n'
import styles from './index.module.scss'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'
import {useSystemStore, useUserStore} from '@/store'
import storage from 'good-storage'
import {LOGIN_KEEP_STATUS} from '@/config/constants'
import AuthApi from '@/api/AuthApi'
import Breadcrumb from '@/layout/Breadcrumb'

export default function AppHeader() {
  const userInfo = useUserStore(state => state.userInfo)
  const {collapsed, updateCollapsed} = useSystemStore()

  useEffect(() => {
    // handleSwitch(isDark)
  }, [])

  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: `${AppText.fields.email}:${userInfo.username}`
    },
    {
      key: 'logout',
      label: AppText.logout
    }
  ]

  // 控制菜单图标关闭和展开
  const toggleCollapsed = () => updateCollapsed()

  const onDropdownClick: MenuProps['onClick'] = ({key}) => {
    if (key === 'logout') {
      storage.set(LOGIN_KEEP_STATUS, false)
      AuthApi.logout().then(() => location.href = '/login?callback=' + encodeURIComponent(location.href))
    }
  }

  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed} className={styles.toggleBtn}>
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{
                fontSize: 26
              }}
            />
          ) : (
            <MenuFoldOutlined
              style={{
                fontSize: 26
              }}
            />
          )}
        </div>
        <Breadcrumb/>
      </div>
      <div className={styles.right}>
        <Dropdown menu={{items, onClick: onDropdownClick}} trigger={['click']}>
          <span className={styles.nickname}>肖文彭</span>
        </Dropdown>
      </div>
    </div>
  )
}
