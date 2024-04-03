import {App as AntdApp, ConfigProvider} from 'antd'
import {RouterProvider} from 'react-router-dom'
import './App.scss'
import AntdGlobal from './utils/AntdGlobal'
import router from './router'
import {CSS_MAIN_BG} from './config/constants.ts'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: CSS_MAIN_BG
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
