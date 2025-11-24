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
  Row,
  Col,
  Divider,
  DatePicker,
  Descriptions
} from 'antd'
import { ClearOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { listOrders, createOrder, updateOrder, replaceOrderProducts, listOrderProducts } from '@/services/orderSupabase'
import { listDesks } from '@/services/deskSupabase'
import { message } from 'antd'
import OrderEditModal from './order-edit-modal'
import { PageWrapper } from '@/components/Page'
import type { APIResult, PageState, TableDataType } from './types'
import yuan from '@/utils/yuan'
import dayjs from 'dayjs'

const status = [
  { label: '待支付', value: 0, color: 'blue' },
  { label: '已完成', value: 1, color: 'green' },
  { label: '已取消', value: 2, color: 'red' }
]

const type = [
  { label: '堂食', value: 0 },
  { label: '外卖', value: 1 }
]

const paymentMethod = [
  { label: '支付宝', value: 0 },
  { label: '微信', value: 1 },
  { label: '现金', value: 2 }
]

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
  const [editVisible, setEditVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<any>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [deskOptions, setDeskOptions] = useState<{ label: string; value: number }[]>([])
  const [editInit, setEditInit] = useState<any>({})
  const [itemsLoading, setItemsLoading] = useState(false)

  const columns: ColumnsType<TableDataType> = [
    {
      title: '',
      width: 40,
      align: 'center',
      render: (_, record, index) => index + 1
    },
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      width: 200
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      sorter: true,
      width: 150,
      render: value => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      width: 100,
      render: (value: number) => {
        return type.find(item => item.value === value)?.label || '-'
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 100,
      render: (value: number) => (
        <Tag color={status.find(item => item.value === value)?.color || 'gray'}>
          {status.find(item => item.value === value)?.label || '-'}
        </Tag>
      )
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      sorter: true,
      align: 'right',
      width: 100,
      render: value => yuan(value)
    },
    {
      title: '优惠金额',
      dataIndex: 'discountAmount',
      sorter: true,
      align: 'right',
      width: 100,
      render: value => yuan(value)
    },
    {
      title: '支付金额',
      dataIndex: 'payAmount',
      align: 'right',
      sorter: true,
      width: 100,
      render: value => yuan(value)
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      width: 100,
      render: (value: number) => {
        return paymentMethod.find(item => item.value === value)?.label || '-'
      }
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      sorter: true,
      width: 150,
      render: value => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-')
    },
    {
      title: '桌号',
      dataIndex: 'tableNumber',
      width: 100
    },
    {
      title: '用户/手机',
      dataIndex: 'userInfo',
      width: 150
    },
    {
      title: '用餐人数',
      dataIndex: 'userCount',
      width: 100
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
          <Button
            style={{ display: 'inline', padding: 0, height: 'auto' }}
            type='link'
            onClick={() => openEditOrder(record)}
          >
            编辑
          </Button>
          <Button
            onClick={() => {
              setModalVisibel(true)
            }}
            style={{ display: 'inline', padding: 0, height: 'auto' }}
            type='link'
          >
            详情
          </Button>
          <Button danger style={{ display: 'inline', padding: 0, height: 'auto' }} type='link'>
            删除
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
    const run = async () => {
      setTableLoading(true)
      const filters = form.getFieldsValue()
      const start =
        Array.isArray(filters.orderDate) && filters.orderDate[0]
          ? filters.orderDate[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined
      const end =
        Array.isArray(filters.orderDate) && filters.orderDate[1]
          ? filters.orderDate[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined
      const data = await listOrders({
        ...tableQuery,
        orderCode: filters.orderCode,
        orderStatus: filters.orderStatus,
        paymentMethod: filters.paymentMethod,
        userName: filters.userName,
        userPhone: filters.userPhone,
        startTime: start,
        endTime: end
      })
      const list = (data.list || []).map((row: any) => ({
        id: row.id,
        orderNumber: row.order_code,
        createTime: row.create_time,
        orderType: row.order_type,
        orderStatus: row.order_status,
        orderAmount: row.order_amount ?? 0,
        discountAmount: row.discount_amount ?? 0,
        payAmount: row.pay_amount ?? 0,
        paymentMethod: row.pay_method ?? 0,
        payTime: row.pay_time,
        deskId: row.desk_id,
        tableNumber: row.shop_desks?.table_number,
        userInfo: row.user_name ? `${row.user_name}/${row.user_phone || '-'}` : row.user_phone || '-',
        userCount: row.user_count ?? 0
      })) as TableDataType[]
      setTableData(list)
      setTableTotal(data.total || 0)
      setTableSummary(data.summary || { orderAmount: 0, discountAmount: 0, payAmount: 0 })
      setTableLoading(false)
    }
    run()
  }, [tableQuery, form])

  useEffect(() => {
    const fetchDesks = async () => {
      try {
        const { list } = await listDesks({ current: 1, pageSize: 500 })
        setDeskOptions(
          (list || [])
            .map((r: any) => ({ label: `${r.table_number}-${r.table_name}`, value: r.id }))
            .sort((a: any, b: any) => a.label.localeCompare(b.label))
        )
      } catch (e) {
        message.error('桌号列表加载失败')
      }
    }
    fetchDesks()
  }, [])

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

  function handleConfirm() {
    // 调用接口
    setModalVisibel(false)
  }

  function handleCancle() {
    setModalVisibel(false)
  }

  async function openEditOrder(record?: any) {
    const init = record
      ? {
          orderType: record.orderType,
          orderStatus: record.orderStatus,
          orderAmount: record.orderAmount,
          discountAmount: record.discountAmount,
          payAmount: record.payAmount,
          paymentMethod: record.paymentMethod,
          payTime: record.payTime ? dayjs(record.payTime) : undefined,
          deskId: record.deskId,
          userName: record.userInfo?.split('/')?.[0] || '',
          userPhone: record.userInfo?.split('/')?.[1] || '',
          userCount: record.userCount,
          items: []
        }
      : {
          orderType: 0,
          orderStatus: 0,
          orderAmount: 0,
          discountAmount: undefined,
          payAmount: undefined,
          paymentMethod: undefined,
          payTime: dayjs(),
          deskId: undefined,
          userName: '',
          userPhone: '',
          userCount: undefined,
          items: []
        }
    setEditInit(init)
    setEditRecord(record || null)
    setEditVisible(true)
    if (record?.id) {
      setItemsLoading(true)
      const rows = await listOrderProducts(record.id)
      const items = (rows || []).map((r: any, idx: number) => {
        const price = Number(r.products?.price || 0)
        const qty = Number(r.quantity || 1)
        return {
          key: `${r.product_id || idx}`,
          productId: r.product_id,
          name: r.products?.product_name || '',
          price,
          count: qty,
          totalPrice: price * qty
        }
      })
      setEditInit({ ...init, items })
      setItemsLoading(false)
    }
  }

  async function submitEditOrder(values: any) {
    setSubmitLoading(true)
    try {
      const payload = {
        order_type: values.orderType,
        order_status: values.orderStatus,
        order_amount: values.orderAmount,
        discount_amount: values.discountAmount,
        pay_amount: values.payAmount,
        pay_method: values.paymentMethod,
        pay_time: values.payTime ? values.payTime.toDate().toISOString() : undefined,
        desk_id: values.deskId,
        user_name: values.userName,
        user_phone: values.userPhone,
        user_count: values.userCount
      }
      let res = null
      if (editRecord) {
        res = await updateOrder(editRecord.id, payload)
      } else {
        res = await createOrder(payload)
      }
      if (res) {
        const orderId = res.id
        const items = Array.isArray(values.items) ? values.items : []
        const ok = await replaceOrderProducts(
          orderId,
          items.map((it: any) => ({ product_id: String(it.productId), quantity: Number(it.count || 0) }))
        )
        if (!ok) {
          message.error('订单菜品保存失败')
          return
        }
        message.success(editRecord ? '更新成功' : '创建成功')
        setEditVisible(false)
        setTableQuery({ ...tableQuery })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Card>
        <Form
          form={form}
          style={{ marginBottom: 0 }}
          initialValues={{
            orderDate: [dayjs().startOf('year'), dayjs()]
          }}
        >
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='创建日期' name='orderDate'>
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='订单编号' name='orderCode'>
                <Input placeholder='请输入订单编号' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='订单状态' name='orderStatus'>
                <Select placeholder='请选择订单状态' options={status} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='支付方式' name='paymentMethod'>
                <Select placeholder='请选择支付方式' options={paymentMethod} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='用户姓名' name='userName'>
                <Input placeholder='请输入用户姓名' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='用户电话' name='userPhone'>
                <Input placeholder='请输入用户电话' />
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
                <Button icon={<PlusOutlined />} type='primary' onClick={() => openEditOrder()}>
                  新增
                </Button>
                <Button
                  disabled={tableLoading}
                  type='primary'
                  onClick={() => setTableQuery({ ...tableQuery, current: 1 })}
                  icon={<SearchOutlined />}
                >
                  查询
                </Button>
                <Button
                  disabled={tableLoading}
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
                <Table.Summary.Cell index={0} colSpan={5}>
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
              </Table.Summary.Row>
            )
          }}
        />
        <Modal
          centered
          open={modalVisibel}
          title='详情'
          width='800px'
          okText='确定'
          cancelText='取消'
          onCancel={handleCancle}
          onOk={handleConfirm}
          bodyStyle={{ padding: '0 48' }}
        >
          <Descriptions
            title='订单信息'
            items={[
              {
                label: '订单号',
                children: 'ORD202511220001'
              },
              {
                label: '下单时间',
                children: '2025-11-22 10:00:00'
              },
              {
                label: '订单类型',
                children: '普通订单'
              },
              {
                label: '订单金额',
                children: yuan(188)
              },
              {
                label: '桌号',
                children: 'A03'
              },
              {
                label: '用餐人数',
                children: '3'
              }
            ]}
          />
          <Divider />
          <Descriptions
            title='支付信息'
            items={[
              {
                label: '支付金额',
                children: yuan(188)
              },
              {
                label: '支付状态',
                children: <Tag color='green'>已支付</Tag>
              },
              {
                label: '优惠金额',
                children: yuan(0)
              },
              {
                label: '支付方式',
                children: '微信支付'
              },
              {
                label: '支付时间',
                children: '2025-11-22 10:00:00'
              },
              {
                label: '用户/手机号',
                children: '-'
              }
            ]}
          />
          <Divider />
          <div
            style={{
              marginBottom: 16,
              color: 'rgba(0, 0, 0, 0.88)',
              fontWeight: 600,
              fontSize: 16
            }}
          >
            点单信息
          </div>
          <Table
            size='small'
            columns={[
              {
                title: '序号',
                dataIndex: 'index',
                width: 60,
                key: 'index',
                render: (text, record, index) => index + 1
              },
              {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name'
              },
              {
                title: '单价（元/份）',
                width: 150,
                dataIndex: 'price',
                key: 'price',
                render: text => yuan(text)
              },
              {
                title: '数量（份）',
                width: 120,
                dataIndex: 'count',
                key: 'count'
              },
              {
                title: '金额',
                width: 150,
                dataIndex: 'totalPrice',
                key: 'totalPrice',
                render: text => yuan(text)
              }
            ]}
            dataSource={[
              {
                name: '鱼香肉丝',
                price: 12,
                count: 1,
                totalPrice: 12
              },
              {
                name: '红烧肉',
                price: 18,
                count: 1,
                totalPrice: 18
              },
              {
                name: '鱼香茄子',
                price: 14,
                count: 1,
                totalPrice: 14
              },
              {
                name: '青椒肉丝',
                price: 12,
                count: 1,
                totalPrice: 12
              }
            ]}
            summary={() => {
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3} align='left'>
                    <span style={{ fontWeight: 600 }}>总计</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align='left'>
                    <span style={{ fontWeight: 600 }}>4</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align='left'>
                    <span style={{ fontWeight: 600 }}>{yuan(56)}</span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )
            }}
          />
        </Modal>
        <OrderEditModal
          open={editVisible}
          title={editRecord ? '编辑订单' : '新增订单'}
          loading={submitLoading}
          queryLoading={itemsLoading}
          initialValues={editInit}
          deskOptions={deskOptions}
          typeOptions={type}
          statusOptions={status}
          paymentMethodOptions={paymentMethod}
          onCancel={() => setEditVisible(false)}
          onSubmit={submitEditOrder}
        />
      </Card>
    </PageWrapper>
  )
}

export default TableBasic
