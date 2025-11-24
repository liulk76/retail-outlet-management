import type { ColumnsType } from 'antd/es/table'
import { type FC, useState, useEffect } from 'react'
import {
  type TableProps,
  Card,
  Button,
  Table,
  Tag,
  Switch,
  Popover,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
  Divider,
  DatePicker,
  Radio
} from 'antd'
import { ClearOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons'
// import { TABLE_COMPO } from '@/settings/websiteSetting'
import { dailyRevenueSummaryRangePaged, dailyRevenueSummaryTotalRange } from '@/services/orderSupabase'
import { AmountRange } from '@/components/AmountRange'
import { PageWrapper } from '@/components/Page'
import type { APIResult, PageState, TableDataType } from './types'
import yuan from '@/utils/yuan'
import dayjs from 'dayjs'

const TableBasic: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [tableSummary, setTableSummary] = useState<{
    orderAmount: number
    discountAmount: number
    payAmount: number
  } | null>(null)

  const [form] = Form.useForm()
  const [modalVisibel, setModalVisibel] = useState<boolean>(false)
  const [editHobbys, setEditHobbys] = useState<string[]>([])

  const columns: ColumnsType<TableDataType> = [
    {
      title: '',
      width: 40,
      align: 'center',
      render: (_, record, index) => index + 1
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 200
    },
    {
      title: '账单金额',
      dataIndex: 'flowAmount',
      sorter: true,
      align: 'right',
      width: 130,
      render: v => yuan(v)
    },
    {
      title: '优惠金额',
      dataIndex: 'discountAmount',
      sorter: true,
      align: 'right',
      width: 150,
      render: v => yuan(v)
    },
    {
      title: '实收金额',
      dataIndex: 'realPayAmount',
      sorter: true,
      align: 'right',
      width: 150,
      render: v => yuan(v)
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      sorter: true,
      width: 150
    },
    {
      title: '单均消费',
      dataIndex: 'avgOrderAmount',
      sorter: true,
      align: 'right',
      width: 150,
      render: v => yuan(v)
    },
    {
      title: '客流量',
      dataIndex: 'userCount',
      sorter: true,
      width: 100
    },
    {
      title: '人均消费',
      dataIndex: 'avgPayAmount',
      sorter: true,
      align: 'right',
      width: 150,
      render: v => yuan(v)
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
          <Button style={{ display: 'inline', padding: 0, height: 'auto' }} type='link'>
            订单明细
          </Button>
        </Space>
      )
    }
  ]

  const tableSelection: TableProps<any>['rowSelection'] = {
    onChange: (selectedRowKeys: any[]) => {
      console.log(selectedRowKeys)
    }
  }

  useEffect(() => {
    fetchData()
  }, [tableQuery])

  async function fetchData() {
    setTableLoading(true)
    const values = form.getFieldsValue()
    let start = Array.isArray(values.orderDate) && values.orderDate[0] ? values.orderDate[0].startOf('day') : null
    let end = Array.isArray(values.orderDate) && values.orderDate[1] ? values.orderDate[1].endOf('day') : null
    if (values.time) {
      const now = dayjs()
      if (values.time === 'quarterly') {
        start = now.subtract(3, 'month').startOf('day')
        end = now.endOf('day')
      } else if (values.time === 'halfYearly') {
        start = now.subtract(6, 'month').startOf('day')
        end = now.endOf('day')
      } else if (values.time === 'yearly') {
        start = now.subtract(12, 'month').startOf('day')
        end = now.endOf('day')
      }
      form.setFieldsValue({ orderDate: [start, end] })
    }
    const startStr = start ? start.format('YYYY-MM-DD HH:mm:ss') : dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss')
    const endStr = end ? end.format('YYYY-MM-DD HH:mm:ss') : dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    const [minAmount, maxAmount] = values.amountRange || []
    const { list, total } = await dailyRevenueSummaryRangePaged({
      start: startStr,
      end: endStr,
      minAmount,
      maxAmount,
      current: tableQuery.current,
      pageSize: tableQuery.pageSize
    })
    const summary = await dailyRevenueSummaryTotalRange({ start: startStr, end: endStr, minAmount, maxAmount })
    const mapped = (list || []).map((r, idx) => ({
      id: (tableQuery.current - 1) * tableQuery.pageSize + (idx + 1),
      date: r.day,
      flowAmount: Number(r.total_order_amount || 0),
      discountAmount: Number(r.total_discount_amount || 0),
      realPayAmount: Number(r.total_pay_amount || 0),
      orderCount: Number(r.order_count || 0),
      userCount: Number((r as any).user_count || 0),
      avgPayAmount:
        Number((r as any).user_count || 0) > 0
          ? Number(r.total_pay_amount || 0) / Number((r as any).user_count || 1)
          : 0,
      avgOrderAmount: r.order_count ? Number(r.total_order_amount || 0) / Number(r.order_count || 1) : 0
    })) as TableDataType[]
    setTableData(mapped)
    setTableTotal(total || 0)
    setTableSummary({
      orderAmount: summary.orderAmount,
      discountAmount: summary.discountAmount,
      payAmount: summary.payAmount
    })
    setTableLoading(false)
  }

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }

  function handleDelete() {
    Modal.confirm({
      title: '此操作将删除选中数据, 是否继续?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      // okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('OK')
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  function handleEdit(record: TableDataType) {
    form.setFieldsValue({ ...record })
    setEditHobbys((record as any).hobby || [])
    setModalVisibel(true)
  }

  function handleConfirm() {
    // 调用接口
    setModalVisibel(false)
  }

  function handleCancle() {
    setEditHobbys([])
    setModalVisibel(false)
  }

  return (
    <PageWrapper>
      <Card>
        <Form form={form} style={{ marginBottom: 0 }} initialValues={{ orderDate: [dayjs().startOf('year'), dayjs()] }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={12} xl={6} xxl={6}>
              <Form.Item label='金额' name='amountRange'>
                <AmountRange precision={2} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} xl={6} xxl={6}>
              <Form.Item label='日期' name='orderDate'>
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name='time'>
                <Radio.Group
                  onChange={e => {
                    const now = dayjs()
                    if (e.target.value === 'quarterly') {
                      form.setFieldsValue({ orderDate: [now.subtract(3, 'month').startOf('day'), now.endOf('day')] })
                    } else if (e.target.value === 'halfYearly') {
                      form.setFieldsValue({ orderDate: [now.subtract(6, 'month').startOf('day'), now.endOf('day')] })
                    } else if (e.target.value === 'yearly') {
                      form.setFieldsValue({ orderDate: [now.subtract(12, 'month').startOf('day'), now.endOf('day')] })
                    }
                  }}
                >
                  <Radio.Button value='quarterly'>近三月</Radio.Button>
                  <Radio.Button value='halfYearly'>近半年</Radio.Button>
                  <Radio.Button value='yearly'>近一年</Radio.Button>
                </Radio.Group>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                  <Button
                    type='primary'
                    onClick={() => {
                      setTableQuery({ ...tableQuery, current: 1 })
                    }}
                    icon={<SearchOutlined />}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form.resetFields()
                      form.setFieldsValue({ orderDate: [dayjs().startOf('year'), dayjs()] })
                      setTableQuery({ ...tableQuery, current: 1 })
                    }}
                    icon={<ClearOutlined />}
                  >
                    重置
                  </Button>
                </Space>
              </div>
            </div>
          </Row>
        </Form>
        {/* <Divider size='middle' /> */}
        <Table
          bordered
          scroll={{ x: 'fit-content' }}
          size='small'
          rowKey='date'
          // rowSelection={tableSelection}
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
          summary={() => {
            return (
              <Table.Summary.Row style={{ background: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <span style={{ fontWeight: 600, paddingLeft: 12 }}>总计</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align='right'>
                  <span style={{ fontWeight: 600 }}>{yuan(tableSummary?.orderAmount || 0)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align='right'>
                  <span style={{ fontWeight: 600 }}>{yuan(tableSummary?.discountAmount || 0)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align='right'>
                  <span style={{ fontWeight: 600 }}>{yuan(tableSummary?.payAmount || 0)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={5} align='right' />
              </Table.Summary.Row>
            )
          }}
        />
        <Modal
          open={modalVisibel}
          title='编辑'
          width='600px'
          okText='确定'
          cancelText='取消'
          onCancel={handleCancle}
          onOk={handleConfirm}
        >
          <Form
            form={form}
            colon={false}
            labelCol={{ span: 4 }}
            labelAlign='left'
            style={{ width: '80%', margin: '0 auto' }}
          >
            <Form.Item label='姓名' name='name'>
              <Input disabled />
            </Form.Item>
            <Form.Item label='手机' name='phone'>
              <Input placeholder='请输入手机号码' />
            </Form.Item>
            <Form.Item label='学历' name='education'>
              <Select options={['初中', '高中', '大专', '本科'].map(item => ({ value: item }))} />
            </Form.Item>
            <Form.Item label='爱好' name='hobby'>
              <Checkbox.Group options={editHobbys.map(item => ({ label: item, value: item }))} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageWrapper>
  )
}

export default TableBasic
