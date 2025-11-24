import { type FC, useEffect, useState } from 'react'
import IntroduceRow from './components/Charts/IntroduceRow'
import { getChartData } from '@/api'
import { yearTotals } from '@/services/orderSupabase'
import type { ChartData } from './data'
import SalesCard from './components/Charts/SalesCard'
import { getTimeDistance } from './components/utils'
import type { RangePickerProps } from 'antd/es/date-picker'
import type { TimeType } from './components/Charts/SalesCard'
import type { Dayjs } from 'dayjs'
import useStyles from './components/style.style'
import OfflineData from './components/Charts/OfflineData'

type RangePickerValue = RangePickerProps['value']

const HomePage: FC = () => {
  const { styles } = useStyles()
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData>()
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(getTimeDistance('year'))
  const [totals, setTotals] = useState<{ revenue: number; userCount: number; orderCount: number }>({
    revenue: 0,
    userCount: 0,
    orderCount: 0
  })
  const fetchChartData = async () => {
    setIsLoading(true)
    const res = await getChartData()
    setChartData(res as ChartData)
    setIsLoading(false)
  }
  useEffect(() => {
    fetchChartData()
  }, [])

  useEffect(() => {
    const run = async () => {
      const year = new Date().getFullYear()
      const t = await yearTotals(year)
      setTotals({ revenue: t.orderAmount, userCount: t.userCount, orderCount: t.orderCount })
    }
    run()
  }, [])

  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return ''
    }
    const value = getTimeDistance(type)
    if (!value) {
      return ''
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }
    if (rangePickerValue[0].isSame(value[0] as Dayjs, 'day') && rangePickerValue[1].isSame(value[1] as Dayjs, 'day')) {
      return styles.currentDate
    }
    return ''
  }

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type))
  }

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value)
  }

  return (
    <div>
      <IntroduceRow loading={isLoading} visitData={chartData?.visitData || []} totals={totals} />
      <SalesCard
        rangePickerValue={rangePickerValue}
        salesData={chartData?.salesData || []}
        isActive={isActive}
        handleRangePickerChange={handleRangePickerChange}
        loading={isLoading}
        selectDate={selectDate}
      />
      <OfflineData loading={isLoading} offlineChartData={chartData?.offlineChartData || []} />
    </div>
  )
}

export default HomePage
