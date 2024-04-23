import {useImperativeHandle, useState} from 'react'
import {
  Modal,
  // Table,
  // TableProps
} from 'antd'
import {IPermissionModalProp} from '@/types/Modal'
import {RoleItem} from '@/types/Role'

// interface DataType {
//   key: string;
//   name: string;
//   value: string
// }

export default function SetPermission(props: IPermissionModalProp<RoleItem>) {

  const [visible, setVisible] = useState(false)

  // 暴露组件方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  const open = () => {
    setVisible(true)
  }

  const handleOk = () => {
    handleCancel()
    // 调用父组件的方法更新父组件的数据
    props.update()
  }

  const handleCancel = () => {
    setVisible(false)
  }

  // const columns: TableProps<DataType>['columns'] = [
  //   {
  //     title: '应用名',
  //     dataIndex: 'appName',
  //     key: 'appName',
  //   },
  //   {
  //     title: '超级管理员',
  //     dataIndex: 'admin',
  //     key: 'admin',
  //     render: (_, record) => {
  //       console.log(_)
  //       return (
  //         <div>{record.value}</div>
  //       )
  //     },
  //   }
  // ]
  //
  // const dataSource: DataType[] = [
  //   {
  //     appName: '用户管理',
  //     key: 'admin',
  //     name: 'admin',
  //     value: '1'
  //   }
  // ]

  return (
    <Modal
      title="设置权限"
      open={visible}
      okText="确定"
      cancelText="取消"
      maskClosable={false}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/*<Table pagination={false} dataSource={dataSource} columns={columns}/>*/}
    </Modal>
  )
}
