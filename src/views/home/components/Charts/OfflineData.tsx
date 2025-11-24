import { Line } from '@ant-design/plots'
import { Card } from 'antd'
import type { DataItem } from '../data.d'
import useStyles from '../style.style'

const OfflineData = ({ loading, offlineChartData }: { loading: boolean; offlineChartData: DataItem[] }) => {
  const { styles } = useStyles()
  return (
    <Card
      loading={loading}
      className={styles.offlineCard}
      style={{
        marginTop: 32
      }}
    >
      <div
        style={{
          padding: '0 24px'
        }}
      >
        <Line
          height={400}
          data={offlineChartData}
          xField='date'
          yField='value'
          colorField='type'
          slider={{ x: true }}
          axis={{
            x: { title: false },
            y: {
              title: false,
              gridLineDash: null,
              gridStroke: '#ccc',
              gridStrokeOpacity: 1
            }
          }}
          legend={{
            color: {
              layout: { justifyContent: 'center' }
            }
          }}
        />
      </div>
    </Card>
  )
}
export default OfflineData
