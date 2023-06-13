/**
 * @轻量级按键组件接口
 */
// props接口
export interface Props {
  children?: any // 插槽属性
  buttonCSS?: string // 按键外层css
  changeBackgroundColor?: string // 按键点或按下后背景颜色的变化
  ifLongPress?: boolean // 是否开启长按功能
  longPressTime?: number // 长按功能的触发时间
  isAntiShake?: boolean // 是否开启防抖
  antiShakeTime?: number // 防抖的时间

  // 回调方法
  userClick?: () => void // 执行成功后的回调函数
  longPressEnd?: () => void // 长按抬起按键成功后的回调函数
}

// 弹出给父级的函数接口
export interface RefReturn {
  triggerClick: (type?: string) => void
}
