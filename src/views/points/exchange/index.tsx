import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, Row, Space, Table, Tag } from 'antd'
import { ClearOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { PageWrapper } from '@/components/Page'
import { getPointsExchangeList } from '@/api'
import type { APIResult, PageState, TableDataType } from './types'

const PointsExchangeList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [form] = Form.useForm()

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '订单编号', dataIndex: 'orderCode', width: 180 },
    { title: '会员昵称', dataIndex: 'memberName', width: 140 },
    { title: '电话', dataIndex: 'phone', width: 140 },
    { title: '兑换商品', dataIndex: 'productName', width: 180 },
    { title: '消耗积分', dataIndex: 'usePoints', sorter: true, align: 'right', width: 120 },
    { title: '兑换日期', dataIndex: 'exchangeDate', sorter: true, width: 180 },
    { title: '备注', dataIndex: 'remark', width: 160 }
  ]

  useEffect(() => {
    const run = async () => {
      setTableLoading(true)
      const params = { ...tableQuery, ...form.getFieldsValue() }
      // const data = await getPointsExchangeList(params)
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = await Promise.resolve({
        list: [
          {
            id: 1,
            orderCode: 'DH202309150001',
            memberName: '张先生',
            phone: '15974293369',
            productName: '无线蓝牙耳机',
            usePoints: 5000,
            exchangeDate: '2025-10-15 10:30:00',
            remark: '-'
          },
          {
            id: 2,
            orderCode: 'DH202309150002',
            memberName: '徐女士',
            phone: '18847558633',
            productName: '智能手环',
            usePoints: 1000,
            exchangeDate: '2025-11-15 11:00:00',
            remark: '-'
          },
          {
            id: 3,
            orderCode: 'DH202309150003',
            memberName: '李先生',
            phone: '13765432987',
            productName: '便携式充电宝',
            usePoints: 2000,
            exchangeDate: '2025-05-15 11:30:00',
            remark: '-'
          }
        ],
        total: 3
      })
      const { list, total } = data as unknown as APIResult
      setTableData(list)
      setTableTotal(total)
      setTableLoading(false)
    }
    run()
  }, [tableQuery, form])

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }

  return (
    <PageWrapper>
      <Card>
        <Form form={form} style={{ marginBottom: 12 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='会员昵称' name='memberName'>
                <Input placeholder='请输入会员昵称' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='电话' name='phone'>
                <Input placeholder='请输入电话' />
              </Form.Item>
            </Col>
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                justifyContent: 'flex-end',
                alignItems: 'start',
                marginBottom: 16,
                paddingRight: 12
              }}
            >
              <Space>
                {/* <Button color='cyan' icon={<PlusOutlined />}>
                  新增
                </Button> */}
                <Button
                  type='primary'
                  onClick={() => setTableQuery({ ...tableQuery, current: 1 })}
                  icon={<SearchOutlined />}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields()
                    setTableQuery({ ...tableQuery, current: 1 })
                  }}
                  icon={<ClearOutlined />}
                >
                  重置
                </Button>
              </Space>
            </div>
          </Row>
        </Form>
        {/* <Divider size='middle' /> */}
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
            showTotal: () => `共 ${tableTotal} 条记录`,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handlePageChange
          }}
        />
      </Card>
    </PageWrapper>
  )
}

export default PointsExchangeList
