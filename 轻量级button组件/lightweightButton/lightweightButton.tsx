/*轻量级按键组件组件

*传入参数
 children, 内部插槽  --any
 buttonCSS, 按键外层css,默认空字符串 --string
 changeBackgroundColor, 按键点或按下后背景颜色的变化,默认rgba(0,0,0,0.4)  --string
 ifLongPress, 是否开启长按功能，默认false   --boolean
 longPressTime, 长按功能的触发时间，单位毫秒，默认1000  --number
 isAntiShake, 是否开启防抖  --boolean
 antiShakeTime, 防抖的时间  --number

*交互方法
 userClick, 回调方法,执行成功后的回调函数
 longPressEnd, 回调方法,长按抬起按键成功后的回调函数

*ref暴露方法
 triggerClick,接受一个type字符串类型参数，传入 open 为按下按键, close 为按键抬起

***用法介绍***
  1、可以直接使用回调函数的形式进行绑定需要执行的方法
  2、如果需要绑定键盘操作，则建议使用ref的形式，调用暴露出去的api进行执行对应的操作，但是回调的方法一样使用
  3、本组件不提供然后展示性的css样式，需要各位主动使用 buttonCSS 绑定需要的属性，这样符合轻量级的标准
*/

// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react'
import './lightweightButton.css'

// ts接口
// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
import { Props, RefReturn } from './interface'

// 页面书写区
// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
const lightweightButton = forwardRef((props: Props, ref) => {
  // 参数结构
  const {
    children, // 内部插槽
    buttonCSS = '', // 按键外层css
    changeBackgroundColor = 'rgba(0,0,0,0.4)', // 按键点或按下后背景颜色的变化
    ifLongPress = false, // 是否开启长按功能
    longPressTime = 1000, // 长按功能的触发时间
    isAntiShake = false, // 是否开启防抖
    antiShakeTime = 300, // 防抖的时间

    // 回调方法
    // ------------------------------------------------------------------------------
    userClick = () => {}, // 执行成功后的回调函数
    longPressEnd = () => {}, // 长按抬起按键成功后的回调函数
  } = props

  // 变量声明区
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  // ref声明
  const longPressTimer = useRef<NodeJS.Timeout>(null) // 长按定时器数值
  const antiShakeTimer = useRef<NodeJS.Timeout>(null) // 防抖定时器数值

  // 缓存使用
  // ------------------------------------------------------------------------------
  // 使用内存函数方法，进行性能优化
  const isPC = useMemo<boolean>(() => {
    //  获取用户当前的设备信息
    let userAgentInfo = navigator.userAgent

    // 创建移动端内容的数组
    let Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod',
    ]

    // 对 Agents 使用some方法，判断是否有成员和 当前用户设备信息一样,并赋值给 flagPc
    // （注意some方法返回是有成员一样为true，没有为false，所以要在此处取反）
    let flagPc = !Agents.some((value) => {
      return userAgentInfo.includes(value)
    })

    // 弹出结果
    return flagPc
  }, []) // 判断是否是pc端

  // 状态声明
  // ------------------------------------------------------------------------------
  const [occlusionShow, setOcclusionShow] = useState(false)

  // 函数使用区
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  // 暴露给父级组件的方法
  useImperativeHandle(
    ref,
    (): RefReturn => ({
      /**
       * @触发点击函数
       * @type触发的类型_传入一个字符串
       * open为按下时
       * close为抬起时
       */
      triggerClick(type) {
        // 根据传入的type值判断调用那种方法，是开启点击函数，还是结束的方法
        switch (type) {
          case 'open':
            // 开启点击函数
            boxMuseDown()
            break

          case 'close':
            // 关闭点击函数
            disposableOpen()
            break

          default:
            break
        }
      },
    })
  )

  // 事件函数
  // ------------------------------------------------------------------------------
  // 长按函数
  const longPressOpen = () => {
    // 执行定时器函数，等到了长按的时间后，触发需要的内容
    longPressTimer.current = setTimeout(() => {
      // 触发回调函数
      userClick()
    }, longPressTime)
  }

  // 一次性触发点击函数
  // ================================================================
  const disposableOpen = () => {
    // 如果开启了长按的开关 ifLongPress ，并且此长按定时器是 longPressTimer 有值的，则清除长按定时器
    ifLongPress &&
      longPressTimer.current &&
      clearTimeout(longPressTimer.current)

    // 关闭遮罩
    setTimeout(() => {
      setOcclusionShow(false)
    }, 100)

    // 根据是否为长按开关判断，执行那个后续触发函数
    ifLongPress
      ? longPressEnd()
      : // 判断是否开启了防抖开关，如果没有则正常执行，有的话执行防抖的定时器方法并赋值给 antiShakeTimer
      !isAntiShake
      ? userClick()
      : (antiShakeTimer.current = setTimeout(() => {
          // 在定时器中进行执行应该执行的函数
          userClick()
        }, antiShakeTime))
  }

  // 鼠标按下是触发函数
  // ================================================================
  const boxMuseDown = () => {
    // 打开遮罩层
    setOcclusionShow(true)

    // 如果开启了防抖模式，则每次按下时清理上次的函数计数器
    isAntiShake &&
      antiShakeTimer.current &&
      clearTimeout(antiShakeTimer.current)

    // 如果开启了长按开关则执行长按函数
    ifLongPress && longPressOpen()
  }

  // dom元素区域
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  return (
    <div
      className={`components_lightweightButton ${buttonCSS}`}
      // 以下事件都是根据是否是pc和移动端做的兼容处理
      onMouseDown={() => {
        isPC && boxMuseDown()
      }}
      onMouseUp={() => {
        isPC && disposableOpen()
      }}
      onTouchStart={() => {
        !isPC && boxMuseDown()
      }}
      onTouchEnd={() => {
        !isPC && disposableOpen()
      }}
    >
      {/* 按键点击时出现的遮挡颜色层 */}
      <div
        className={`components_lightweightButton-Occlusion `}
        style={{ backgroundColor: occlusionShow && changeBackgroundColor }}
      />

      {/* 自定义插槽的内容 */}
      {/* ------------------------------------------------------------------------------ */}
      {children}
    </div>
  )
})

export default React.memo(lightweightButton)
