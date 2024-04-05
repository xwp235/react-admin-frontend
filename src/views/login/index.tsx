import {Button, Form, Input} from 'antd'
import styles from './index.module.scss'
import AppText from '@/i18n'
import {useState} from 'react'
import {LoginParams} from '@/types/Auth'
import AuthApi from '@/api/AuthApi'
import {message} from '@/utils/AntdGlobal'
import storage from 'good-storage'
import {LOGIN_KEEP_STATUS} from '@/config/constants'
import {Navigate} from 'react-router-dom'

export default function Login() {

  const [loading, setLoading] = useState(false)
  const loginKeepStatus = storage.get(LOGIN_KEEP_STATUS, false)

  const handleLogin = (loginParams: LoginParams) => {
    setLoading(true)
    AuthApi.login(loginParams).then(() => {
      message.success(
        <>
          <span>{AppText.loginPage.loginSuccessTip}</span>
          <br/>
          <span>{AppText.loginPage.loginSuccessSubTip}</span>
        </>
        , 1, () => {
          const params = new URLSearchParams(location.search)
          setLoading(false)
          storage.set(LOGIN_KEEP_STATUS, true)
          // 登录过期时重新登录后使用callback参数回到原先所在的页面
          location.href = params.get('callback') || '/welcome'
        })
    })
  }

  return <>
    {
      loginKeepStatus ? <Navigate replace to="/"/> : (<div className={styles.login}>
        <div className={styles.loginWrapper}>
          <h1 className={styles.title}>
            <span>{AppText.loginPage.loginFormTitle}</span>
            <span className={styles.subTitle}>{AppText.loginPage.loginFormSubTitle}</span>
          </h1>
          <Form name="basic" onFinish={handleLogin} autoComplete="off">
            <Form.Item
              name="username"
              rules={[{required: true, message: AppText.validation.usernameBlank}]}
              initialValue="admin"
            >
              <Input/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{required: true, message: AppText.validation.passwordBlank}]}
              initialValue="123456"
            >
              <Input.Password/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" block htmlType="submit" loading={loading}>
                {AppText.loginPage.loginBtn}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>)
    }
  </>
}
