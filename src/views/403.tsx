import {Button, Result} from 'antd'
import {useNavigate} from 'react-router-dom'
import AppText from '@/i18n'

function Error403() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/welcome')
  }
  return (
    <Result
      status={403}
      title={AppText.error403.title}
      extra={
        <Button type="primary" onClick={handleClick}>
          {AppText.backToHome}
        </Button>
      }
      subTitle={AppText.error403.subTitle}
    />
  )
}

export default Error403
