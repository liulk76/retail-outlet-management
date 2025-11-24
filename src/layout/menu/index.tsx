import type { MenuProps } from 'antd'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Spin } from 'antd'
import { getAsyncMenus } from '@/router/menus'
import type { AppMenu } from '@/router/types'
import { setMenuList } from '@/stores/modules/menu'
import { getOpenKeys } from '@/utils/helper/menuHelper'
import SvgIcon from '@/components/SvgIcon'

type MenuItem = Required<MenuProps>['items'][number]

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    label,
    key,
    icon,
    children,
    type
  } as MenuItem
}

const LayoutMenu = (props: any) => {
  const { pathname } = useLocation()
  const { setMenuList: setMenuListAction } = props
  const [loading, setLoading] = useState(false)
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])

  useEffect(() => {
    setSelectedKeys([pathname])
    setOpenKeys(prev => {
      const next = Array.from(new Set([...(prev || []), ...getOpenKeys(pathname)]))
      return next
    })
  }, [pathname])

  const addIcon = (icon?: string) => {
    if (!icon) return null
    return (
      <span className='anticon'>
        <SvgIcon name={icon} size={16} />
      </span>
    )
  }

  const getMenuItem = (data: AppMenu[], list: MenuItem[] = []) => {
    data.forEach((item: AppMenu) => {
      if (!item?.children?.length) {
        // return list.push(getItem(item.name, item.path, addIcon(item.icon)))
        return list.push(getItem(item.name, item.path, item.icon))
      }
      // list.push(getItem(item.name, item.path, addIcon(item.icon), getMenuItem(item.children)))
      list.push(getItem(item.name, item.path, item.icon, getMenuItem(item.children)))
    })
    return list
  }

  const getMenuList = async () => {
    setLoading(true)
    try {
      const menus = await getAsyncMenus()
      setMenuList(getMenuItem(menus))
      setMenuListAction(menus)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMenuList()
  }, [])

  const handleOpenChange: MenuProps['onOpenChange'] = (keys: string[]) => {
    setOpenKeys(keys)
  }

  const navigate = useNavigate()
  const handleMenuClick: MenuProps['onClick'] = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <div className='layout_menu'>
      <Spin spinning={loading} tip='Loading...'>
        <Menu
          theme='light'
          mode='inline'
          triggerSubMenuAction='click'
          inlineIndent={20}
          subMenuOpenDelay={0.2}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuList}
          onClick={handleMenuClick}
          onOpenChange={handleOpenChange}
          style={{ borderInlineEnd: 'none' }}
        />
      </Spin>
    </div>
  )
}

const mapStateToProps = (state: any) => state.menu
const mapDispatchToProps = { setMenuList }

export default connect(mapStateToProps, mapDispatchToProps)(LayoutMenu)
