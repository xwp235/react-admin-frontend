import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'
import AppText from '@/i18n'

function Error404() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/welcome')
  }
  return (
    <Result
      status={404}
      title={AppText.error404.title}
      extra={
        <Button type="primary" onClick={handleClick}>
          {AppText.backToHome}
        </Button>
      }
      subTitle={
        <>
          <span>{AppText.error404.title}</span>
          <br/>
          <span>{AppText.error404.subTitle}</span>
        </>
      }
    />
  )
}

export default Error404
