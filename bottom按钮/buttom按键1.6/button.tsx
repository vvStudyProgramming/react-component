/* botton按钮组件

* 传入属性
 disabled : 是否禁用 默认false  ---bool
 msg : 传递给父级的信息(可以是任何类型数值) 默认null  ---任意值
 buttonStyle :按键外层样式自定义对象 默认{height: 'auto',width: 'auto',padding: "5px 18px",backgroundColor: "#409eff",borderRadius: "5px"}  ---bool
 iconStyle :按键图标自定义对象，为直接书写style的样式无任何限制  ---object
 textStyle :文字样式自定义 默认{color: "",fontSize: "",fontWeight: "",fontFamily: "",}  ---object
 plainStyle :开启plain模式，如果只想要改变颜色，则传颜色的字符串，如果需要自定义边框，则是传数组，第一个成员为border样式的复合写法  ---string ｜ array
          例子：只想改变颜色时传入 plainStyle = “red”
               想改变整体边框样式时 plainStyle = ['1px solid red']
 plainText :如果想要在plain模式下字体颜色变化，则需要在设置此变化的颜色值  ---string

 borderStyle :开启边框模式，如果只想要改变颜色，则传颜色的字符串，如果需要自定义边框，则是传数组，第一个成员为border样式的复合写法  ---string | array
          例子：只想改变颜色时传入 borderStyle = “red”
               想改变整体边框样式时 borderStyle = ['1px solid red']
 borderText :如果想要在border模式下字体颜色变化，则需要在设置此变化的颜色值  ---string
 type : button原生属性，如果输入text，则变成文本按键 默认button  ---string
 timeout : 长按触发时间 默认2  ---number
 keyMode : 按键模式 传入（antiShake: 防抖模式 ；throttling:节流模式；auto或不传则是默认无限制模式 ） ---string
 keyModeTimer :防抖节流的时间设置，默认0.5  ---number


* 交互方法
onButton 父级点击函数
onLongBtn 长按触发函数

***用法介绍***
  1、普通模式，即直接 例子：<Btn>搜索</Btn>
  2、若需要传入图标，以插槽的形式（支持html标签），但必须放在文字内容之前，若放在之后会造成错位  例子：<Btn> <div>iocn</div> 搜索</Btn>
  3、plain模式，在鼠标移入时，边框的颜色改变，若是是只需要改变颜色则传入颜色的字符串即可  例子：<Btn plainStyle={"red"}> 搜索</Btn>；
    如果是想整体样式改变则按照数组形式传入  例子： <Btn plainStyle={['1px sclid red']}> 搜索</Btn>；
    此模式下默认会给外层加一个边框样式，防止改变样式后视觉突兀，若不符合需求，则可以结合 borderStyle 参数一起使用；
    若是需要字体颜色一起联动，则 plainText 传入想在该模式下的变化颜色即可，不传则是 textStyle中color的值
  4、边框模式,给外层添加边框用法和plain模式一样也是支持字符串+数组形式，故不做赘述。但若需要展示文字颜色和边框模式联动，则在borderText设置需要的颜色参数即可。
  5、文本按键，type传入text即可，只会是普通的文字按键样式，在文本按键下，鼠标移入移除，长按事件会无效
  6、若是需要长按功能，则可以设置 timeout 的数值，输入秒数，例子：timeout=2；即表示2s。从 onLongBtn 函数进行回调触发
  7、keyModeTimer是配套 keyMode 开启防抖节流模式后的触发秒数，只有开启keyMode模式后才有效果。
*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useEffect, useRef, useState } from 'react'
import './button.css' // 引入样式

// prop接口
interface Props {
  children?: any
  disabled?: boolean
  msg?: any
  buttonStyle?: {
    height?: string
    width?: string
    padding?: string
    backgroundColor?: string
    borderRadius?: string
  }
  iconStyle?: ElementCSSInlineStyle
  textStyle?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    fontFamily?: string
  }
  plainStyle?: string | string[]
  plainText?: string
  borderStyle?: string | string[]
  borderText?: string | string[]
  type?: string
  timeout?: number
  keyMode?: string
  keyModeTimer?: number
  onButton?: () => void
  onLongBtn?: () => void
}

export default function Button(props: Props) {
  // 传入参数结构
  const {
    disabled = false, // 是否禁用 默认false
    msg = null, // 传递给父级的信息(可以是任何类型数值) 默认null
    buttonStyle = {
      padding: '5px 18px',
      backgroundColor: '#409eff',
      borderRadius: '5px',
      height: 'auto',
      width: 'auto',
    }, // 按键外层样式自定义对象 默认{padding: "5px 18px",backgroundColor: "#409eff",borderRadius: "5px"}
    iconStyle = {}, // 按键图标自定义对象
    textStyle = {
      color: '',
      fontSize: '',
      fontWeight: '',
      fontFamily: '',
    }, // 文字样式自定义
    plainStyle = '', // 开启plain模式，如果只想要改变颜色，则传颜色的字符串，如果需要自定义边框，则是传数组，第一个成员为border样式的复合写法
    plainText = '', // 如果想要在plain模式下字体颜色变化，则需要在设置此变化的颜色值
    borderStyle = '', // 开启边框模式，如果只想要改变颜色，则传颜色的字符串，如果需要自定义边框，则是传数组，第一个成员为border样式的复合写法
    borderText = '', // 如果想要在border模式下字体颜色变化，则需要在设置此变化的颜色值
    type = 'button', // button原生属性，如果输入text，则变成文本按键
    timeout = 2, // 长按触发时间 默认2
    keyMode = 'auto', // 按键模式 传入（antiShake: 防抖模式 ；throttling:节流模式；auto或不传则是默认无限制模式 ）
    keyModeTimer = 0.5, // 防抖节流的时间设置，默认0.5

    // 传出事件
    // ------------------------------------------------------------------------------
    // 父级点击函数
    onButton = (msg?: any) => {},
    // 长按触发函数
    onLongBtn = (msg?: any) => {},
  } = props

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [hover, setHover] = useState(false) // 控制 鼠标移入时展示的背景模块 盒子的展示
  const time = useRef(null) // 长按按键判断定时器
  const timer = useRef(null) // 防抖节流定时器承接值
  const [press, setPress] = useState(false) // 控制 鼠标按下时内容区域的缩小
  const buttonBorder = useRef(null) // 声明button的 ref

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 监听hover的熟悉变化
  useEffect(() => {
    // 判断是否开启了禁用
    if (disabled) {
      // 是的话，改变成禁用的样式，并且终止下方的逻辑
      buttonBorder.current.style.color = '#c0c4cc'
      buttonBorder.current.style.border =
        type === 'text' ? 'none' : '1px solid #ebeef5'
      buttonBorder.current.style.cursor = 'not-allowed'
      return
    } else {
      // 不是的话则恢复为默认的鼠标样式
      buttonBorder.current.style.cursor = ''
    }

    // 判断hover是否是true
    if (hover) {
      // plainStyle存在并且是字符串的情况下，则直接给border的颜色，否则则是在数组中取第一个
      plainStyle && typeof plainStyle === 'string'
        ? (buttonBorder.current.style.border = `1px solid ${plainStyle}`)
        : (buttonBorder.current.style.border = plainStyle[0])

      plainText && plainStyle
        ? (buttonBorder.current.style.color = plainText)
        : (buttonBorder.current.style.color = textStyle.color)
    } else if (!hover) {
      // hover为false，则表示鼠标移除，那么则恢复之前设置的border的效果情况
      !borderStyle && !plainStyle
        ? (buttonBorder.current.style.border = 'none')
        : !borderStyle && plainStyle
        ? (buttonBorder.current.style.border = '1px solid #cdcdcd')
        : typeof borderStyle === 'string'
        ? (buttonBorder.current.style.border = `1px solid ${borderStyle}`)
        : (buttonBorder.current.style.border = borderStyle[0])

      borderText && borderStyle
        ? (buttonBorder.current.style.color = borderText)
        : (buttonBorder.current.style.color = textStyle.color)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover])

  // 监听keyMode是否发生了变化
  useEffect(() => {
    // 变化了则初始化防抖节流时间的默认值
    timer.current = null
  }, [keyMode])

  // 事件函数区
  // ================================================================
  // 鼠标按下时触发函数
  const down = () => {
    // 鼠标按下时 改变控制鼠标按下内容区域的缩小开关为true，但只能是在非禁用模式下
    if (!disabled) {
      setPress(true)
      // 给time绑定长按定时器函数方便后续操作
      time.current = setTimeout(() => {
        // 执行长按配套的函数
        onLongBtn(msg)
      }, timeout * 1000)
    }
  }

  // 鼠标抬起时触发函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const up = () => {
    // 鼠标抬起时 改变控制鼠标按下内容区域的缩小开关为false
    setPress(false)
    // 清除长按时的定时器
    clearTimeout(time.current)
  }

  // 鼠标点击事件执行函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const click = () => {
    // 如果是禁用状态，则直接弹出函数，不会执行回调父级函数
    if (disabled) {
      return
    }

    // 判断是否开启了防抖模式
    if (keyMode === 'antiShake') {
      // 清除之前存在的 timer 定时器
      clearTimeout(timer.current)
      // 给防抖节流定时器 timer 赋予值
      timer.current = setTimeout(() => {
        // 使用父级的函数  传递给父级msg的数据
        onButton(msg)
      }, keyModeTimer * 1000)

      // 判断是否开启了节流模式
    } else if (keyMode === 'throttling') {
      // 判断时间是否不是不存在
      if (!timer.current) {
        timer.current = setTimeout(() => {
          // 使用父级的函数  传递给父级msg的数据
          onButton(msg)

          // 进行数据的初始化
          clearTimeout(timer.current)
          timer.current = null
        }, keyModeTimer * 1000)
      }

      // 默认模式
    } else {
      // 使用父级的函数  传递给父级msg的数据
      onButton(msg)
    }
  }

  return (
    /*按键外层
     *根据type的text属性进行选择class的默认样式 和 padding的是否呈现
     *根据buttonStyle进行改变 padding  backgroundColor  borderRadius对应的样式（但是都会受到是否是 文字按键 即 type = ‘text’ 的影响）
     *绑定useRef的参数 buttonBorder
     *如果type的属性值传入了 text 仅表示为文字按键，不会说button的默认属性
     */
    <button
      className={`Button ${type === 'text' ? 'text' : ''}`}
      style={{
        height: buttonStyle.height,
        width: buttonStyle.width,
        padding: type === 'text' ? '0' : buttonStyle.padding,
        backgroundColor:
          disabled || type === 'text' ? '' : buttonStyle.backgroundColor,
        borderRadius: type === 'text' ? '' : buttonStyle.borderRadius,
      }}
      ref={buttonBorder}
      type={type === 'text' ? 'button' : type}
      // 样式控制内容区
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      onMouseDown={() => {
        // 使用鼠标按下时函数
        down()
      }}
      onMouseUp={() => {
        // 使用鼠标抬起函数
        up()
      }}
      onMouseOver={() => {
        // 鼠标移入时，改变mouseState的状态为true
        setHover(true)
      }}
      onMouseOut={() => {
        // 鼠标移出时，改变mouseState的状态为false
        setHover(false)
      }}
      // 点击函数传出
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      onClick={() => {
        // 使用鼠标点击函数
        click()
      }}
    >
      {/* 按键内容区域
       *根据textStyle里面的属性进行添加文字属性
       *鼠标按下时的样式，在文字按键模式时无效
       */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="Button-const"
        style={{
          color: textStyle.color,
          fontSize: textStyle.fontSize,
          fontWeight: textStyle.fontWeight,
          fontFamily: textStyle.fontFamily,
          transform: press && type !== 'text' ? 'scale(0.9)' : '',
        }}
      >
        {/* 图标展示区域
         *根据插槽的用法进行判断展示规则，即若只是仅仅传入了一个文字信息，并且在children内容的第一个成员不存在+不是文字按键模式
         */}
        {/* ================================================================ */}
        {typeof props.children !== 'string' &&
          props.children[0] &&
          type !== 'text' && (
            <div className="Button-const-icon" style={iconStyle}>
              {props.children[0]}
            </div>
          )}

        {/* 文字内容
         *如果插槽的是只有一个成员，则根据children进行输入，如果不是则是根据children数组的第二位成员进行取值
         */}
        {/* ================================================================ */}
        {typeof props.children === 'string'
          ? props.children
          : props.children[1]}
      </div>

      {/* 鼠标移入时展示的背景模块
       *只要当非禁用状态+ 不是文字按键时才能在hover为true的时候呈现
       */}
      {/* ------------------------------------------------------------------------------ */}
      {hover && !disabled && type !== 'text' && (
        <div
          className={`Button-hoverBox ${disabled ? 'Button-disabled' : ''}`}
        ></div>
      )}
    </button>
  )
}
