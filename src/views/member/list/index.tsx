import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Modal,
  InputNumber,
  message,
  Tag
} from 'antd'
import { ClearOutlined, PlusOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper } from '@/components/Page'
import { listMembers, createMember, updateMember, deleteMember } from '@/services/memberSupabase'
import type { APIResult, PageState, TableDataType } from './types'
import dayjs from 'dayjs'
import yuan from '@/utils/yuan'
const status = [
  { label: '正常', value: 1 },
  { label: '已停用', value: 0 }
]
const MemberList: FC = () => {
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
    { title: '会员姓名', dataIndex: 'memberName', width: 120 },
    { title: '电话', dataIndex: 'phone', width: 140 },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      sorter: true,
      width: 180,
      render: v => dayjs(v).format('YYYY-MM-DD HH:mm:ss')
    },
    { title: '会员余额', dataIndex: 'balance', sorter: true, align: 'right', width: 120, render: v => yuan(v) },
    { title: '会员积分', dataIndex: 'points', sorter: true, align: 'right', width: 120 },
    {
      title: '会员状态',
      dataIndex: 'status',
      width: 100,
      render: v => <Tag color={v === 1 ? 'green' : 'red'}>{status.find(item => item.value === v)?.label || '-'}</Tag>
    },
    {
      title: '操作',
      hidden: true,
      key: 'action',
      width: 160,
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
          <Button style={{ padding: 0, height: 'auto' }} type='link'>
            明细
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
      const data = await listMembers({
        ...tableQuery,
        memberName: filters.memberName,
        phone: filters.phone,
        status: filters.status
      })
      const list = (data.list || []).map((row: any) => ({
        id: row.id,
        memberName: row.member_name,
        phone: Number(row.phone ?? 0),
        addTime: row.add_time,
        balance: row.balance ?? 0,
        points: row.points ?? 0,
        status: row.status
      })) as TableDataType[]
      setTableData(list)
      setTableTotal(data.total || 0)
      setTableLoading(false)
    }
    run()
  }, [tableQuery])

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }

  async function submitEdit() {
    setSubmitLoading(true)
    try {
      const values = await editForm.validateFields()
      const payload = {
        member_name: values.memberName,
        phone: String(values.phone || ''),
        balance: values.balance,
        points: values.points,
        status: values.status
      }
      let res = null
      if (editRecord) {
        res = await updateMember(editRecord.id, payload)
      } else {
        res = await createMember(payload)
      }
      if (res) {
        message.success(editRecord ? '更新成功' : '创建成功')
        setEditVisible(false)
        setTableQuery({ ...tableQuery })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  function confirmRemove(id: number) {
    Modal.confirm({
      title: '确认删除该会员？',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: '删除后不可恢复，是否继续？',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteMember(id)
        if (res) {
          message.success('删除成功')
          setTableQuery({ ...tableQuery })
          return Promise.resolve()
        }
        return Promise.reject()
      }
    })
  }

  function openEditModal(record?: any) {
    const init = record
      ? {
          memberName: record.memberName,
          phone: String(record.phone ?? ''),
          balance: record.balance,
          points: record.points,
          status: record.status,
          memberCode: record.memberCode
        }
      : { memberName: '', phone: '', balance: 0, points: 0, status: null, memberCode: '' }
    editForm.setFieldsValue(init)
    setEditRecord(record || null)
    setEditVisible(true)
  }

  return (
    <PageWrapper>
      <Card>
        <Form form={form} style={{ marginBottom: 0 }}>
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
              <Form.Item label='会员状态' name='status'>
                <Select placeholder='请选择会员状态' options={status} />
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
                {/* <Button disabled={tableLoading} type='primary' onClick={() => openEditModal()} icon={<PlusOutlined />}>
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
          title={editRecord ? '编辑会员' : '新增会员'}
          onCancel={() => setEditVisible(false)}
          onOk={submitEdit}
          confirmLoading={submitLoading}
          okText='保存'
          cancelText='取消'
        >
          <Form form={editForm} labelCol={{ span: 5 }}>
            <Form.Item label='会员姓名' name='memberName' rules={[{ required: true, message: '请输入会员姓名' }]}>
              <Input placeholder='请输入会员姓名' />
            </Form.Item>
            <Form.Item label='电话' name='phone' rules={[{ required: true, message: '请输入电话' }]}>
              <Input placeholder='请输入电话' />
            </Form.Item>
            <Form.Item label='余额' name='balance'>
              <InputNumber placeholder='请输入余额' min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='积分' name='points'>
              <InputNumber placeholder='请输入积分' min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='状态' name='status' rules={[{ required: true, message: '请选择会员状态' }]}>
              <Select placeholder='请选择会员状态' options={status} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageWrapper>
  )
}

export default MemberList
