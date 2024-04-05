import styles from './index.module.scss'

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div>
        <a href='https://www.imooc.com/u/1343480' target='_blank' rel='noreferrer'>
          河畔一角主页
        </a>
        <span className='gutter'>|</span>
        <a href='https://coding.imooc.com/class/644.html' target='_blank' rel='noreferrer'>
          React18+TS开发通用后台（新课）
        </a>
        <span className='gutter'>|</span>
        <a href='https://coding.imooc.com/class/502.html' target='_blank' rel='noreferrer'>
          Vue3全栈后台
        </a>
        <span className='gutter'>|</span>
        <a href='https://coding.imooc.com/class/397.html' target='_blank' rel='noreferrer'>
          Vue全家桶开发小米商城项目
        </a>
      </div>
      <div>Copyright ©2024 React18 稲妻CRM All Rights Reserved.</div>
    </footer>
  )
}
