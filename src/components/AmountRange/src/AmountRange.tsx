import type { FC } from 'react'
import { InputNumber, Space } from 'antd'

export type AmountRangeValue = [number | undefined, number | undefined]

export interface AmountRangeProps {
  value?: AmountRangeValue
  onChange?: (value: AmountRangeValue) => void
  placeholder?: [string, string]
  min?: number
  max?: number
  precision?: number
}

const AmountRange: FC<AmountRangeProps> = ({
  value,
  onChange,
  placeholder = ['最低金额', '最高金额'],
  min,
  max,
  precision = 2
}) => {
  const handleMinChange = (v: number | null) => {
    const next: AmountRangeValue = [value?.[0], value?.[1]]
    next[0] = v === null ? undefined : v
    onChange?.(next)
  }
  const handleMaxChange = (v: number | null) => {
    const next: AmountRangeValue = [value?.[0], value?.[1]]
    next[1] = v === null ? undefined : v
    onChange?.(next)
  }
  return (
    <Space>
      <InputNumber
        style={{ width: 'calc(100% - 8px)' }}
        value={value?.[0]}
        onChange={handleMinChange}
        placeholder={placeholder[0]}
        min={min}
        max={max}
        precision={precision}
        prefix='￥'
      />
      <span>~</span>
      <InputNumber
        style={{ width: 'calc(100% - 8px)' }}
        value={value?.[1]}
        onChange={handleMaxChange}
        placeholder={placeholder[1]}
        min={min}
        max={max}
        precision={precision}
        prefix='￥'
      />
    </Space>
  )
}

export default AmountRange
