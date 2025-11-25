import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import { Button, Card, Divider, Space, Table, Tag } from 'antd'
import { PageWrapper } from '@/components/Page'
// import { getRechargeCampaignList } from '@/api'
import type { APIResult, PageState, TableDataType } from './types'

const CampaignList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery] = useState<PageState>({ current: 1, pageSize: 20 })

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '活动描述', dataIndex: 'desc', width: 240 },
    { title: '充值价值', dataIndex: 'rechargeValue', sorter: true, align: 'right', width: 120 },
    { title: '销售价', dataIndex: 'salePrice', sorter: true, align: 'right', width: 120 },
    { title: '折扣', dataIndex: 'discount', sorter: true, align: 'right', width: 100 },
    { title: '创建日期', dataIndex: 'createDate', sorter: true, width: 180 },
    {
      title: '活动状态',
      dataIndex: 'status',
      width: 100,
      render: () => {
        return <Tag color='green'>启用</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      align: 'center',
      hidden: true,
      render: () => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
          <Button style={{ padding: 0, height: 'auto' }} type='link'>
            编辑
          </Button>
          <Button danger style={{ padding: 0, height: 'auto' }} type='link'>
            删除
          </Button>
        </Space>
      )
    }
  ]

  useEffect(() => {
    const run = async () => {
      setTableLoading(true)
      // const data = await getRechargeCampaignList(tableQuery)
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = await Promise.resolve({
        list: [
          {
            id: 1,
            desc: '充值100送20',
            rechargeValue: 120,
            salePrice: 100,
            discount: '83折',
            createDate: '2025-01-01 10:03',
            status: 1
          },
          {
            id: 1,
            desc: '充值200送50',
            rechargeValue: 250,
            salePrice: 200,
            discount: '8折',
            createDate: '2025-01-01 10:03',
            status: 1
          },
          {
            id: 1,
            desc: '充值500送150',
            rechargeValue: 650,
            salePrice: 500,
            discount: '76折',
            createDate: '2025-01-09 10:03',
            status: 1
          }
        ]
      })
      const { list, total } = data as unknown as APIResult
      setTableData(list)
      setTableTotal(total)
      setTableLoading(false)
    }
    run()
  }, [tableQuery])

  return (
    <PageWrapper>
      <Card>
        <Table
          bordered
          scroll={{ x: 'fit-content' }}
          size='small'
          rowKey='id'
          columns={columns}
          dataSource={tableData}
          loading={tableLoading}
          pagination={{
            current: tableQuery.current,
            pageSize: tableQuery.pageSize,
            total: tableTotal,
            showTotal: () => `共 ${tableTotal} 条记录`
          }}
        />
      </Card>
    </PageWrapper>
  )
}

export default CampaignList
