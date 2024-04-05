import {App as AntdApp, ConfigProvider} from 'antd'
import {RouterProvider} from 'react-router-dom'
import styles from './App.module.scss'
import AntdGlobal from './utils/AntdGlobal'
import router from './router'

function App() {

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            horizontalItemSelectedBg: styles.menuBgColor,
            popupBg: styles.menuPopupBgColor,
            itemBg: styles.menuBgColor,
            itemColor: styles.menuColor,
            itemMarginInline: 0,
            itemMarginBlock: 0,
            itemHoverColor: styles.menuItemHoverColor,
            itemActiveBg: styles.menuItemActiveBgColor,
            itemBorderRadius: 0,
            itemSelectedBg: styles.menuItemSelectedBgColor,
            itemSelectedColor: styles.menuItemSelectedColor,
            subMenuItemBg: styles.menuBgColor,
            subMenuItemBorderRadius: 0,
            activeBarBorderWidth: 0,
          }
        },
        token: {
          colorPrimary: styles.mainColor,
          colorBgElevated: styles.elevatedBgColor,
          colorBgSpotlight: styles.spotlightBgColor
        }
        // algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <AntdApp>
        <AntdGlobal/>
        <RouterProvider router={router}/>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
