import type { FC } from 'react'
import { useEffect } from 'react'
import { Modal, Form, Row, Col, Select, Input, InputNumber, DatePicker, Divider } from 'antd'
import MenuList from './menu-list/table'

interface Option {
  label: string
  value: number
}

interface Props {
  open: boolean
  title: string
  loading: boolean
  initialValues: any
  deskOptions: Option[]
  typeOptions: Option[]
  statusOptions: Option[]
  paymentMethodOptions: Option[]
  queryLoading?: boolean
  onCancel: () => void
  onSubmit: (values: any) => void
}

const OrderEditModal: FC<Props> = ({
  open,
  title,
  loading,
  initialValues,
  deskOptions,
  typeOptions,
  statusOptions,
  paymentMethodOptions,
  onCancel,
  onSubmit,
  queryLoading
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(initialValues || {})
  }, [initialValues, form, open])

  useEffect(() => {
    const items = (initialValues && initialValues.items) || []
    const sum = Array.isArray(items)
      ? items.reduce(
          (acc: number, it: any) => acc + Number(it.totalPrice ?? Number(it.price || 0) * Number(it.count || 0)),
          0
        )
      : 0
    form.setFieldsValue({ orderAmount: sum })
  }, [initialValues?.items])

  return (
    <Modal
      centered
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields()
        const items = form.getFieldValue('items') || []
        onSubmit({ ...values, items })
      }}
      confirmLoading={loading}
      okText='保存'
      cancelText='取消'
      width={720}
      styles={{
        header: {
          marginBottom: 24
        }
      }}
    >
      <Form form={form} initialValues={initialValues} labelCol={{ span: 6 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='订单类型' name='orderType' rules={[{ required: true, message: '请选择订单类型' }]}>
              <Select placeholder='请选择订单类型' options={typeOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='订单状态' name='orderStatus' rules={[{ required: true, message: '请选择订单状态' }]}>
              <Select placeholder='请选择订单状态' options={statusOptions} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='订单金额' name='orderAmount' initialValue={0}>
              <InputNumber disabled min={0} style={{ width: '100%' }} prefix='￥' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='优惠金额' name='discountAmount'>
              <InputNumber placeholder='请输入优惠金额' min={0} style={{ width: '100%' }} prefix='￥' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='支付金额' name='payAmount'>
              <InputNumber placeholder='请输入支付金额' min={0} style={{ width: '100%' }} prefix='￥' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='支付方式' name='paymentMethod'>
              <Select placeholder='请选择支付方式' options={paymentMethodOptions} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='支付时间' name='payTime'>
              <DatePicker placeholder='请选择支付时间' style={{ width: '100%' }} showTime />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='桌号' name='deskId' rules={[{ required: true, message: '请选择桌号' }]}>
              <Select placeholder='请选择桌号' options={deskOptions} disabled={deskOptions.length === 0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='用户' name='userName'>
              <Input placeholder='请输入用户姓名' />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='手机号' name='userPhone'>
              <Input placeholder='请输入手机号' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='用餐人数' name='userCount'>
              <InputNumber placeholder='请输入用餐人数' min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider style={{ margin: '16px 0' }} />
      <MenuList
        items={(initialValues && initialValues.items) || []}
        onChange={(items: any) => {
          const sum = Array.isArray(items)
            ? items.reduce(
                (acc: number, it: any) => acc + Number(it.totalPrice ?? Number(it.price || 0) * Number(it.count || 0)),
                0
              )
            : 0
          form.setFieldsValue({ items, orderAmount: sum })
        }}
        loading={!!queryLoading}
      />
    </Modal>
  )
}

export default OrderEditModal
