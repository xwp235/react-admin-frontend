import {Result} from 'antd'
import {useRouteError} from 'react-router-dom'
import AppText from '@/i18n'

function Error500() {

  const routeError = useRouteError() as string

  return (
    <Result
      status={500}
      title={AppText.error500.title}
      subTitle={
        <>
          <span>{routeError}</span>
        </>
      }
    />
  )
}

export default Error500
