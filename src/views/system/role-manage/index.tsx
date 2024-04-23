import SetPermission from '@/views/system/role-manage/SetPermission'
import {useRef} from 'react'
import {Button} from "antd";
import {RoleItem} from '@/types/Role'

export default function RoleManage() {

  const permissionRef = useRef<{
    open: (data?: RoleItem) => void
  }>()

  // 设置权限
  const handleSetPermission = (record: RoleItem) => {
    permissionRef.current?.open(record)
  }

  return <div className="role">
    <Button type="text" onClick={() => handleSetPermission({id: 'admin', name: '超级管理员'})}>
      设置权限
    </Button>
    {/* 设置权限 */}
    <SetPermission mRef={permissionRef} update={() => {
    }}/>
  </div>
}
