/*抽屉式展示框组件

*传入参数
 disable : 是否禁用 （true 开启；false 关闭） 默认false  --boolean
 defConstShow : 默认展示状态 （true 开启；false 关闭） 默认true  --boolean
 title : 头部标题  --string

***用法介绍***
1、若需样式修改，可根据需求对css进行样式自定义
2、预留了，在禁用状态下的样式名称，可以在对应css中进行查看
3、头部标题栏中，文字部分最大宽度是父级的95%，若文字超出后，会变成省略号，若不需要，请自行更改

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useEffect, useRef, useState } from 'react'
import './drawerDisplay.css' // 样式引入

// 组件引入
// ------------------------------------------------------------------------------

// prop接口
interface Props {
  children?: any
  disable?: boolean
  defConstShow?: boolean
  title?: string
}

const DrawerDisplay: React.FC<Props> = (props) => {
  // 参数结构
  const {
    children,
    disable = false, // 是否禁用 （true 开启；false 关闭） 默认false
    defConstShow = true, // 默认展示状态 （true 开启；false 关闭） 默认true
    title, // 头部标题
  } = props

  // 变量声明区
  // ------------------------------------------------------------------------------
  // ref声明
  const drawerDisplayConstShow = useRef(null) // 内容区域占位ref

  // 状态声明
  // ================================================================
  const [constShow, setConstShow] = useState(null) // 内容展示的开关
  const [constHeight, setConstHeight] = useState(null) // 内容展示动态高度
  const [animationSwitch, setAnimationSwitch] = useState(false) // 控制首次展示时动画显示开关

  // 函数使用区
  // ------------------------------------------------------------------------------
  // hook函数
  // ================================================================
  // 首次展示时的函数
  useEffect(() => {
    // 判断在非禁用+允许展示内容区域的时候
    if (disable && defConstShow) {
      // 启动定时器，恢复动画的展示
      setTimeout(() => {
        setAnimationSwitch(true)
      }, 200)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 默认展示状态同步props
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  useEffect(() => {
    // 是否开启了禁用
    if (disable) {
      // 是的话，直接变为false
      setConstShow(false)
    } else {
      // 不是的话，进行同步默认展示的状态
      setConstShow(defConstShow)
    }
  }, [defConstShow, disable])

  // 监听 children 的变化，如果发生改变，则同步改变内容承接的高度
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  useEffect(() => {
    // 同步目前内容区域的高度
    setConstHeight(drawerDisplayConstShow.current.offsetHeight)
  }, [children])

  // 事件函数
  // ================================================================
  // 头部点击切换显示
  const changeConstShow = () => {
    // 判断是否开启了禁用状态，是的话直接跳出
    if (disable) {
      return
    }
    // 同步最新的状态值
    setConstShow(!constShow)
  }

  return (
    <div className={`drawerDisplay ${disable ? 'drawerDisplay-disable' : ''}`}>
      {/* 头部标题展示区域 */}
      <div
        className={`drawerDisplay-head ${
          disable ? 'drawerDisplay-head-disable' : ''
        }`}
        onClick={changeConstShow}
      >
        {/* 内容标题 */}
        <div className="drawerDisplay-head-text">{title}</div>

        {/* 内容箭头 */}
        {/* ================================================================ */}
        <div
          className="drawerDisplay-head-arrow"
          style={{
            transform: constShow ? 'rotate(180deg)' : '',
            transition: animationSwitch ? '' : 'none',
          }}
        >
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5918"
            width="100%"
            height="100%"
          >
            <path
              d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z"
              fill="#cdcdcd"
              p-id="5919"
            ></path>
          </svg>
        </div>
      </div>

      {/* 内容展示区域 */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="drawerDisplay-const"
        style={{
          height: constShow ? constHeight + 'px' : 0,
          transition: animationSwitch ? '' : 'none',
        }}
      >
        {/* // 内容区域占位 */}
        <div className="drawerDisplay-const-show" ref={drawerDisplayConstShow}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default React.memo(DrawerDisplay)
