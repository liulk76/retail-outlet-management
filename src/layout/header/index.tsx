import { Layout } from 'antd'
import { Breadcrumb, FoldTrigger } from './components'
import LayoutFeature from '../feature'

const LayoutHeader = () => {
  const { Header } = Layout

  return (
    <Header
      className='flex-between-h'
      style={{
        flexDirection: 'column',
        height: 48,
        justifyContent: 'center',
        background: '#fff',
        borderBottom: '1px solid rgba(240, 240, 240)'
      }}
    >
      <div className='flex-between-h' style={{ padding: '0 12px' }}>
        <div className='flex-center-v'>
          <FoldTrigger />
          <Breadcrumb />
        </div>
        <LayoutFeature />
      </div>
    </Header>
  )
}

export default LayoutHeader
