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
  message,
  InputNumber,
  Tag
} from 'antd'
import { ClearOutlined, SearchOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { PageWrapper } from '@/components/Page'
import { listProducts, createProduct, updateProduct, deleteProduct } from '@/services/productSupabase'
import type { APIResult, PageState, TableDataType } from './types'
import dayjs from 'dayjs'
import yuan from '@/utils/yuan'

const status = [
  { label: '上架', value: 1 },
  { label: '下架', value: 0 }
]

const ProductList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [form] = Form.useForm()
  const [editVisible, setEditVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<any>(null)
  const [editForm] = Form.useForm()
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: number }[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '商品名称', dataIndex: 'productName', width: 200 },
    { title: '分类', dataIndex: 'categoryName', width: 160 },
    { title: '商品价格', dataIndex: 'price', sorter: true, align: 'right', width: 120, render: v => yuan(v) },
    { title: '销量', dataIndex: 'sales', sorter: true, width: 120 },
    { title: '库存', dataIndex: 'stock', sorter: true, width: 120 },
    {
      title: '开启状态',
      dataIndex: 'status',
      width: 100,
      render: v => <Tag color={v === 1 ? 'green' : 'red'}>{status.find(item => item.value === v)?.label || '-'}</Tag>
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
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record: any) => (
        <Space split={<span style={{ color: '#f0f0f0' }}>|</span>}>
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
      const data = await listProducts({
        ...tableQuery,
        productName: filters.productName,
        status: filters.status,
        categoryId: filters.categoryId
      })
      const list = (data.list || []).map((row: any) => ({
        id: row.id,
        productName: row.product_name,
        price: row.price,
        sales: row.sales,
        stock: row.stock,
        status: row.status,
        addTime: row.add_time,
        categoryId: row.category_id,
        categoryName: row.product_categories?.category_name
      }))
      setTableData(list)
      setTableTotal(data.total || 0)
      setTableLoading(false)
    }
    run()
  }, [tableQuery, form])

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { list } = await (
          await import('@/services/categorySupabase')
        ).listCategories({ current: 1, pageSize: 500 })
        setCategoryOptions((list || []).map((r: any) => ({ label: r.category_name, value: r.id })))
      } catch (e) {}
    }
    fetchCats()
  }, [])

  function handlePageChange(page: number, pageSize: number) {
    setTableQuery({ ...tableQuery, current: page, pageSize })
  }

  function openEditModal(record?: any) {
    const init = record
      ? {
          productName: record.productName,
          price: record.price,
          sales: record.sales,
          stock: record.stock,
          status: record.status,
          categoryId: record.categoryId
        }
      : { productName: '', price: 0, sales: 0, stock: 0, status: '上架', categoryId: undefined }
    editForm.setFieldsValue(init)
    setEditRecord(record || null)
    setEditVisible(true)
  }

  async function submitEdit() {
    setSubmitLoading(true)
    try {
      const values = await editForm.validateFields()
      const payload = {
        product_name: values.productName,
        price: values.price,
        sales: values.sales,
        stock: values.stock,
        status: values.status,
        category_id: values.categoryId
      }
      let res = null
      if (editRecord) {
        res = await updateProduct(editRecord.id, payload)
      } else {
        res = await createProduct(payload)
      }
      if (res) {
        setEditVisible(false)
        setTableQuery({ ...tableQuery })
        message.success(editRecord?.id ? '更新成功' : '创建成功')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  function confirmRemove(id: number) {
    Modal.confirm({
      title: '确认删除该商品？',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: '删除后不可恢复，是否继续？',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        const res = await deleteProduct(id)
        if (res) {
          setTableQuery({ ...tableQuery })
          return Promise.resolve('删除成功')
        }
        return Promise.reject('删除失败')
      }
    })
  }

  return (
    <PageWrapper>
      <Card>
        <Form form={form} style={{ marginBottom: 0 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='分类' name='categoryId'>
                <Select placeholder='请选择分类' options={categoryOptions} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='商品名称' name='productName'>
                <Input placeholder='请输入商品名称' />
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
                <Button type='primary' icon={<PlusOutlined />} onClick={() => openEditModal()}>
                  新增
                </Button>
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
        <Modal
          open={editVisible}
          title={editRecord ? '编辑商品' : '新增商品'}
          onCancel={() => setEditVisible(false)}
          onOk={submitEdit}
          confirmLoading={submitLoading}
          okText='保存'
          cancelText='取消'
        >
          <Form form={editForm} labelCol={{ span: 5 }}>
            <Form.Item label='分类' name='categoryId' rules={[{ required: true, message: '请选择分类' }]}>
              <Select placeholder='请选择分类' options={categoryOptions} />
            </Form.Item>
            <Form.Item label='商品名称' name='productName' rules={[{ required: true, message: '请输入商品名称' }]}>
              <Input placeholder='请输入商品名称' />
            </Form.Item>
            <Form.Item label='价格' name='price' rules={[{ required: true, message: '请输入价格' }]}>
              <InputNumber placeholder='请输入价格' min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='销量' name='sales'>
              <InputNumber placeholder='请输入销量' min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='库存' name='stock'>
              <InputNumber placeholder='请输入库存' min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='状态' name='status'>
              <Select placeholder='请选择状态' options={status} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </PageWrapper>
  )
}

export default ProductList
