import {UserInfo} from '@/types/Common'
import {MutableRefObject} from 'react'

export type IAction = 'create' | 'edit' | 'delete'

export interface IPermissionModalProp<T = UserInfo> {
  mRef: MutableRefObject<{ open: (data: T) => void } | undefined>
  update: () => void
}
