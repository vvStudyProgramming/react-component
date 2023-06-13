/*可滑动进度条

*传入属性
  defNumber = 0, // 默认初始值  --number
  maxNumber : 最大值 默认100  --number
  numberShowState : 数字显示类型 （number为计算后的最新值  percentage 为当前的百分比 none表示不显示）默认number  --string
  disabled : 禁用开关 默认false （true开启  false关闭）  --boolean
  slidingStyle: 滑动容器域样式  --参考接口
  containerStyle: 滑动伸缩区样式  --参考接口
  containerBtnStyle: 滑动伸缩区按键样式  --参考接口
  numStyle: 数字显示样式  --参考接口

*交互方法
 needNumber : 返回最新值的方法，返回一个最新值 num，和一个当前的百分比值 percentage --(num: number, percentage: number) => void


 ***用法介绍***
 1.参考传入属性进行使用
 2.此进度条返回数据为了方便统计，按照整数进行返回
 3.开启禁用模式后，将不会有回调函数进行返回，即needNumber方法会失效

 */

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
import React, { useRef, useEffect, useState } from 'react'
import './slidingProgressBar.css' // 引入样式

// 接口定义
interface Props {
  defNumber?: number
  maxNumber?: number
  numberShowState?: string
  disabled?: boolean
  slidingStyle?: {
    width?: string
    height?: string
    borderRadius?: string
    backgroundColor?: string
  }
  containerStyle?: { backgroundColor?: string }
  containerBtnStyle?: Style
  numStyle?: Style
  needNumber?: (num: number, percentage: number) => void
}
// 样式接口
interface Style {
  [key: string]: any
}

