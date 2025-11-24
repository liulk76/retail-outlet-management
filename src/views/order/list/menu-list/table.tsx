import React, { useContext, useEffect, useRef, useState } from 'react'
import type { GetRef, InputRef, TableProps } from 'antd'
import { Button, Form, Input, Popconfirm, Table, Select, InputNumber } from 'antd'
import './style.less'
import yuan from '@/utils/yuan'
import { PlusOutlined } from '@ant-design/icons'
import { listProducts } from '@/services/productSupabase'

type FormInstance<T> = GetRef<typeof Form<T>>

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
  key: string
  name: string
  age: string
  address: string
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item style={{ margin: 0 }} name={dataIndex} rules={[{ required: true, message: `请选择商品` }]}>
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' style={{ paddingInlineEnd: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

interface DataType {
  key: React.Key
  productId?: number
  name?: string
  price: number
  count: number
  totalPrice: number
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>

const EditableTable: React.FC<any> = ({ items = [], onChange, loading = false }) => {
  const [dataSource, setDataSource] = useState<DataType[]>(items)
  const [productOptions, setProductOptions] = useState<Array<{ label: string; value: number; price: number }>>([])

  const [count, setCount] = useState(2)

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter(item => item.key !== key)
    setDataSource(newData)
  }

  useEffect(() => {
    const run = async () => {
      const { list } = await listProducts({ current: 1, pageSize: 500 })
      setProductOptions((list || []).map((r: any) => ({ label: r.product_name, value: r.id, price: r.price })))
    }
    run()
  }, [])

  useEffect(() => {
    if (onChange) {
      onChange(dataSource)
    }
  }, [dataSource, onChange])

  useEffect(() => {
    setDataSource(items || [])
  }, [items])

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
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
      key: 'name',
      render: (_, record) => (
        <Select
          placeholder='请选择商品'
          style={{ width: '100%' }}
          value={(record as any).productId}
          options={productOptions}
          onChange={val => {
            const opt = productOptions.find(o => o.value === val)
            const next = dataSource.map(row =>
              row.key === record.key
                ? {
                    ...row,
                    productId: val,
                    name: opt?.label || '',
                    price: opt?.price || 0,
                    totalPrice: (opt?.price || 0) * (row.count || 0)
                  }
                : row
            )
            setDataSource(next)
          }}
        />
      )
    },
    {
      title: '单价（元/份）',
      width: 100,
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: text => yuan(text)
    },
    {
      title: '数量（份）',
      width: 100,
      align: 'right',
      dataIndex: 'count',
      key: 'count',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.count}
          onChange={val => {
            const next = dataSource.map(row =>
              row.key === record.key
                ? {
                    ...row,
                    count: Number(val || 0),
                    totalPrice: (row.price || 0) * Number(val || 0)
                  }
                : row
            )
            setDataSource(next)
          }}
        />
      )
    },
    {
      title: '金额',
      width: 100,
      align: 'right',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: text => yuan(text)
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title='确定要移除该商品吗？' onConfirm={() => handleDelete(record.key)}>
            <Button type='link' danger>
              移除
            </Button>
          </Popconfirm>
        ) : null
    }
  ]

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: '',
      price: 0,
      count: 1,
      totalPrice: 0
    }
    setDataSource([...dataSource, newData])
    setCount(count + 1)
  }

  const columns = defaultColumns

  return (
    <div>
      <Table<DataType>
        size='small'
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        loading={loading}
        summary={() => {
          const total = (dataSource || []).reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0)
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align='left'>
                <span style={{ fontWeight: 600 }}>合计</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align='right'>
                <span style={{ fontWeight: 600 }}>{yuan(total)}</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )
        }}
      />
      <Button style={{ width: '100%' }} icon={<PlusOutlined />} type='dashed' onClick={handleAdd} disabled={loading}>
        新增
      </Button>
    </div>
  )
}

export default EditableTable
