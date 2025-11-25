import type { ColumnsType } from 'antd/es/table'
import { type FC, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import { ClearOutlined, SearchOutlined } from '@ant-design/icons'
import { PageWrapper } from '@/components/Page'
import { getPointsProductList } from '@/api'
import type { APIResult, PageState, TableDataType } from './types'

const ProductList: FC = () => {
  const [tableLoading, setTableLoading] = useState(false)
  const [tableData, setTableData] = useState<TableDataType[]>([])
  const [tableTotal, setTableTotal] = useState<number>(0)
  const [tableQuery, setTableQuery] = useState<PageState>({ current: 1, pageSize: 20 })
  const [form] = Form.useForm()

  const columns: ColumnsType<TableDataType> = [
    { title: '', width: 40, align: 'center', render: (_, __, index) => index + 1 },
    { title: '商品名称', dataIndex: 'productName', width: 200 },
    { title: '库存', dataIndex: 'stock', sorter: true, width: 100 },
    { title: '市场价', dataIndex: 'marketPrice', sorter: true, align: 'right', width: 120 },
    { title: '兑换所需积分', dataIndex: 'needPoints', sorter: true, align: 'right', width: 140 },
    { title: '添加日期', dataIndex: 'addDate', sorter: true, width: 180 },
    { title: '状态', dataIndex: 'status', width: 100, render: v => (v ? <Tag color='green'>{v}</Tag> : '-') },
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
      const params = { ...tableQuery, ...form.getFieldsValue() }
      // const data = await getPointsProductList(params)
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = await Promise.resolve({
        list: [
          {
            id: 1,
            productName: '无线蓝牙耳机',
            stock: 50,
            marketPrice: 299,
            needPoints: 5000,
            addDate: '2025-09-10 14:20:00',
            status: '启用'
          },
          {
            id: 2,
            productName: '智能手环',
            stock: 100,
            marketPrice: 199,
            needPoints: 1000,
            addDate: '2025-09-12 09:15:00',
            status: '启用'
          },
          {
            id: 3,
            productName: '便携式充电宝',
            stock: 75,
            marketPrice: 149,
            needPoints: 2000,
            addDate: '2025-09-14 16:30:00',
            status: '停用'
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
        <Form form={form} style={{ marginBottom: 0 }}>
          <Row gutter={24}>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='商品名称' name='productName'>
                <Input placeholder='请输入商品名称' />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <Form.Item label='状态' name='status'>
                <Select
                  placeholder='请选择状态'
                  options={[
                    { label: '启用', value: '启用' },
                    { label: '停用', value: '停用' }
                  ]}
                />
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

export default ProductList
