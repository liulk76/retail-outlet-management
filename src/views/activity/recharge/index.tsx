import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space, Table, DatePicker } from 'antd'
import { ClearOutlined, SearchOutlined } from '@ant-design/icons'
import { PageWrapper } from '@/components/Page'
import { getRechargeRecordList } from '@/api'
import type { APIResult, PageState, TableDataType } from './types'

const RechargeList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [form] = Form.useForm()

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '充值订单编号', dataIndex: 'rechargeOrderCode', width: 180 },
    { title: '会员姓名', dataIndex: 'memberName', width: 120 },
    { title: '电话', dataIndex: 'phone', width: 140 },
    { title: '充值金额', dataIndex: 'rechargeAmount', sorter: true, align: 'right', width: 120 },
    { title: '到账金额', dataIndex: 'arrivalAmount', sorter: true, align: 'right', width: 120 },
    { title: '充值日期', dataIndex: 'rechargeDate', sorter: true, width: 180 },
    { title: '支付方式', dataIndex: 'payMethod', width: 120 }
  ]

  useEffect(() => {
    const run = async () => {
      setTableLoading(true)
      const filters = form.getFieldsValue()
      const params = { ...tableQuery, ...filters }
      // const data = await getRechargeRecordList(params)
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = await Promise.resolve({
        list: [
          {
            id: 1,
            rechargeOrderCode: 'CZ202309150001',
            memberName: '张先生',
            phone: '15974293369',
            rechargeAmount: 100,
            arrivalAmount: 120,
            rechargeDate: '2023-09-15 10:30:00',
            payMethod: '微信'
          },
          {
            id: 2,
            rechargeOrderCode: 'CZ202309150002',
            memberName: '徐女士',
            phone: '18847558633',
            rechargeAmount: 100,
            arrivalAmount: 120,
            rechargeDate: '2023-09-15 11:00:00',
            payMethod: '支付宝'
          },
          {
            id: 3,
            rechargeOrderCode: 'CZ202309150003',
            memberName: '李先生',
            phone: '13765432987',
            rechargeAmount: 200,
            arrivalAmount: 250,
            rechargeDate: '2023-09-15 11:30:00',
            payMethod: '现金'
          }
        ],
        total: 2
      })
      const { list, total } = data as unknown as APIResult
      setTableData(list)
      setTableTotal(total)
      setTableLoading(false)
    }
    run()
  }, [tableQuery, form])

  return (
    <PageWrapper>
      <Card>
        <Form form={form} style={{ marginBottom: 16 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='会员姓名' name='memberName'>
                <Input placeholder='请输入会员姓名' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='电话' name='phone'>
                <Input placeholder='请输入电话' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='充值日期' name='rechargeRange'>
                <DatePicker.RangePicker showTime />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='支付方式' name='payMethod'>
                <Select
                  placeholder='请选择支付方式'
                  options={[
                    { label: '现金', value: '现金' },
                    { label: '支付宝', value: '支付宝' },
                    { label: '微信', value: '微信' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col flex='none' style={{ marginLeft: 'auto' }}>
              <Space>
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
            </Col>
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
            showTotal: () => `共 ${tableTotal} 条记录`
          }}
        />
      </Card>
    </PageWrapper>
  )
}

export default RechargeList
