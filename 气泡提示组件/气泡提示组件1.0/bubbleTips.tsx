/* 气泡提示组件
 *传入参数
  type : 代表气泡呈现的方式 （left : 左边 ； right : 右边 ； bottom : 下方 ； top : 上方） 默认 bottom  --string
  triangleSize : 三角形的大小  默认 8px  --string
  constStyle : 内容部分的 style 样式 具体内容根据 type constStyle进行设置  默认:{backgroundColor: "#0808",textAlign: "center"}  --objeck
  animationHide : 动画隐藏模式，开启后，此组件则会隐藏，配合 animationSwitch 进行展示 默认false  --boolean
  animationSwitch : 动画开关，（true 打开展示 ； false  隐藏展示） 默认false  --boolean

  ***用法介绍***
  1、直接运用插槽的方式进行内容展示  （注：此接受 元素节点，不仅仅是字符串，但是只接受第一个成员）
     例子 ： <Bubble>
             这是传入内容
            </Bubble>
  2、如果开启animationHide模式后，组件会默认隐藏，只要配合animationSwitch进行展示或隐藏
  3、animationSwitch只能在 animationHide模式 下才有效果，只需要在父级改变此参数进行控制该组件的展示或隐藏
            
 */

import React, { useRef, useEffect } from 'react'
import './bubbleTips.css' // 引入样式

// prop接口
// ------------------------------------------------------------------------------
interface Props {
  children?: any
  type?: string
  triangleSize?: string
  constStyle?: constStyle // 使用下方type定义的属性类型
  animationHide?: boolean
  animationSwitch?: boolean
}

type constStyle = {
  textAlign?: any //本应该是string，但会出现ts报错，故采取用any
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  borderRadius?: string
  padding?: string
  maxWidth?: string
  maxHeight?: string
  minWidth?: string
  minHeight?: string
}

const BubbleTips = (props: Props) => {
  // 传入参数结构
  const {
    children, // 用于插槽属性
    type = 'right', // 代表气泡呈现的方式 （left : 左边 ； right : 右边 ； bottom : 下方 ； top : 上方） 默认 bottom
    triangleSize = '8px', // 三角形的大小
    constStyle = {
      backgroundColor: '#0808',
      textAlign: 'center',
    }, // 内容部分的 style 样式 具体内容根据 type constStyle进行设置
    animationHide = false, // 动画隐藏模式，开启后，此组件则会隐藏，配合 animationSwitch 进行展示 默认false
    animationSwitch = false, // 动画开关，（true 打开展示 ； false  隐藏展示） 默认false
  } = props

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const bubbleTips = useRef(null) // 获取整个组件外层ref，用于后续改变

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 监听 animationSwitch 动画开关，判断是否开启
  useEffect(() => {
    // 如果开启了
    if (animationSwitch) {
      bubbleTips.current.style.display = 'inline-flex' // 改变 外层的样式为弹性盒子

      // 在用异步方法，改变为呈现的样式
      setTimeout(() => {
        // 改变 transform 并根据type中的参数进行判断该怎么缩放
        bubbleTips.current.style.transform = animationHide
          ? animationSwitch && (type === 'left' || type === 'right')
            ? 'scaleX(1)'
            : animationSwitch && (type === 'top' || type === 'bottom')
            ? 'scaleY(1)'
            : ''
          : ''
        // 改变透明度
        bubbleTips.current.style.opacity = 1
      })

      // 选择关闭的话，则将所有样式还原
    } else {
      bubbleTips.current.style.transform = bubbleTips.current.style.opacity = ''
      // 在动画完成后，还原该盒子为none
      setTimeout(() => {
        bubbleTips.current.style.display = ''
      }, 300)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationSwitch])

  return (
    /*组件包裹外层
     *根据 type的传入属性，进行判断 该盒子的 flex 布局是否需要更换主轴的css样式
     *根据 animationHide 动画模式的判断是否展示 animationHide css
     *根据 animationHide 和 type 的属性结合，进行判断对应的初始化排版css
     */
    <div
      className={`bubbleTips ${
        type === 'top' || type === 'bottom' ? 'topAndBottom' : ''
      }  ${animationHide ? 'animationHide' : ''} ${
        animationHide
          ? type === 'left' || type === 'right'
            ? 'animationHideX'
            : 'animationHideY'
          : ''
      }`}
      ref={bubbleTips}
    >
      {/* 三角形
       *triangleSize 为此三角形的大小
       *根据type的属性更换展示三角形的方向，用来匹配下方内容区域
       *根据type属性 进行改变 自身 flex布局中 order 的参数 达到对应的展示
       */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="bubbleTips-triangle"
        style={{
          borderLeft: `${triangleSize} solid ${
            type !== 'left' ? 'transparent' : constStyle.backgroundColor
          }`,
          borderRight: `${triangleSize} solid ${
            type !== 'right' ? 'transparent' : constStyle.backgroundColor
          }`,
          borderTop: `${triangleSize} solid ${
            type !== 'top' ? 'transparent' : constStyle.backgroundColor
          }`,
          borderBottom: `${triangleSize} solid ${
            type !== 'bottom' ? 'transparent' : constStyle.backgroundColor
          }`,
          order: type === 'left' || type === 'top' ? '1' : '',
        }}
      ></div>

      {/* 内容区域
       *根据type属性 进行改变 自身 flex布局中 order 的参数 达到对应的展示
       *constStyle只能传入的style内容在上方接口中有定义
       *根据插槽中的成员进行在下方区域展示
       */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="bubbleTips-const"
        style={{
          order: type === 'left' || type === 'top' ? '0' : '',
          ...constStyle,
        }}
      >
        {children || children[0]}
      </div>
    </div>
  )
}

// 导出时进行性能优化
export default React.memo(BubbleTips)
