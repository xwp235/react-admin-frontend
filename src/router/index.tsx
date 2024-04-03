import {createBrowserRouter} from 'react-router-dom'

export const router = [
  {
    path: '/',
    element: <div>Hello</div>
  }]

const browserRouter = createBrowserRouter(router)
export default browserRouter
