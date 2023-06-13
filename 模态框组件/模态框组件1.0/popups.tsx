/* 模态框组件

*传入参数
 popupsColor : 模态框的背景颜色 建议rgba格式  默认（rgba(0,0,0,0.3)）  --string
 zIndex : 模态框弹窗的层级 默认9999  --number
 type : 模态框展示方向 传入参数（left:从左边; right:从右边; center:居中; bottom:从下方; top:从上方）默认center  --string
 animation : 是否开启动画 （开启true ； 关闭false） 默认true  --boolean
 blankClick : 是否开启空白区域点击关闭模态框 （允许关闭true ； 不允许false） 默认true  --boolean
 pageSwipe : 弹窗开启后，是否允许遮挡页面滑动 （允许滑动true ； 不允许false） 默认false  --boolean

***用法介绍***
 1、使用时只需要在组件声明之间插入需要书写的节点内容  
     例子：<Popups ref={popups}>
             <div>22222</div>
           </Popups>

 2、需要进行开启弹窗则按照ref的形式进行  
     例子：popups.current.popupsOpen();

 2、需要进行关闭弹窗则按照ref的形式进行  
     例子：popups.current.popupsHide();

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import './popups.css' // 引入样式

// prop接口
interface Props {
  children?: any
  popupsColor?: string
  zIndex?: number
  type?: string
  animation?: boolean
  blankClick?: boolean
  pageSwipe?: boolean
}

// 使用forwardRef方法创建一个组件
const Popups = forwardRef((props: Props, ref: HTMLDivElement) => {
  // 传入参数结构
  const {
    popupsColor = 'rgba(0,0,0,0.3)', // 模态框的背景颜色 建议rgba格式  默认（rgba(0,0,0,0.3)）
    zIndex = 9999, // 模态框弹窗的层级 默认9999
    type = 'center', // 模态框展示方向 传入参数（left:从左边; right:从右边; center:居中; bottom:从下方; top:从上方）默认center
    animation = true, // 是否开启动画 （开启true ； 关闭false） 默认true
    blankClick = true, // 是否开启空白区域点击关闭模态框 （允许关闭true ； 不允许false） 默认true
    pageSwipe = false, // 弹窗开启后，是否允许遮挡页面滑动 （允许滑动true ； 不允许false） 默认false
  } = props

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [popupsShow, setPopupsShow] = useState(false) // 控制打开或关闭模态框开关  默认false关闭
  const popupsBox = useRef(null) // 获取模态框外层的ref
  const popupsBoxItem = useRef(null) // 获取模态框展示区域的内容ref

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 暴露给父组件的方法
  // ================================================================
  useImperativeHandle(ref, () => ({
    // 打开模态框函数
    popupsOpen() {
      setPopupsShow(true)
      // 判断是否需要开启遮挡页面不能滑动，是的话执行阻挡函数
      !pageSwipe && openPageSwipe()
    },
    // 关闭模态框函数
    popupsHide() {
      setPopupsShow(false)
      // 判断是否需要开启遮挡页面不能滑动，是的话执行关闭阻挡函数
      !pageSwipe && closurePageSwipe()
    },
  }))

  // 监听控制打开或关闭模态框按键
  // ================================================================
  useEffect(() => {
    // 先判断是否开启了动画
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    if (animation) {
      // 判断是否打开了弹窗
      if (popupsShow) {
        popupsBox.current.style.display = 'flex' // 将弹窗改为flex

        // 采用异步的方法，将弹窗进行展示
        setTimeout(() => {
          popupsBox.current.style.opacity = 1 // 先展示外层空白区域

          // 然后在使用异步的方法将成员进行展示
          setTimeout(() => {
            // 先判断是否说center居中展示
            if (type === 'center') {
              popupsBoxItem.current.style.animationName = 'popusItemOpen' // 绑定动画名称

              // 不是居中情况下
            } else {
              // 改变成员的平移属性，left 和 right 改变X轴，top 和 bottom 改变Y轴
              popupsBoxItem.current.style.transform =
                type === 'left' || type === 'right'
                  ? 'translateX(0)'
                  : 'translateY(0)'
            }
          }, 300)
        })

        // 关闭弹窗时
      } else {
        // 先判断是否说center居中展示
        if (type === 'center') {
          popupsBoxItem.current.style.animationName = 'popusItemHide' // 绑定动画名称

          // 按照定时器清空动画名称 （若不清空会造成再次开启动画时的，重复bug）
          setTimeout(() => {
            popupsBoxItem.current.style.animationName = '' // 绑定动画名称
          }, 300)

          // 不是居中情况下
        } else {
          // 清空style中transfrom的设置
          popupsBoxItem.current.style.transform = ''
        }

        setTimeout(() => {
          popupsBox.current.style.opacity = 0 // 先展示外层空白区域
          setTimeout(() => {
            popupsBox.current.style.display = '' // 将弹窗改为flex
          }, 300)
        }, 300)
      }

      // 不需要动画展示的话
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    } else {
      // 判断是否打开了弹窗
      if (popupsShow) {
        popupsBox.current.style.display = 'flex' // 将弹窗改为flex
        popupsBox.current.style.opacity = 1 // 呈现之前隐藏的透明图

        // 关闭弹窗时
      } else {
        popupsBox.current.style.display = '' // 将弹窗改为flex
        popupsBox.current.style.opacity = 0 // 呈现之前隐藏的透明图
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupsShow])

  // 事件函数区
  // ================================================================
  // 外层空白区域点击函数
  const blank = () => {
    //  判断是否开启了 空白区域点击关闭模态框
    if (blankClick) {
      // 只有开启的时候，才能执行关闭模态框
      setPopupsShow(false)
    }
  }

  // 开启遮挡页面禁止滑动函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const openPageSwipe = () => {
    // 给html标签绑定高度+让其不能滑动
    document.documentElement.style.height = '100%'
    document.documentElement.style.overflow = 'hidden'
    // 修改body的高度+让其不能进行滑动
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
  }

  // 关闭遮挡页面禁止滑动函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const closurePageSwipe = () => {
    // 给html标签绑定高度+让其不能滑动
    document.documentElement.style.height = ''
    document.documentElement.style.overflow = ''
    // 修改body的高度+让其不能进行滑动
    document.body.style.height = ''
    document.body.style.overflow = ''
  }

  return (
    /*模态框外层空白区域
     *根据type传入的属性，进行判断初始化展示那个方向的css样式
     *自身的背景颜色 和 层级可以根据 backgroundColor；zIndex 进行自定义赋予
     *根据 animation 开关控制是否需要进行动画的展示
     *绑定 useRef 元素 popusBox 方便进行属性操作
     *外层的点击函数，只是为了控制是否进行关闭此弹框使用
     */
    <div
      className={`popus ${
        type === 'left'
          ? 'left'
          : type === 'right'
          ? 'right'
          : type === 'bottom'
          ? 'bottom'
          : type === 'top'
          ? 'top'
          : 'center'
      }`}
      style={{
        backgroundColor: popupsColor,
        zIndex: zIndex,
        transition: animation ? 'all 0.3s linear' : '',
      }}
      ref={popupsBox}
      onClick={blank}
    >
      {/* 内容展示区域
       *同上方一样 根据type 传入的属性进行展示初始化css；但是此区域额外会根据 animation（是否开启动画）进行判断，如果开启了，才有初始化css，否则就不会添加。
       *style中这是根据动画开关animation，与是否是居中显示进行决定怎么展示动画，注意：居中展示动画和其他方式不一样。
       *绑定useRef 元素 popusBoxItem 方便后续操作。
       *运用插槽方式，进行插入我们需要的内容，但只会接收第一个元素，否则没有效果。
       *此元素做了阻止点击冒泡事件，防止出现，点击内部元素，产生click冒泡后，带来的不必要bug
       */}
      <div
        className={`popus-item ${
          animation
            ? type === 'left'
              ? 'item-left'
              : type === 'right'
              ? 'item-right'
              : type === 'bottom'
              ? 'item-bottom'
              : type === 'top'
              ? 'item-top'
              : 'item-center'
            : ''
        }`}
        style={{
          transition: animation && type !== 'center' ? 'all 0.3s linear' : '',
        }}
        ref={popupsBoxItem}
        // 此点击函数代表内部承接的元素，若是有click函数的冒泡父级
        onClick={(e) => {
          // 阻止事件冒泡
          e.stopPropagation()
        }}
      >
        {props.children}
      </div>
    </div>
  )
})

// 导出时进行性能优化
export default React.memo(Popups)
