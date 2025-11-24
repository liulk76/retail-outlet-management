import type { FC } from 'react'
import { Space } from 'antd'
import { useAppSelector } from '@/stores'
import classNames from 'classnames'
import styles from './app-logo.module.less'
import logoImg from '@/assets/images/logo.png'

const AppLogo: FC = () => {
  const getMenuFold = useAppSelector(state => state.app.appConfig?.menuSetting?.menuFold)
  const logoSrc = logoImg
  const title = '餐饮零售管理系统'

  return (
    <div className={classNames('anticon', styles['app-logo'])}>
      <Space>
        <img style={{ borderRadius: '50%' }} className={styles['logo-img']} src={logoSrc} alt='logo' />
        {/* <img
          className={classNames(styles['logo-name'], { [styles['hidden']]: getMenuFold })}
          src={logoName}
          alt='logo'
        /> */}
        <span
          style={{ textAlign: 'left' }}
          className={classNames(styles['logo-name'], { [styles['hidden']]: getMenuFold })}
        >
          {title}
        </span>
      </Space>
    </div>
  )
}

export default AppLogo
