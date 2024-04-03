import axios, {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import env from '@/config'
import qs from 'qs'
import axiosRetry from 'axios-retry'
import AppText from '@/i18n'
import {hideLoading, showLoading} from '@/utils/loading'
import {message} from './AntdGlobal'

interface HttpResponse<T = any> {
  code: number
  msg: string
  data: T
}

interface IConfig {
  showLoading?: boolean
  showError?: boolean
}

interface IInternalRequestConfig {
  showLoading?: boolean
  showError?: boolean
}

interface IAxiosResponse {
  config: InternalAxiosRequestConfig & IInternalRequestConfig
}

interface IParams {
  [key: string]: any
}

const instance = axios.create({
  timeout: 8000,
  timeoutErrorMessage: AppText.requestTimeout,
  withCredentials: true
})

axiosRetry(instance, {
  retries: 1
  // 重试条件
  // retryCondition: error => {
  //   return error.code === 'ECONNABORTED' // 仅这个错误下重试请求
  // }
})

// 请求拦截器
instance.interceptors.request.use(
  (config: IInternalRequestConfig & InternalAxiosRequestConfig) => {
    if (config.showLoading) {
      showLoading()
    }
    // const token = storage.get(TOKEN)
    // if (token) {
    //   config.headers.token = token
    // }
    if (env.mock) {
      config.baseURL = env.mockApi
    } else {
      config.baseURL = env.baseApi
    }
    return {
      ...config
    }
  },
  throttleErrorCallback(error => {
    return Promise.reject(error)
  })
)

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse & IAxiosResponse) => {
    hideLoading()
    if (response.config.responseType === 'blob') {
      return response
    }
    const data: HttpResponse = !(response.request instanceof XMLHttpRequest) ? response : response.data
    if (data.code === 500001) {
      // 未登录或登录失效时返回登录页面
      handleError(new Error(data.msg))
      // storage.remove(TOKEN)
      location.href = `/login?callback=${encodeURIComponent(location.href)}`
    } else if (data.code !== 0) {
      if (response.config.showError === false) {
        return Promise.resolve(data)
      } else {
        handleError(new Error(data.msg))
        return Promise.reject(data)
      }
    }
    return data.data
  },
  throttleErrorCallback(error => {
    hideLoading()
    message.error(error.message)
    return Promise.reject(error.message)
  })
)

function throttleErrorCallback(callback: { (error: any): Promise<never>; (arg0: AxiosError<unknown, any>): any }) {
  const handledErrors = new WeakSet()
  return (error: AxiosError) => {
    if (handledErrors.has(error)) {
      return Promise.reject(error)
    }
    handledErrors.add(error)
    return callback(error)
  }
}

function handleError(e: unknown): void {
  if (e instanceof Error) {
    message.error(e.message)
  } else {
    message.error('An unknown error occurred.')
  }
}

export default {
  get<T>(
    url: string,
    params?: IParams,
    options: IConfig & AxiosRequestConfig = {
      showLoading: true,
      showError: true
    }
  ): Promise<T> {
    return instance.get(url, {params, ...options})
  },
  post<T>(
    url: string,
    data?: IParams,
    options: IConfig & AxiosRequestConfig = {
      showLoading: true,
      showError: true
    }
  ): Promise<T> {
    return instance.post(url, data, options)
  },
  postForm<T>(
    url: string,
    data?: IParams,
    options: IConfig & AxiosRequestConfig = {
      showLoading: true,
      showError: true
    }
  ): Promise<T> {
    return instance.post(url, qs.stringify(data, {arrayFormat: 'indices'}), {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      ...options
    })
  },
  downloadFile(url: string, data: IParams, fileName = 'fileName.xlsx') {
    instance({
      url,
      data,
      method: 'post',
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], {
        type: response.data.type
      })
      const name = (response.headers['file-name'] as string) || fileName
      const link = document.createElement('a')
      link.download = decodeURIComponent(name)
      link.href = URL.createObjectURL(blob)
      document.body.append(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    })
  },
  uploadFile<T>(
    url: string,
    data: IParams,
    options: IConfig & AxiosRequestConfig = {
      showLoading: true,
      showError: true
    }
  ): Promise<T> {
    return instance.post(url, data, {
      transformRequest: [
        function (data) {
          const formData = new FormData()
          for (const key of Object.keys(data)) {
            if (data[key] instanceof Array && data[key][0] instanceof File) {
              data[key].forEach((e: any) => {
                formData.append(key, e, e.name)
              })
            } else {
              formData.append(key, data[key])
            }
          }
          return formData
        }
      ],
      headers: {'Content-Type': 'multipart/form-data'},
      ...options
    })
  }
}
