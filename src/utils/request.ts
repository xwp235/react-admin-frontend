import axios, {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import env from '@/config'
import qs from 'qs'
import axiosRetry from 'axios-retry'
import AppText from '@/i18n'
import {hideLoading, showLoading} from '@/utils/loading'
import {message} from './AntdGlobal'
import storage from 'good-storage'
import {LOGIN_KEEP_STATUS} from '@/config/constants'

interface HttpResponse<T = any> {
  code: number
  msg: string
  success: boolean
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
  retries: 1,
  // 重试条件
  retryCondition: error => {
    return error.code !== 'ERR_BAD_RESPONSE' || error.response?.status !== 500
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config: IInternalRequestConfig & InternalAxiosRequestConfig) => {
    if (config.showLoading) {
      showLoading()
    }
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
    const errMsg = error.message ? error.message : error
    hideLoading()
    message.error(errMsg)
    return Promise.reject(errMsg)
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
    // 如果请求是成功的（response的status为200且data的success为true）
    const {code, msg, success} = data
    if (success) {
      if (code === 11012 || code === 11011) {
        // 登录过期时要求跳转回登陆页面
        storage.set(LOGIN_KEEP_STATUS, false)
        location.href = `/login?callback=${encodeURIComponent(location.href)}`
      }
      return data.data
    } else {
      if (response.config.showError === false) {
        return Promise.resolve(data)
      } else {
        handleError(new Error(msg))
        return Promise.reject(data)
      }
    }
  },
  throttleErrorCallback(error => {
    // response的状态码不为200时会走这里
    hideLoading()
    const errMsg = error.message ? error.message : error
    message.error(errMsg)
    return Promise.reject(errMsg)
  })
)

function throttleErrorCallback(callback: { (error: any): Promise<never>; (arg0: AxiosError<unknown, any>): any }) {
  const handledErrors = new WeakSet()
  return (error: AxiosError | string) => {
    if (!(error instanceof AxiosError)) {
      handledErrors.add(new Error(error))
    } else {
      if (handledErrors.has(error)) {
        return Promise.reject(error)
      }
      handledErrors.add(error)
    }
    return callback(error)
  }
}

function handleError(e: unknown, callback = () => {
}): void {
  if (e instanceof Error) {
    message.error(e.message, () => callback())
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
