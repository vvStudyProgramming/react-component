/* 下拉选择组件

*传入参数
 placeholder : 提示文字 默认，请选择  --string
 placeholderStyle : 提示文字样式 默认  --string
 textStyle = {}, // 选择结果展示自定义样式  默认 { color: "#cdcdcd" } 具体传入属性，请参考接口中的定义  --object
 cosntStyle : 成员展示区域内容样式  --object
 itemList : 成员渲染数组 其中必需包含name名称  key唯一的id 例子：[{name:string,key:string | number}]  --array
 triggerMethod : 触发方式 （click为点击触发，hover为移动进入触发） 默认click  --string
 defaultKey : 默认展示信息,传入唯一的key值进行匹配  --string | number

*交互方法
 onInformation : 传递目前最新的选择情况按照 { name: "狮子", key: 0 }返还

**用法介绍**
1、只需要定义好 onInformation 则可以接收到最新的数据内容
2、渲染数组 itemList 中每个成员必须要有name 和 key 属性
3、defaultKey是根据成员的 key 即唯一标识进行判断寻找和渲染的，故请明确需要默认渲染的key
 */

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import './downSelection.css' // 引入样式
import Items from './components/downSelectionItem' // 使用隐藏区域成员组件

// prop接口
interface Props {
  placeholder?: string
  placeholderStyle?: placeholderStyle // 使用提示文字的样式type
  textStyle?: any
  cosntStyle?: any
  itemList?: { name: string; key: number | string }[]
  triggerMethod?: string
  defaultKey?: string | number
  onInformation?: (
    msg: { name?: string; key?: number | string } | undefined
  ) => void
}
// 提示文字的样式type
type placeholderStyle = {
  fontSize?: string
  fontWeight?: string
  fontFamily?: string
  color?: string
  padding?: string
  lineHeight?: string
}

