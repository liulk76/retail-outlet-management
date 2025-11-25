import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Row, Select, Space, Table, Modal, Input, message, Tag } from 'antd'
import { ClearOutlined, SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper } from '@/components/Page'
import { listDesks, createDesk, updateDesk, deleteDesk } from '@/services/deskSupabase'
import type { APIResult, PageState, TableDataType } from './types'
import dayjs from 'dayjs'

const status = [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 }
]

const categories = [
  { label: '4人桌', value: '4人桌' },
  { label: '圆桌（8人）', value: '圆桌（8人）' },
  { label: '包间（12人）', value: '包间（12人）' }
]

const DeskList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [form] = Form.useForm()
  const [editVisible, setEditVisible] = useState(false)
  const [editForm] = Form.useForm()
  const [editRecord, setEditRecord] = useState<any>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '桌号分类', dataIndex: 'category', width: 120 },
    { title: '桌号', dataIndex: 'tableNumber', width: 120 },
    { title: '桌号名称', dataIndex: 'tableName', width: 160 },
    { title: '下单数', dataIndex: 'orderCount', sorter: true, width: 100 },
    { title: '累计消费金额', dataIndex: 'amount', sorter: true, align: 'right', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: v => {
        return <Tag color={v === 1 ? 'green' : 'red'}>{status.find(item => item.value === v)?.label || '-'}</Tag>
      }
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      sorter: true,
      width: 180,
      render: v => dayjs(v).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      hidden: true,
      render: (_, record: any) => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
          <Button style={{ padding: 0, height: 'auto' }} type='link'>
            相关订单
          </Button>
          <Button style={{ padding: 0, height: 'auto' }} type='link' onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button danger style={{ padding: 0, height: 'auto' }} type='link' onClick={() => confirmRemove(record.id)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  useEffect(() => {
    const run = async () => {
      setTableLoading(true)
      const filters = form.getFieldsValue()
      const data = await listDesks({ ...tableQuery, category: filters.category, status: filters.status })
      const list = (data.list || []).map((row: any) => ({
        id: row.id,
        category: row.category,
        tableNumber: row.table_number,
        tableName: row.table_name,
        orderCount: row.order_count ?? 0,
        amount: row.amount ?? 0,
        status: row.status,
        addTime: row.add_time
      }))
      setTableData(list)
      setTableTotal(data.total || 0)
      setTableLoading(false)
    }
    run()
  }, [tableQuery, form])

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }

  function openEditModal(record?: any) {
    const init = record
      ? {
          category: record.category,
          tableNumber: record.tableNumber,
          tableName: record.tableName,
          status: record.status
        }
      : { category: undefined, tableNumber: '', tableName: '', status: null }
    editForm.setFieldsValue(init)
    setEditRecord(record || null)
    setEditVisible(true)
  }

  async function submitEdit() {
    setSubmitLoading(true)
    try {
      const values = await editForm.validateFields()
      const payload = {
        category: values.category,
        table_number: values.tableNumber,
        table_name: values.tableName,
        status: values.status
      }
      if (editRecord) {
        await updateDesk(editRecord.id, payload)
        message.success('更新成功')
      } else {
        await createDesk(payload)
        message.success('创建成功')
      }
      setEditVisible(false)
      setTableQuery({ ...tableQuery })
    } finally {
      setSubmitLoading(false)
    }
  }

  function confirmRemove(id: number) {
    Modal.confirm({
      title: '确认删除该桌号？',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: '删除后不可恢复，是否继续？',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        await removeOne(id)
      }
    })
  }

  async function removeOne(id: number) {
    await deleteDesk(id)
    message.success('删除成功')
    setTableQuery({ ...tableQuery })
  }

  return (
    <PageWrapper>
      <Card>
        <Form form={form} style={{ marginBottom: 0 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='桌号分类' name='category'>
                <Select placeholder='请选择分类' options={categories} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='状态' name='status'>
                <Select placeholder='请选择状态' options={status} />
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
                {/* <Button disabled={tableLoading} type='primary' icon={<PlusOutlined />} onClick={() => openEditModal()}>
                  新增
                </Button> */}
                <Button
                  disabled={tableLoading}
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
        <Modal
          open={editVisible}
          title={editRecord ? '编辑桌号' : '新增桌号'}
          onCancel={() => setEditVisible(false)}
          onOk={submitEdit}
          confirmLoading={submitLoading}
          okText='保存'
          cancelText='取消'
        >
          <Form form={editForm} labelCol={{ span: 5 }}>
            <Form.Item label='分类' name='category' rules={[{ required: true, message: '请选择分类' }]}>
              <Select placeholder='请选择分类' options={categories} />
            </Form.Item>
            <Form.Item label='桌号' name='tableNumber' rules={[{ required: true, message: '请输入桌号' }]}>
              <Input placeholder='请输入桌号' />
            </Form.Item>
            <Form.Item label='桌名' name='tableName' rules={[{ required: true, message: '请输入桌号名称' }]}>
              <Input placeholder='请输入桌号名称' />
            </Form.Item>
            <Form.Item label='状态' name='status' rules={[{ required: true, message: '请选择状态' }]}>
              <Select
                placeholder='请选择状态'
                options={[
                  { label: '启用', value: '启用' },
                  { label: '停用', value: '停用' }
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageWrapper>
  )
}

export default DeskList