const SlidingProgressBar: React.FC<Props> = (props) => {
  // 参数结构
  const {
    defNumber = 0, // 默认初始值
    maxNumber = 100, // 最大值 默认100
    numberShowState = 'percentage', // 数字显示类型 （number为计算后的最新值  percentage 为当前的百分比 none表示不显示）
    disabled = false, // 禁用开关 默认false （true开启  false关闭）
    slidingStyle, // 滑动容器域样式
    containerStyle, // 滑动伸缩区样式
    containerBtnStyle, // 滑动伸缩区按键样式
    numStyle, // 数字显示样式
    needNumber = (num: number, percentage: number) => {}, // 返回最新值的方法，返回一个最新值 num，和一个当前的百分比值 percentage
  } = props

  // 变量声明区
  // ------------------------------------------------------------------------------
  // ref声明
  const sliding = useRef(null) // 滑动容器域dom获取
  const container = useRef(null) // 滑动伸缩区dom获取
  const containerBtn = useRef(null) // 滑动伸缩区按键dom获取

  // 状态声明
  // ================================================================
  const [showNum, setShowNum] = useState(null) // 显示的数字内容

  // 函数使用区
  // ------------------------------------------------------------------------------
  // hook函数
  // ================================================================
  // 监听（默认值+总数的变化）赋予最新的展示ui宽度
  useEffect(() => {
    let nowPercentage = defNumber / maxNumber // 获取到目前默认值的百分比
    container.current.style.transition = 'all linear 0.2s' // 绑定过度效果

    container.current.style.width =
      sliding.current.offsetWidth * nowPercentage + 'PX' // 赋予最新的计算高度

    // 判断 numberShowState 需要展示的状态进行改变显示的值
    numberShowState === 'number'
      ? setShowNum(Math.round(defNumber))
      : setShowNum((nowPercentage * 100).toFixed(0) + '%')

    // 只有在不是禁用模式下才能使用回调函数
    if (!disabled) {
      // 传递给父级目前的值
      needNumber(defNumber, Number((nowPercentage * 100).toFixed(0)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxNumber, defNumber])

  // 事件函数
  // ================================================================
  // 滑动容器点击函数
  const progressBar = (e) => {
    let parent = sliding.current.getBoundingClientRect().left // 获取到屏幕左边的距离
    let mouseX = e.clientX // 获取点击时的鼠标距离
    container.current.style.transition = 'all linear 0.2s' // 绑定过度效果
    container.current.style.width = mouseX - parent + 'px' // 赋予移动的距离
  }

  // 滑动按键长按函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const containerBtnDown = () => {
    container.current.style.transition = '' // 关闭动画效果
    let parent = sliding.current.getBoundingClientRect().left // 获取到屏幕左边的距离

    // 给window绑定鼠标移动事件
    window.onmousemove = (e) => {
      let mouseX = e.clientX // 获取移动时的鼠标x轴的坐标
      let movingDistance = mouseX - parent // 鼠标移动的距离

      // 判断如果 movingDistance 鼠标移动的距离，是在 滑动容器的宽度之间
      if (movingDistance <= sliding.current.offsetWidth && movingDistance > 0) {
        // 则将其差值赋予给伸缩容器
        container.current.style.width = mouseX - parent + 'px'
        // 使用展示数据+弹出此数据函数
        showNumber(mouseX - parent)
        // 如果这个差值是负数则 伸缩容器宽度一直为0
      } else if (movingDistance <= 0) {
        container.current.style.width = 0
        // 使用展示数据+弹出此数据函数
        showNumber(0)

        // 反之，大于了的滑动容器宽度，则伸缩容器宽度 只能是 滑动容器的宽度
      } else {
        container.current.style.width = sliding.current.offsetWidth + 'px'
        // 使用展示数据+弹出此数据函数
        showNumber(sliding.current.offsetWidth)
      }
    }

    // 给widow绑定鼠标抬起事件
    window.onmouseup = () => {
      // 清空 window的鼠标抬起和移动事件
      window.onmouseup = window.onmousemove = null
    }
  }

  // 展示数据+弹出此数据函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const showNumber = (newWidth: number) => {
    let nowPercentage = newWidth / sliding.current.offsetWidth // 根据传入的宽度参数 与 总宽度计算出比例值
    let nowNumber = Number((maxNumber * nowPercentage).toFixed(0)) // 计算出最新的大小值

    // 判断 需要展示的数据类型是什么
    numberShowState === 'number'
      ? setShowNum(nowNumber)
      : setShowNum((nowPercentage * 100).toFixed(0) + '%')

    // 使用父级回调函数 传入目前最新值+百分比
    needNumber(nowNumber, Number((nowPercentage * 100).toFixed(0)))
  }

  return (
    <div className="slidingProgressBar">
      {/* 滑动容器
       *禁用模式下，背景颜色默认展示 #e3e7ed
       */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="slidingProgressBar-slide"
        style={{
          ...slidingStyle,
          backgroundColor: disabled ? '#e3e7ed' : slidingStyle?.backgroundColor,
        }}
        ref={sliding}
        onClick={progressBar}
      >
        {/* 滑动收缩区域
         *禁用模式下，背景颜色默认展示 #C0C4CC
         */}
        {/* ================================================================ */}
        <div
          className="slidingProgressBar-slide-container"
          style={{
            backgroundColor: disabled
              ? '#C0C4CC'
              : containerStyle?.backgroundColor,
            borderRadius: slidingStyle?.borderRadius,
          }}
          ref={container}
        >
          {/* 滑动按键
           *禁用模式下，边框颜色默认展示 #C0C4CC
           */}
          <div
            className="slidingProgressBar-slide-container-btn"
            style={{
              ...containerBtnStyle,
              borderColor: disabled ? '#C0C4CC' : '',
            }}
            ref={containerBtn}
            onMouseDown={containerBtnDown}
          ></div>
        </div>
      </div>

      {/* 数字展示区域
       *禁用模式下，字体颜色默认展示 #bfbfbf
       */}
      {/* ------------------------------------------------------------------------------ */}
      {numberShowState !== 'none' && (
        <div
          className="slidingProgressBar-showNum"
          style={{ ...numStyle, color: disabled ? '#bfbfbf' : '' }}
        >
          {showNum}
        </div>
      )}

      {/* 禁用时展示内容区域
       *只要在禁用模式开启后才能展示进行遮罩
       */}
      {/* ------------------------------------------------------------------------------ */}
      {disabled && <div className="slidingProgressBar-disabled"></div>}
    </div>
  )
}

export default React.memo(SlidingProgressBar)