// 用react自带的fc函数组件方式接收参数接口
const DownSelection = forwardRef((props: Props, ref) => {
  // 传入参数结构
  const {
    placeholder = '请选择', // 提示文字
    placeholderStyle = { color: '#cdcdcd' }, // 提示文字样式
    textStyle = {}, // 选择结果展示自定义样式
    cosntStyle = {}, // 成员展示区域内容
    itemList = [], // 成员渲染数组 其中必需包含name名称  key唯一的id
    triggerMethod = 'click', // 触发方式 （click为点击触发，hover为移动进入触发） 默认click
    defaultKey = '', // 默认展示信息,传入唯一的key值进行匹配
    onInformation = (msg) => {}, //传递目前最新的选择情况按照 { name: "狮子", key: 0 }返还
  } = props

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [checkedText, setCheckedText] = useState(null) // 用于接收选中成员内容对象的名称，用于展示
  const [itemIndex, setItemIndex] = useState(null) // 用于获取点击后的成员位置信息
  const [constShow, setConstShow] = useState(false) // 控制是否展示内容开关

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 暴露给父组件的方法
  // ================================================================
  useImperativeHandle(ref, () => ({
    // 清空目前展示和选中的内容
    empty() {
      setCheckedText(null)
      setItemIndex(null)

      // 给父级传递目前最新的选择情况
      onInformation({})
    },
  }))

  // useEffect函数使用区
  // ================================================================
  // 监听传入默认展示信息;
  useEffect(() => {
    // 判断传入的默认值信息是否是有数据的，防止传入0作为空来处理
    if (defaultKey || defaultKey === 0) {
      const list = [...itemList] // 对成员渲染数组 itemList 进行深克隆

      // 对此声明 对深克隆数组list进行筛选
      let item = list.find((value, index) => {
        // 判断此数组成员中是否有和  默认展示信息一样的内容
        if (value.key === defaultKey) {
          // 有的话则改变 itemIndex 获取点击后的成员位置信息
          setItemIndex(index)
        }
        // 并弹出需要筛选的结果
        return value.key === defaultKey
      })
      // 用筛选出来的内容，改变 checkedText 进行展示的文字内容
      setCheckedText(item?.name)

      // 给父级传递目前最新的选择情况
      onInformation(item)

      // 如果没有默认值，则直接弹出函数
    } else {
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultKey])

  // 事件函数
  // ================================================================
  // 选择展示区域点击函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const textClick = () => {
    // 判断是否是开启了点击时展示隐藏内容
    if (triggerMethod === 'click') {
      // 是的话，赋予此打开隐藏区域的功能
      setConstShow(!constShow)
    } else {
      // 否则直接跳出函数
      return
    }
  }
  // 选择展示区域鼠标移入函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const textHover = () => {
    // 判断是否是开启了鼠标移入时展示隐藏内容
    if (triggerMethod === 'hover') {
      // 是的话，赋予此打开隐藏区域的功能
      setConstShow(true)
    } else {
      // 否则直接跳出函数
      return
    }
  }

  //  隐藏成员点击函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const onItemClick = (
    msg: { name?: string; key?: number | string },
    index: number
  ) => {
    setItemIndex(index) // 同步对应的点击成员的位置，用于对应的隐藏成员进行展示选中样式
    setCheckedText(msg.name) // 同步展示内容区域的内容
    setConstShow(false) // 关闭隐藏成员区域的展示

    // 给父级传递目前最新的选择情况
    onInformation(msg)
  }

  return (
    <div
      className="downSelection"
      onMouseLeave={() => {
        // 只要鼠标离开了此组件，则将内容展示部分进行隐藏
        setConstShow(false)
      }}
    >
      {/* 选择展示区域
       *分为了展示选中位置区域 + 右边箭头区域
       *可以根据textStyle进行修改内容区域的样式
       *placeholderStyle为默认替代文字的样式，但仅仅限于文字方面的样式修改
       *当 checkedText存在值（有内容展示时） placeholder（提示文字则会隐藏）
       */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="downSelection-text"
        style={textStyle}
        onClick={() => {
          // 执行选择区域点击函数
          textClick()
        }}
        onMouseOutCapture={() => {
          // 执行选择展示区域鼠标移入函数
          textHover()
        }}
      >
        {/* 承接展示选中文字的区域 */}
        {/* ================================================================ */}
        <p style={!checkedText ? placeholderStyle : null}>
          {!checkedText ? placeholder : checkedText}
        </p>

        {/* 右边箭头展示
         *根据 constShow 隐藏区域控制开关，进行展示不同的转变方向
         *采用的是svg形式的图片展示
         */}
        {/* ================================================================ */}
        <span
          style={{
            transform: constShow
              ? 'translateY(-50%) rotate(180deg)'
              : 'translateY(-50%)',
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
        </span>
      </div>

      {/* 成员展示区域
       *当没有渲染数组 itemList 没有数据时，此区域不展示
       *此区域的展示和隐藏根据 constShow 开关仅需控制css
       *渲染数组 itemList 当内容呈现，则是用  downSelectionItem  隐藏成员组件进行展示
       *并进行使用 onItemClick 隐藏成员点击函数 传递 目前点击当成员信息和位置内容
       */}
      {/* ------------------------------------------------------------------------------ */}
      {itemList.length !== 0 && (
        <div
          className={`downSelection-const ${constShow ? 'showConst' : ''}`}
          style={{ ...cosntStyle }}
        >
          {/* 根据渲染数组 itemList 进行循环 Items组件进行展示隐藏区域的内容 */}
          {itemList.map((value, index) => {
            return (
              // 渲染隐藏成员组件
              /*传入属性
                name : 渲染名称
                keys : 唯一的key值
                status : 自身控制状态 用于展示是否是选中状态的开关

              *交互方法
                onItemCheck : 父级回调方法，用于传递点击后的该渲染信息全部给父级*/

              <Items
                name={value.name}
                keys={value.key}
                status={index === itemIndex}
                key={index}
                onItemCheck={(msg) => {
                  // 使用组件成员点击函数 传递该成员信息 与点击的位置
                  onItemClick(msg, index)
                }}
              ></Items>
            )
          })}
        </div>
      )}
    </div>
  )
})

// 导出时进行性能优化
export default React.memo(DownSelection)
