import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space, Table, Modal, message, Tag } from 'antd'
import { PageWrapper } from '@/components/Page'
import { listCategories, createCategory, updateCategory, deleteCategory } from '@/services/categorySupabase'
import type { APIResult, PageState, TableDataType } from './types'
import { ClearOutlined, ExclamationCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useMessage } from '@/hooks/web/useMessage'
const status = [
  { label: '上架', value: 1 },
  { label: '下架', value: 0 }
]
const CategoryList: FC = () => {
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [form] = Form.useForm()
  const [editVisible, setEditVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<any>(null)
  const [editForm] = Form.useForm()
  const { createConfirm } = useMessage()

  function openEditModal(record?: any) {
    const init = record
      ? { categoryName: record.categoryName, sortOrder: record.sortOrder, status: record.status, remark: record.remark }
      : { categoryName: '', sortOrder: 0, status: null, remark: '' }
    editForm.setFieldsValue(init)
    setEditRecord(record || null)
    setEditVisible(true)
  }

  async function submitEdit() {
    const values = await editForm.validateFields()
    const payload = {
      category_name: values.categoryName,
      sort_order: values.sortOrder,
      status: values.status,
      remark: values.remark
    }
    let res = null
    setLoading(true)
    if (editRecord) {
      res = await updateCategory(editRecord.id, payload)
    } else {
      res = await createCategory(payload)
    }
    setLoading(false)
    if (res) {
      setEditVisible(false)
      message.success(editRecord?.id ? '更新成功' : '创建成功')
      setTableQuery({ ...tableQuery })
    }
  }

  const handleDelete = (record: TableDataType) => {
    createConfirm({
      iconType: 'warning',
      title: '确认删除该分类？',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: '删除后不可恢复，是否继续？',
      okButtonProps: { danger: true },
      onOk: async () => {
        const res = await deleteCategory(record.id)
        if (res) {
          setTableQuery({ ...tableQuery })
          return Promise.resolve('删除成功')
        }
        return Promise.reject('删除失败')
      }
    })
  }

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '分类名称', dataIndex: 'categoryName', width: 200 },
    { title: '分类排序', dataIndex: 'sortOrder', sorter: true, width: 120 },
    {
      title: '开启状态',
      dataIndex: 'status',
      width: 100,
      render: v => {
        return <Tag color={v === 1 ? 'green' : 'red'}>{status.find(item => item.value === v)?.label || '-'}</Tag>
      }
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      width: 180,
      render: text => dayjs(text).format('YYYY-MM-DD HH:mm:ss')
    },
    { title: '备注', dataIndex: 'remark', width: 200, ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      hidden: true,
      render: (_, record: any) => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
          <Button style={{ padding: 0, height: 'auto' }} type='link' onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Button danger style={{ padding: 0, height: 'auto' }} type='link' onClick={() => handleDelete(record)}>
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
      const data = await listCategories({ ...tableQuery, categoryName: filters.categoryName, status: filters.status })
      const list = (data.list || []).map((row: any) => ({
        id: row.id,
        categoryName: row.category_name,
        sortOrder: row.sort_order,
        status: row.status,
        createTime: row.create_time,
        remark: row.remark
      })) as TableDataType[]
      setTableData(list)
      setTableTotal(data.total || 0)
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
        <Form form={form} style={{ marginBottom: 0 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='分类名称' name='categoryName'>
                <Input placeholder='请输入分类名称' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='开启状态' name='status'>
                <Select placeholder='请选择开启状态' options={status} />
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
          title={editRecord ? '编辑分类' : '新增分类'}
          onCancel={() => setEditVisible(false)}
          onOk={submitEdit}
          okButtonProps={{ loading }}
          cancelButtonProps={{ disabled: loading }}
          okText='保存'
          cancelText='取消'
        >
          <Form form={editForm} labelCol={{ span: 5 }}>
            <Form.Item label='分类名称' name='categoryName' rules={[{ required: true, message: '请输入分类名称' }]}>
              <Input placeholder='请输入分类名称' />
            </Form.Item>
            <Form.Item label='分类排序' name='sortOrder'>
              <Input placeholder='请输入排序' type='number' />
            </Form.Item>
            <Form.Item label='开启状态' name='status'>
              <Select placeholder='请选择开启状态' options={status} />
            </Form.Item>
            <Form.Item label='备注' name='remark'>
              <Input.TextArea placeholder='请输入备注' rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageWrapper>
  )
}

export default CategoryList
