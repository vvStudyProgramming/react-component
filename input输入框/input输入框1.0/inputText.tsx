/* input输入框组件

*传入参数
 sizeUnit: 整体代码的尺寸单位，默认px    ---string
 disabled:是否开启禁用功能  默认 false 关闭    ---bool
 boxStyle: 外层盒子样式对象 默认为{}    ---object
 icon: 左边icon图片地址内容，传入为字符串，默认为空    ---string
 iconStyle: 左边icon图片的尺寸设置，传入为对象，默认为 { width: 25, height: 25 ,html:默认svg放大镜}    ---object
          **注意：只能传入width、height、html这三个参数**
 type: input类型传参 传入input原生支持属性  默认 text    ---string
 placeholder: 默认提示文字 默认为 请输入内容    ---string
 maxlength: 字符限制长度 默认为空，不限制    ---string 或 number
 defaultValue: 首次展示的默认内容    ---string
 inputStyle: input框样式对象 默认{ color: '', fontSize: '15px' }    ---object
            ** 可以传入规范等style对象可以自定义样式 **
 buttonShow: 是否展示右侧按键开关（true展示 false关闭） 默认true    ---bool
 buttonIcon: 右侧按键icon图片地址，传入为字符串，默认为空    ---string
 buttonIconStyle: // 右侧按键icon图片的尺寸设置，默认为 { width: 15, height: 15 ,html:默认svg中的x图标}    ---object

*交互方法
 onUserText:接收输入内容函数 参数用户输入内容
 onVerify:使用规则验证函数  若需用规则此函数必须return 否则无效  参数为用户输入的内容
*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useState, useEffect, useRef } from 'react'
import './inputText.css' // 引入样式

// prop接口
interface Props {
  sizeUnit?: string
  disabled?: boolean
  boxStyle?: ElementCSSInlineStyle
  icon?: string
  iconStyle?: { width?: number; height?: number; html?: string }
  type?: string
  placeholder?: string
  maxlength?: string | number
  defaultValue?: string
  inputStyle?: { color?: string; fontSize?: string }
  buttonShow?: boolean
  buttonIcon?: string
  buttonIconStyle?: { width?: number; height?: number; html?: string }
  onUserText?: (msg: string) => void
  onVerify?: (msg: string) => string
}

const InputText: React.FC<Props> = (props) => {
  // 传入参数结构
  const {
    sizeUnit = 'px', // 整体代码的尺寸单位，默认px
    disabled = false, // 是否开启禁用功能  默认 false 关闭
    boxStyle = {}, // 外层盒子样式对象

    // 左侧icon图标属性
    // ------------------------------------------------------------------------------
    icon = '', // 左边icon图片地址内容，传入为字符串，默认为空
    iconStyle = {
      width: 25,
      height: 25,
      html: '<svg t="1652754030192" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2900" width="100%" height="100%"><path d="M921.3 874L738.1 690.8c51.3-62.6 82.1-142.5 82.1-229.6 0-200.1-162.8-363-363-363-200.1 0-363 162.8-363 363s162.8 363 363 363c87 0 167-30.8 229.6-82.1L870 925.3c7.1 7.1 16.4 10.6 25.7 10.6s18.6-3.5 25.7-10.6c14.1-14.2 14.1-37.2-0.1-51.3zM166.8 461.2c0-160.1 130.3-290.4 290.4-290.4s290.4 130.3 290.4 290.4-130.3 290.4-290.4 290.4-290.4-130.3-290.4-290.4z" p-id="2901" fill="#cdcdcd"></path></svg>',
    }, // 左边icon图片的尺寸设置，传入为对象，默认为 { width: 25, height: 25 ,html:默认svg放大镜}

    // input框属性
    // ------------------------------------------------------------------------------
    type = 'text', // input类型传参 传入input原生支持属性  默认 text
    placeholder = '请输入内容', // 默认提示文字 默认为请输入内容
    maxlength = '', // 字符限制长度 默认为空，不限制
    defaultValue = '', // 首次展示的默认内容
    inputStyle = { color: '', fontSize: '15px' }, // input框样式对象 默认{ color: '', fontSize: '15px' },

    // 右侧按键属性
    // ------------------------------------------------------------------------------
    buttonShow = true, // 是否展示右侧按键开关
    buttonIcon = '', // 右侧按键icon图片地址，传入为字符串，默认为空
    buttonIconStyle = {
      width: 20,
      height: 20,
      html: '<svg t="1652753469502" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="100%" height="100%"><path d="M466.986667 512L376.021333 421.973333a33.450667 33.450667 0 0 1-8.96-22.997333 30.72 30.72 0 0 1 9.514667-22.485333 30.72 30.72 0 0 1 22.485333-9.514667c8.661333 0 16.341333 2.986667 22.997334 8.96l90.026666 91.050667 90.026667-91.008c9.301333-8.661333 19.797333-11.349333 31.445333-8.021334a30.890667 30.890667 0 0 1 22.528 22.485334c3.328 11.690667 0.682667 22.186667-8.021333 31.530666L557.013333 512l91.008 89.984c8.661333 9.344 11.349333 19.84 8.021334 31.488a30.890667 30.890667 0 0 1-22.485334 22.485333c-11.690667 3.370667-22.186667 0.682667-31.530666-7.978666L512 556.970667l-89.984 91.008a33.450667 33.450667 0 0 1-23.04 8.96 30.72 30.72 0 0 1-22.485333-9.472 30.72 30.72 0 0 1-9.472-22.485334c0-8.704 2.986667-16.341333 8.96-23.04L466.986667 512zM512 896c108.672-2.688 199.168-40.192 271.488-112.512C855.808 711.168 893.312 620.672 896 512c-2.688-108.672-40.192-199.168-112.512-271.488C711.168 168.192 620.672 130.688 512 128c-108.672 2.688-199.168 40.192-271.488 112.512C168.192 312.874667 130.688 403.370667 128 512c2.688 108.672 40.192 199.168 112.512 271.488C312.874667 855.808 403.370667 893.312 512 896z m0 64c-126.677333-3.328-232.192-47.146667-316.501333-131.498667C111.146667 744.192 67.328 638.72 64 512c3.328-126.677333 47.146667-232.192 131.498667-316.501333C279.808 111.146667 385.28 67.328 512 64c126.677333 3.328 232.192 47.146667 316.501333 131.498667C912.853333 279.808 956.672 385.28 960 512c-3.328 126.677333-47.146667 232.192-131.498667 316.501333C744.192 912.853333 638.72 956.672 512 960z" p-id="2480" fill="#cdcdcd"></path></svg>',
    }, // 右侧按键icon图片的尺寸设置，传入为对象，默认为 { width: 15, height: 15 ,html:默认svg中的x图标}

    // 传出事件
    // ------------------------------------------------------------------------------
    // 接收输入内容函数 参数用户输入内容
    onUserText = (msg: string) => {},
    // 使用规则验证函数  若需用规则此函数必须return 否则无效  参数为用户输入的内容
    onVerify = (msg: string) => {},
  } = props

  // 声明变量使用区域
  // ------------------------------------------------------------------------------
  const [userValue, setValue] = useState(defaultValue) // input默认展示值+用户输入内容的变化承接值
  const [rightButtonShow, setRightButtonShow] = useState(false) // 控制右侧展示按键的操作，为布尔值
  const [inputState, setInputState] = useState(false) // 获取input框是否获取到焦点
  const [mouseState, setMouseStateState] = useState(false) // 获取鼠标是否移入本区域的状态

  // 声明ref使用区域
  // ------------------------------------------------------------------------------
  const inputFocus = useRef(null) // 获取input的ref值

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 监听 userValue 用户输入的内容承接值
  useEffect(() => {
    // 根据输入的内容进行拍断是否展示右侧按键
    userValue ? setRightButtonShow(true) : setRightButtonShow(false)
    // 给父级传递出输入的内容
    onUserText(userValue)

    // 用于消除警告不用在意
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userValue])

  return (
    // 外层区域
    // 根据 inputState（是否获取到焦点） 和 mouseState（鼠标是否移入） 的状态进行判断怎么使用class的类名
    <div
      className={`inputText ${
        disabled
          ? 'disabled'
          : inputState
          ? 'inputFocus'
          : mouseState
          ? 'mouseOver'
          : 'usually'
      }`}
      style={boxStyle}
      onClick={() => {
        // 让input获取到焦点
        inputFocus.current.focus()
      }}
      onMouseDown={() => {
        // 只有在还未禁用的状态下才能改变状态
        if (!disabled) {
          // 鼠标按下后，直接改变这个inputState状态，用于保障边框样式的展示
          setInputState(true)
        }
      }}
      onMouseOver={() => {
        // 鼠标移入时，改变mouseState的状态为true
        setMouseStateState(true)
      }}
      onMouseOut={() => {
        // 鼠标移出时，改变mouseState的状态为false
        setMouseStateState(false)
      }}
    >
      {/* 左侧icon图标
       *根据 icon（左侧图片地址） 或者 iconStyle（左侧渲染对象）中的html参数 判断进行展示
       *conStyle对象中存有需要改变的样式width、height的值和需要插入的innerHtml的字段html
       */}
      {/* ------------------------------------------------------------------------------ */}
      {(icon || iconStyle.html) && (
        <div
          className="inputText-icon"
          style={{
            backgroundImage: icon,
            width: String(iconStyle.width) + sizeUnit,
            height: String(iconStyle.height) + sizeUnit,
          }}
          dangerouslySetInnerHTML={{ __html: iconStyle.html }}
        />
      )}

      {/* input输入框
       *在外层套入div，这样可以根据这个div的宽度进行实时变化，且可以根据 iconStyle的width 和 buttonIconStyle的width 的值进行计算左右外边距
       *type参数表示input的原生类型参数，例如：password、text等
       *inputFocus为获取此input的ref参数，inputStyle为动态改变input的样式、userValue绑定的用户输入的内容
       *placeholder默认提示内容、maxlength输入最长的字数限制、disabled开启禁用
       */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="inputText-input"
        style={{
          marginLeft:
            icon || iconStyle.html
              ? String(iconStyle.width + 10) + sizeUnit
              : '10' + sizeUnit,
          marginRight: buttonShow
            ? String(buttonIconStyle.width + 10) + sizeUnit
            : '10' + sizeUnit,
        }}
      >
        <input
          type={type}
          ref={inputFocus}
          style={inputStyle}
          placeholder={placeholder}
          maxLength={maxlength ? maxlength : ''}
          disabled={disabled}
          value={userValue}
          onChange={(e) => {
            // 接收验证规则函数的返回值
            const needMsg = onVerify(e.target.value)
            // 判断是非有返回值，有则使用返还的内容，否则则展示目前输入的内容
            needMsg ? setValue(needMsg) : setValue(e.target.value)
          }}
          // 获取焦点事件函数
          onFocus={() => {
            // 当获取到焦点时改变目前inputState状态为true
            setInputState(true)
          }}
          // 失去焦点事件函数
          onBlur={() => {
            // 当失去焦点时改变目前inputState状态为false
            setInputState(false)
          }}
        />
      </div>

      {/* 右侧按键
       *根据buttonShow（是否展示按键） 和 disabled（是否禁用）进行展示
       *buttonIcon需要的背景图片地址
       *buttonIconStyle对象中存有需要改变的样式width、height的值和需要插入的innerHtml的字段html
       *此组件会根据 mouseState（鼠标状态）移入后 与 userValue是否有用户输入的值进行判断展示
       */}
      {/* ------------------------------------------------------------------------------ */}
      {rightButtonShow && !disabled && (
        <div
          className="inputText-bttun"
          style={{
            backgroundImage: buttonIcon,
            width: String(buttonIconStyle.width) + sizeUnit,
            height: String(buttonIconStyle.height) + sizeUnit,
            display: mouseState && userValue ? 'block' : 'none',
          }}
          dangerouslySetInnerHTML={{ __html: buttonIconStyle.html }}
          onClick={() => {
            // 清空用户输入内容
            setValue('')
          }}
        />
      )}

      {/* 禁用时显示的盒子
       *当disabled为true时才能展示
       */}
      {/* ------------------------------------------------------------------------------ */}
      {disabled && <div className="disabledBox" />}
    </div>
  )
}

// 导出时进行性能优化
export default React.memo(InputText)
