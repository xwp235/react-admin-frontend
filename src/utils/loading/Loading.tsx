import {Spin} from 'antd'
import './loading.scss'
import AppText from '@/i18n'

export default function Loading({tip = AppText.loading}: { tip?: string }) {
  return (
    <Spin tip={tip} size="large">
      <div className="app-loading-content"/>
    </Spin>
  )
}
