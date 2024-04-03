import ReactDOM from 'react-dom/client'
import Loading from './Loading'

let count = 0

const element = document.createElement('div')
element.classList.add('app-loading')
const loading = ReactDOM.createRoot(element)

export const showLoading = () => {
  if (count === 0) {
    loading.render(<Loading/>)
    if (!element.parentNode) {
      document.body.appendChild(element)
    }
  }
  count++
}

export const hideLoading = () => {
  count--
  if (count === 0) {
    document.body.removeChild(element)
  }
}
