import request from '@/utils/request'
import {UserInfo} from '@/types/Common'
import {MenuItem} from '@/types/Menu'
import {LoginParams} from '@/types/Auth.ts'

export default {
  login(params: LoginParams) {
    return request.post<void>('/login', params, {showLoading: false})
  },
  logout() {
    return request.post<void>('/logout', {showLoading: false})
  },
  getProfile() {
    return request.get<UserInfo>('/mgr/profile')
  },
  // 获取权限列表
  getPermission() {
    return request.get<{ buttonList: string[]; menuList: MenuItem[] }>('/mgr/permission')
  }
}
