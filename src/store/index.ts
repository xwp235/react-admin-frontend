import {create} from 'zustand'
import {UserInfo} from '@/types/Common'

export const useUserStore = create<{
  userInfo: UserInfo
  updateUserInfo: (userInfo: UserInfo) => void
}>(set => ({
  userInfo: {
    userId: 0,
    username: '',
    createTime: new Date(),
    dataValidPeriod: {
      start: new Date(),
      end: new Date()
    }
  },
  updateUserInfo: (userInfo: UserInfo) => set({userInfo}),
}))

export const useSystemStore = create<{
  collapsed: boolean
  updateCollapsed: () => void
}>(set => ({
  collapsed: false,
  updateCollapsed: () =>
    set(state => {
      return {
        collapsed: !state.collapsed
      }
    })
}))
