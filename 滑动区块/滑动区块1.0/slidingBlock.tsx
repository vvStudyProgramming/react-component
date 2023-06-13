/*滑动区块组件

*传入参数
  boxStyle : 外层盒子的style样式  --React.CSSProperties
  id : 需要滑动到顶部的id  --string

*交互方法
  scroll : 返回滑动函数 （boxHeight 滑动区域的真实高度；boxScrollTop 目前滑动的距离；boxScrollHeight 滚动条总高度）
  scrollBottom : 滑动到底部触发函数

***用法介绍***
1、此组件设计初衷为方便后续在滑动的区域进行更直观的使用方法
2、内置了滑动函数，底部触发函数
3、若是需要将内部某个元素滚动到顶部，则只需要传入id值就行
4、滚动动画方法，尝试了三个方式，但是最后选用css + scrollTop 的方法，但是不确定是否存在比较极端的兼容性问题，欢迎各位尝试
5、css样式中有 scroll-behavior: smooth;属性，建议请勿更改，否则会丧失选中id后滚动平滑的效果
6、其余尝试的方法，都以注释的形式，留在代码中，可以按需尝试
7、后续增加横向滑动功能

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useEffect, useRef } from 'react'
import './slidingBlock.css'

// 组件引入
// ------------------------------------------------------------------------------

// prop接口
interface Props {
  children?: any
  boxStyle?: React.CSSProperties
  id?: string
  scroll?: (
    boxHeight: number,
    boxScrollTop: number,
    boxScrollHeight: number
  ) => void
  scrollBottom?: () => void
}

const SlidingBlock: React.FC<Props> = (props) => {
  // 参数结构
  const {
    children,
    boxStyle, // 外层盒子的style样式
    id = '', // 需要滑动到顶部的id
    scroll = (
      boxHeight: number,
      boxScrollTop: number,
      boxScrollHeight: number
    ) => {}, // 返回滑动函数 （boxHeight 滑动区域的真实高度；boxScrollTop 目前滑动的距离；boxScrollHeight 滚动条总高度）
    scrollBottom = () => {}, // 滑动到底部触发函数
  } = props

  // 变量声明区
  // ------------------------------------------------------------------------------
  // ref声明
  const slidingBlock = useRef(null) // 外层盒子ref
  const userTop = useRef(null) // 选择的id元素距离头部的距离
  // const slidingDistance = useRef(null) // 目前一共需要滚动的距离
  // const timer = useRef(null) // 动画定时器的承接值
  const onesOpen = useRef(1) // 首次加载的判断值

  // 状态声明
  // ================================================================

  // 函数使用区
  // ------------------------------------------------------------------------------
  // hook函数
  // ================================================================
  // 监听id的变化，然后进行滑动
  useEffect(() => {
    if (!id) {
      onesOpen.current = 2

      return
    }
    let userId = document.getElementById(id)
    userTop.current = userId?.offsetTop
    // slidingDistance.current = userTop.current - slidingBlock.current.scrollTop

    // 判断是否是首次进入
    if (onesOpen.current === 1) {
      // 是的话直接移动到需要的距离
      slidingBlock.current.scrollTop = userTop.current
    } else {
      // 否则滑动动画函数
      topScroll()
    }

    // 改变初始渲染值
    onesOpen.current = 2
  }, [id])

  // 事件函数
  // ================================================================
  // 区域滑动函数
  const boxScroll = (e) => {
    let boxHeight = e.target.offsetHeight // 滑动区域的真实高度
    let boxScrollTop = e.target.scrollTop // 目前滑动的距离
    let boxScrollHeight = e.target.scrollHeight // 滚动条总高度

    // 使用父级滚动回调函数，返回 boxHeight 滑动区域的真实高度；boxScrollTop 目前滑动的距离；boxScrollHeight 滚动条总高度
    scroll(boxHeight, boxScrollTop, boxScrollHeight)

    if (boxScrollHeight <= boxHeight + boxScrollTop) {
      // 犯错写法，防止某个元素需要滚动到顶部，但是已经整体已经到底部了，还在触发定时器，故做次防错
      // cancelAnimationFrame(timer.current)
      // 滑动到底部触发函数
      scrollBottom()
    }
  }

  // 否则滑动动画函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const topScroll = () => {
    // slidingBlock.current.scrollTo({ top: userTop.current, behavior: 'smooth' })

    slidingBlock.current.scrollTop = userTop.current

    // // 判断距离差值是否大于0
    // if (slidingDistance.current > 0) {
    //   // 是的话进行相加
    //   slidingBlock.current.scrollTop += userTop.current / 70
    // } else if (slidingDistance.current < 0) {
    //   // 若是小于0，则进行相减
    //   slidingBlock.current.scrollTop -= userTop.current / 70
    // }

    // // 判断是否已经滚动到了需要的高度值
    // if (slidingBlock.current.scrollTop <= userTop.current) {
    //   // 不是的话,进行触发函数
    //   timer.current = requestAnimationFrame(topScroll)
    // } else {
    //   // 是的话则清理定时器
    //   cancelAnimationFrame(timer.current)
    // }
  }

  return (
    <div
      className="slidingBlock"
      style={boxStyle}
      onScroll={boxScroll}
      ref={slidingBlock}
    >
      {children}
    </div>
  )
}

export default React.memo(SlidingBlock)
