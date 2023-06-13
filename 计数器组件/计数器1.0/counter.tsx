/*计数器组件

*传入参数
  max : 最大值  --number
  min : 最小值 默认0，最低也不会低于0  --number
  defaultNumber : 默认展示值  默认展示值 默认为0  --number
  selfIncrement : 自增量，默认1，且必须是正整数，否则只取小数点前的数量，为0时取1  --number
  timeout : 回调函数的防抖时间 默认时间0.5s  --number
  disabled : 是否开启禁用状态 默认false （true开启 false关闭）  --boolean
  manual : 是否开启输入模式 默认true （true开启 false关闭）  --boolean

*交互方法
userNeedNumber : 父组件回调函数，返回目前用户输入的内容值nowNumber

***用法介绍***
1、目前增减和展示数据，只能支持正整数
2、目前不支持自定义样式输入，若是需要修改样式，可以将此组件进行样式进行自行修改
3、若是显示数字在自增量的加减过程中，超过或低于了最大值、最小值，则按照设置的最大值，最小值进行展示

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useEffect, useRef, useState } from 'react'
import './counter.css' // 引入样式

// 组件引入
// ------------------------------------------------------------------------------
import Button from './components/button/button' // 引入按键组件

// prop接口
interface Props {
  max?: number
  min?: number
  defaultNumber?: number
  selfIncrement?: number
  timeout?: number
  disabled?: boolean
  manual?: boolean
  userNeedNumber?: (nowNumber: number) => void
}

const Counter: React.FC<Props> = (props) => {
  // 参数结构
  const {
    max, // 最大值
    min = 0, // 最小值 默认0，最低也不会低于0
    defaultNumber = 0, // 默认展示值 默认为0
    selfIncrement = 1, // 自增量，默认1，且必须是正整数，否则只取小数点前的数量，为0时取1
    timeout = 0.5, // 回调函数的防抖时间 默认时间0.5s
    disabled = false, // 是否开启禁用状态 默认false （true开启 false关闭）
    manual = true, // 是否开启输入模式 默认true （true开启 false关闭）

    userNeedNumber = (nowNumber: number) => {}, // 父组件回调函数，返回目前用户输入的内容值nowNumber
  } = props

  // 变量声明区
  // ------------------------------------------------------------------------------
  // 左边按键自定义样式
  const leftStyle = {
    buttonStyle: {
      padding: '0',
      height: '100%',
      width: '30%',
      backgroundColor: '#F4F7FA',
      borderRadius: '8px 0 0 8px',
    },
    textStyle: {
      fontSize: '30px',
      fontWeight: '500',
      color: disabled ? '#E4E7EC' : '#606266',
    },
  }

  // 右边按键自定义样式
  const rightStyle = {
    buttonStyle: {
      padding: '0',
      height: '100%',
      width: '30%',
      backgroundColor: '#F4F7FA',
      borderRadius: '0 8px 8px 0',
    },
    textStyle: {
      fontSize: '30px',
      fontWeight: '500',
      color: disabled ? '#E4E7EC' : '#606266',
    },
  } // 右边按键自定义样式

  // ref声明
  // ================================================================
  const errorProofingInput = useRef(null) // 输入框输入防错值
  const timer = useRef(null) // 防抖定时器承接值

  // 状态声明
  // ================================================================
  const [inputText, setInputText] = useState('') // input双向绑定值

  // 函数使用区
  // ------------------------------------------------------------------------------
  // hook函数
  // ================================================================
  // 绑定初始值,并进行错误提示
  useEffect(() => {
    // 判断此初始值是否是数字，并且这个数字大于或者=0 ,或者初始值defaultNumber 小于 最小值min
    if (typeof defaultNumber === 'number' && defaultNumber >= 0) {
      // 是的话则进行绑定显示
      setInputText(String(defaultNumber))
      // 否则对其错误进行抛出显示提醒
    } else if (typeof defaultNumber !== 'number') {
      console.error('请输入 Number 类型的初始值')
      setInputText('0')
    } else if (defaultNumber < 0) {
      console.error('初始值最小只能为 0')
      setInputText('0')
    } else if (defaultNumber < min && min >= 0) {
      console.error(
        '初始值不能比小于最小值，请赋予正确的默认值,否则将以最小值进行展示'
      )
      setInputText(String(min))
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (min < 0 || min !== parseInt(String(min))) {
      throw new Error('最小值只能为正整数，请重新设置')
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if ((max < 0 || max !== parseInt(String(max))) && max) {
      throw new Error('最大值只能为正整数，请重新设置')
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (max === min) {
      throw new Error('最大值和最小值不能相等，请重新设置')
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (max === 0) {
      throw new Error('最大值不能等于0，请重新设置')
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (defaultNumber > max && max >= 0) {
      console.error(
        '默认值不能大于最大值，请赋予正确的默认值，否则将以最大值进行展示'
      )
      setInputText(String(max))
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (
      selfIncrement !== parseInt(String(selfIncrement)) ||
      selfIncrement <= 0
    ) {
      console.error('自增量只能是正整数，不是小数或负数或0，请赋予正确的值！！')
    }
  }, [defaultNumber, max, min, selfIncrement])

  // 监听 inputText 输入内容的变化，进行带入 errorProofingInput 进行防错处理,并添加防抖方法，给父级回调函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  useEffect(() => {
    errorProofingInput.current = inputText

    // 判断是否有定时器存在，有的话则进行清理
    if (timer.current) {
      clearTimeout(timer.current)
    }

    // 给防抖定时器赋予，一次性定时器
    timer.current = setTimeout(() => {
      // 使用父级回调函数，返回当前的内容值
      userNeedNumber(Number(inputText))
    }, timeout * 1000)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText])

  // 事件函数
  // ================================================================
  // 左边按键点击函数
  const leftBtn = () => {
    // 为当前值-自增量的正整数值
    let nowText =
      Number(errorProofingInput.current) -
      parseInt(String(selfIncrement < 0 ? 1 : selfIncrement))

    // 使用更新视图函数
    updateText(nowText)
  }

  // input框输入内容变化函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const userInput = (e) => {
    // 声明一个变量用来承接此时输入的内容，并且此内容只能是正整数
    let nowText = ''
    nowText = e.target.value.replace(/^(0+)|[^\d]+/g, '')

    // 使用文字更新函数
    updateText(Number(nowText))
  }

  // 文字更新函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const updateText = (nowString: number) => {
    // 首先判断是否 最小值 低于0
    if (min < 0) {
      // 是的话直接显示为0
      setInputText('0')

      // 其次判断输入的内容是否小于了min
    } else if (nowString < min) {
      // 是的话直接显示min
      setInputText(String(min))

      // 然后判断是否大于了 max
    } else if (nowString > max) {
      // 是的话直接显示max
      setInputText(String(max))

      // 正常情况下，就直接赋值
    } else {
      setInputText(String(nowString))
    }
  }

  // 右边按键点击函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const rightBtn = () => {
    // 为当前值+自增量的正整数值
    let nowText =
      Number(errorProofingInput.current) +
      parseInt(String(selfIncrement < 0 ? 1 : selfIncrement))

    // 使用更新视图函数
    updateText(nowText)
  }

  return (
    <div className="counter">
      {/* 左边 - 运算符 */}
      <Button
        {...leftStyle}
        disabled={
          (min >= 0 ? Number(inputText) <= min : Number(inputText) <= 0) ||
          disabled
        }
        onButton={leftBtn}
      >
        －
      </Button>

      {/* 中间 数字显示 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className="counter-const">
        {/* 用户输入框 */}
        <input
          className={`counter-const-input ${
            disabled ? 'counter-const-input-disabled' : ''
          }`}
          type="text"
          onChange={userInput}
          value={inputText}
          disabled={!manual}
          style={{ color: disabled ? '#c0c4cc' : '' }}
        />
      </div>
      {/* 右边 + 运算符 */}
      {/* ------------------------------------------------------------------------------ */}
      <Button
        {...rightStyle}
        disabled={max ? Number(inputText) >= max || disabled : false}
        onButton={rightBtn}
      >
        ＋
      </Button>
    </div>
  )
}

export default React.memo(Counter)
