import { type FC, useEffect, useState } from 'react'
import { Button, Card, Form, Input, Space } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import { TimePicker } from 'antd'
import dayjs from 'dayjs'

import { Flex, message, Upload } from 'antd'
import type { GetProp, UploadProps } from 'antd'
import { getShopSetting, saveShopSetting, replaceShopLogo } from '@/services/shopSupabase'
import { useAppDispatch } from '@/stores'
import { setShopSetting } from '@/stores/modules/shop'

const { RangePicker } = TimePicker

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('请上传 JPG/PNG 格式的图片!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const ShopSetting: FC = () => {
  const startTime = dayjs('10:00:00', 'HH:mm:ss')
  const endTime = dayjs('21:00:00', 'HH:mm:ss')
  const [loading, setLoading] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const [saveShopInfoLoading, setSaveShopInfoLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [prevLogoUrl, setPrevLogoUrl] = useState<string | undefined>(undefined)
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  useEffect(() => {
    const run = async () => {
      setDisableForm(true)
      const data = await getShopSetting()
      if (data) {
        setDisableForm(false)
        form.setFieldsValue({
          name: data.name,
          businessHours: [dayjs(data.business_start_time, 'HH:mm:ss'), dayjs(data.business_end_time, 'HH:mm:ss')],
          address: data.address,
          description: data.description
        })
        if (data.logo_url) {
          setImageUrl(data.logo_url)
          setPrevLogoUrl(data.logo_url)
        }
      } else {
        form.setFieldsValue({ businessHours: [startTime, endTime] })
      }
    }
    run()
  }, [form])
  const handleChange: UploadProps['onChange'] = info => {
    const f = info.file.originFileObj as FileType
    if (f) {
      setLoading(true)
      getBase64(f, url => {
        setLoading(false)
        setImageUrl(url)
      })
      setLogoFile(f as unknown as File)
    }
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type='button'>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>点击上传</div>
    </button>
  )
  return (
    <Card style={{ minHeight: 'calc(100% - 20px)' }}>
      <h3>门店设置</h3>
      <div style={{ maxWidth: 448, margin: '0 auto', marginTop: 24 }}>
        <Form layout='vertical' form={form} disabled={disableForm}>
          <Form.Item label='门店名称' name='name' required>
            <Input style={{ width: 328 }} placeholder='请输入门店名称' />
          </Form.Item>
          <Form.Item label='营业时段' required name='businessHours' initialValue={[startTime, endTime]}>
            <RangePicker format='HH:mm:ss' style={{ width: 328 }} placeholder={['请选择开始时间', '请选择结束时间']} />
          </Form.Item>
          <Form.Item label='门店地址' name='address' required>
            <TextArea rows={2} placeholder='请输入门店地址' />
          </Form.Item>
          <Form.Item label='门店LOGO' name='logo' style={{ width: 102 }}>
            <Upload
              style={{ width: '102px !important', height: 102, overflow: 'hidden' }}
              name='avatar'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={false}
              // action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img draggable={false} src={imageUrl} alt='avatar' style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item label='门店描述' name='description'>
            <TextArea rows={4} placeholder='请输入门店描述' />
          </Form.Item>
          <div style={{ marginTop: 24 }}>
            <Space>
              <Button
                type='primary'
                loading={saveShopInfoLoading}
                onClick={async () => {
                  try {
                    const values = await form.validateFields()
                    setSaveShopInfoLoading(true)
                    setDisableForm(true)
                    let logoUrl = imageUrl
                    if (logoFile) {
                      const url = await replaceShopLogo(prevLogoUrl, logoFile)
                      if (!url) {
                        message.error('LOGO上传失败')
                        return
                      }
                      logoUrl = url
                    }
                    const start = values.businessHours?.[0]?.format('HH:mm:ss')
                    const end = values.businessHours?.[1]?.format('HH:mm:ss')
                    const payload = {
                      name: values.name,
                      business_start_time: start,
                      business_end_time: end,
                      address: values.address,
                      logo_url: logoUrl,
                      description: values.description
                    }
                    const settingData = await saveShopSetting(payload)
                    setSaveShopInfoLoading(false)
                    setDisableForm(false)
                    if (settingData) {
                      message.success('保存成功')
                      setPrevLogoUrl(logoUrl)
                      setImageUrl(logoUrl)
                      setLogoFile(null)
                      dispatch(setShopSetting({ setting: settingData }))
                    } else {
                      message.error('保存失败')
                    }
                  } catch (e) {}
                }}
              >
                保存
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </Card>
  )
}

export default ShopSetting
