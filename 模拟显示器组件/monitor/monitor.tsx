/**
 * 
 * @显示器组件
 * 
 * @传入参数 
 *  displayList : 显示数组,默认[]  --Array
    monitorClass : 外层额外自定义的css,默认''  --string
    monitorWidth : 外层自定义的宽度  --number
    monitorHeight : 外层自定义的高度  --number
    showPointsClass : 显示点的额外自定义css,默认''  --string
    showPointsColor : 显示点的默认展示背景颜色,默认'#fff'  --string
    showPointsWidth : 显示点的自定义宽度  --number
    showPointsHeight : 显示点的自定义高度  --number
    portrait : 行数,默认20  --number
    transverse : 列数,默认20  --number
    gap : 间隔距离  --number
    gapColor : 间隔颜色  --string
    sizeCompany : 比例单位,默认'rem'  --string
 * 
 * @交互方法
 *  // 回调方法
    // ------------------------------------------------------------------------------
    // 显示器更新回调函数，传入一个对象包含最新的展示数据数组+当前显示器状态+改变后的显示点信息,作为回调参数
    monitorUpdate

    // ref抛出Api
    // ------------------------------------------------------------------------------
\   portrait : 行数
    transverse : 列数
    init : 显示器重置函数
    showRanksStatusQuery : 显示行列状态查询函数
    appointPointStatusQuery : 指定显示点状态查询函数
    appointRanksStatusQuery : 指定行列状态查询函数
    deleteShowPoints : 显示点单独清除函数
    deletePortraitTransverse : 显示行列公共清除函数

  ***用法介绍***
  只需要按照通常组件传参即可，若是有其他筛选或删除的一些操作可以使用ref得到封装好的api信息，api具体的使用可下移观看对应的详细备注
*/

// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react'
import './monitor.css'

// 公共方法
// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
import { deepClone } from './index'

// ts接口
// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
import {
  Props,
  displayListItemConst,
  RefReturn,
  displayListItem,
  AppointPointStatusQueryParameter,
  showRanksStatusQueryRuleObj,
  AppointRanksStatusQueryReturn,
} from './interface'

const Monitor = forwardRef((props: Props, ref) => {
  // 参数结构
  const {
    displayList = [], // 显示数组
    monitorClass = '', // 外层额外自定义的css
    monitorWidth, // 外层自定义的宽度
    monitorHeight, // 外层自定义的高度
    showPointsClass = '', // 显示点的额外自定义css
    showPointsColor = '#fff', // 显示点的默认展示背景颜色
    showPointsWidth, // 显示点的自定义宽度
    showPointsHeight, // 显示点的自定义高度
    portrait = 20, // 行数
    transverse = 10, // 列数
    gap, // 间隔距离
    gapColor, // 间隔颜色
    sizeCompany = 'rem', // 比例单位

    // 回调方法
    // ------------------------------------------------------------------------------
    // 显示器更新回调函数，传入一个对象包含最新的展示数据数组+当前显示器状态+改变后的显示点信息
    monitorUpdate = (data) => {},
  } = props

  // 变量声明区
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  // ref声明
  const showPointsList = useRef<displayListItem>(null) // 所有改变后显示点承接集合数组
  const newestShowList = useRef<Array<displayListItem>>(null) // 最新屏幕展示数据承接数组
  const startShowList = useRef<JSX.Element[]>(null) // 初始化dom承接数组
  const monitorState = useRef<string>(null) // 当前显示器的状态，同步下方刷新函数的type值+行列删除对应的状态

  // 状态声明
  // ------------------------------------------------------------------------------
  const [monitorFromList, setMonitorFromList] = useState<JSX.Element[]>(null) // 显示器组成渲染数组

  // 内存声明区
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  // 初始化渲染的数组，保存在内存中防止多次调用损耗性能
  const initShowList = useMemo<Array<displayListItem>>(() => {
    let undertakingList: Array<displayListItem> = [] // 生成数据承接数组

    // 循环行数
    // ================================================================
    for (let num = 0; num < portrait; num++) {
      let itemList: displayListItem = [] // 渲染成员的承接数组

      // 循环列数
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      for (let index = 0; index < transverse; index++) {
        // 成员初始化的渲染对象
        let itemShowObj: displayListItemConst = {
          portrait: num,
          transverse: index,
          color: showPointsColor,
          identifier: '',
          customCss: '',
        }
        // 将创建好的渲染对象放入渲染成员的承接数组中
        itemList.push(itemShowObj)
      }

      // 将处理好的每个渲染成员承接数组放入 生成数据承接数组
      // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
      undertakingList.push(itemList)
    }

    return undertakingList
  }, [portrait, showPointsColor, transverse])

  // 函数使用区
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  // 暴露给父组件的方法
  useImperativeHandle(
    ref,
    (): RefReturn => ({
      // 行数
      portrait,

      // 列数
      // ================================================================
      transverse,

      /**
       * @显示器重置函数
       * 用于将当前显示器所有点恢复为默认展示颜色
       */
      // ================================================================
      init() {
        // 调用刷新函数进行重置
        refreshMonitor('init')
      },

      /**
       * @显示行列状态查询函数
       * @target字符串参数指定查询类型
       * portrait:查询现有已经完全显示的行 -- 默认属性
       * transverse:查询现有已经完全显示的列
       * ranks:查询现有完全显示的行+列
       * @返回为一个数值数值或一个对象
       * 当是 portrait 或 transverse 模式时返回当前已经完全显示的行数或列数组成的数组
       * 当为ranks参数时，返回一个由 portrait 和 transverse 组成的对象
       * 如果没有完全铺满的行或列，返回对应的数组为[]
       */
      // ================================================================
      showRanksStatusQuery(target = 'portrait') {
        // 首先判断是否传入了正确的参数，如果没有直接弹出警告
        if (
          target !== 'portrait' &&
          target !== 'transverse' &&
          target !== 'ranks'
        ) {
          console.error(
            '请传入正确的参数！！！ portrait:查询现有已经完全显示的行  transverse:查询现有已经完全显示的列  ranks:查询现有完全显示的行+列'
          )
          return
        }

        // 如果有正确的参数，则进行声明一个规则类型产生的规则内容对象
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        let ruleObj: showRanksStatusQueryRuleObj = {
          portrait: [],
          transverse: [],
          ranks: { portrait: [], transverse: [] },
        }

        // 判断当前显示器中显示的个数是否是小于一列展示是数据，如果是则一定都是空的，直接返回
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (showPointsList.current.length < transverse) {
          return ruleObj[target]
        }

        // 声明一个承接列后续处理的数据数组
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        let transverseList: number[] = []

        // 只有显示个数超过一列的数量才进行遍历  newestShowList
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        newestShowList.current.forEach((value, index) => {
          // 声明一个变量承接对应所有成员都是点亮了
          let ifMaxPortrait = value.every((val, ind) => {
            // 判断如果是显示的点时，将他对应的坐标传入 transverseList 方便进行统计后续列的数量
            val.color !== showPointsColor && transverseList.push(ind)

            return val.color !== showPointsColor
          })

          // 当 ifMaxPortrait 存在时，则进行对 ruleObj 进行对应赋值操作
          ifMaxPortrait && ruleObj.portrait.push(index)
        })

        // 将全部数组ranks进行同步
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        ruleObj.ranks.portrait = ruleObj.portrait

        // 判断 列后续处理的数据数组 的长度是否存在，且此长度小于了目前显示器总行数的直接将现有的数据进行弹出
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (!transverseList.length && transverseList.length < portrait) {
          return ruleObj[target]
        }

        // 如果 transverseList列后续处理的数据数组 长度超过了总的行数，那么对其进行正序排序，并对其遍历
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        transverseList
          .sort((x, y) => x - y)
          .forEach((value, index) => {
            // 声明一个变量承接此成员上的值最初出现的位置与最后出现位置的差值+1是否是大于或者等于总行数的
            let needIndex =
              transverseList.lastIndexOf(value) -
                transverseList.indexOf(value) +
                1 >=
              portrait

            // 如果 needIndex 为正，且此值在对应的规则列数组中已不存在，则将其push进去
            needIndex &&
              !ruleObj.transverse.includes(value) &&
              ruleObj.transverse.push(value)
          })

        // 同步一下在ranks属性中的对应参数
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        ruleObj.ranks.transverse = ruleObj.transverse

        // 弹出最终的结果值
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        return ruleObj[target]
      },

      /**
       * @指定显示点状态查询函数
       * @appointPoints可以是一个对象也可以是个数组
       * 对象时为单点查询，返回一个布尔值标识，代表此查询的显示点是否是点亮了的
       * 数组时为批量筛选模式，返回一个数组，对每个对应的筛选成员显示状态进行一一对应的返回
       * @返回的数组或布尔值取决于筛选的点是否被点亮
       */
      // ================================================================
      appointPointStatusQuery(appointPoints) {
        // 判断传入的参数是否是数组且其有长度
        if (
          (appointPoints instanceof Array && !appointPoints.length) ||
          !appointPoints ||
          (appointPoints instanceof Object &&
            !Object.keys(appointPoints).length)
        ) {
          console.error('传入的参数不能为空且不能为[]或{}')

          return false
        }

        // 判断当此参数为一个数组的时候
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (appointPoints instanceof Array) {
          // 创建一个结果承接数组
          let resultList: boolean[] = []

          // 对传入的参数进行循环判断
          appointPoints.forEach((value, index) => {
            // 先对是否有超过屏幕的点进行判断，有的话进行报错提醒
            if (
              value.portrait >= portrait ||
              value.portrait < 0 ||
              value.transverse >= transverse ||
              value.transverse < 0
            ) {
              console.error(
                '存在传入参数值超过了屏幕的显示区域，请检查传入的内容，此处错误信息的成员位置为' +
                  index
              )
            }

            // 将筛选内容加入成员
            resultList.push(
              // 首先进行判断，此时循环的点是否都是满足在区域内的，如果没有则直接返回false，有的话则进行正常的逻辑判断
              value.portrait < portrait &&
                value.portrait > 0 &&
                value.transverse < transverse &&
                value.transverse > 0
                ? // 将对应的逻辑判断结果进行push进结果承接数组中，点亮了true，没有则是false
                  newestShowList.current[value.portrait][value.transverse]
                    ?.color !== showPointsColor
                : false
            )
          })

          // 将最后的结果进行返回
          return resultList
        }

        // 判断当传入的参数是对象时，即为一个点的查询情况
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (appointPoints instanceof Object) {
          const content =
            appointPoints as unknown as AppointPointStatusQueryParameter

          // 先对是否有超过屏幕的点进行判断，有的话进行报错提醒
          if (
            content.portrait >= portrait ||
            content.portrait < 0 ||
            content.transverse >= transverse ||
            content.transverse < 0
          ) {
            console.error(
              '存在传入参数值超过了屏幕的显示区域，请检查传入的内容,此点坐标为;portrait:' +
                content.portrait +
                ';' +
                'transverse:' +
                content.transverse
            )
          }

          return (
            // 首先进行判断，此时循环的点是否都是满足在区域内的，如果没有则直接返回false，有的话则进行正常的逻辑判断
            content.portrait < portrait &&
              content.portrait > 0 &&
              content.transverse < transverse &&
              content.transverse > 0
              ? // 判断其这个点是否是点亮了的并将其结果弹出，点亮了true，没有则是false
                newestShowList.current[content.portrait][content.transverse]
                  ?.color !== showPointsColor
              : false
          )
        }
      },

      /**
       * @指定行列状态查询函数
       * @appointTarget参数为一个对象_存在两个成员
       * portraits:查询的行具体数值或者组成的批量化数组
       * transverses:查询的列的具体数值或组成的批量化数组
       */
      // ================================================================
      appointRanksStatusQuery({ portraits, transverses }) {
        // 创建一个结果生成的对象
        let resultObj: AppointRanksStatusQueryReturn = {
          portrait: [],
          transverse: [],
        }

        // 判断 portraits 为数值时
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (portraits instanceof Number) {
          // 声明判断承接的变量进行承接最后的判断结果
          let ifPortraits = newestShowList.current[portraits as number]?.every(
            (value) => {
              // 弹出判断条件，即当前的值不是默认颜色
              return value.color !== showPointsColor
            }
          )

          // 将对应的参数赋予给返回的内容对象中
          resultObj.portrait = ifPortraits
        }

        // 判断 portraits 为数组时
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (portraits instanceof Array) {
          portraits.forEach((value, index) => {
            // 声明判断承接的变量进行承接最后的判断结果
            let ifPortraits = newestShowList.current[value]?.every((val) => {
              return val.color !== showPointsColor
            })

            // 将对应的参数赋予给返回的内容对象中
            resultObj.portrait[index] = ifPortraits
          })
        }

        // 判断 transverses 为数值时
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (transverses instanceof Number) {
          // 声明一个判断列承接的状态数组
          let ifRutsList: boolean[] = []

          // 对 newestShowList 数组进行遍历
          newestShowList.current?.forEach((value) => {
            // 使用变量承接里面的对于列完全改变的判断结果
            let ifRulst =
              value[transverses as unknown as number].color !== showPointsColor

            // 将结果push进结果数组中
            ifRutsList.push(ifRulst)
          })

          // 将最后的判断结果同步给 resultObj 的对应位置
          resultObj.transverse = ifRutsList.every((value) => value)
        }

        // 判断 transverses 为数组时
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (transverses instanceof Array) {
          let resultObjRutsList: boolean[] = []
          transverses.forEach((value) => {
            // 声明一个判断列承接的状态数组
            let ifRutsList: boolean[] = []

            // 对 newestShowList 数组进行遍历
            newestShowList.current?.forEach((val) => {
              // 使用变量承接里面的对于列完全改变的判断结果
              let ifRulst = val[value].color !== showPointsColor

              // 将结果push进结果数组中
              ifRutsList.push(ifRulst)
            })

            // 将最后的判断结果弹出
            resultObjRutsList.push(ifRutsList.every((data) => data))
          })

          // 同步对应的结果数组
          resultObj.transverse = resultObjRutsList
        }

        return resultObj
      },

      /**
       * @显示点单独清除函数
       * @list为需要删除的点的集中数组其类型参考displayList的类型
       * @会同步修改当前的组件状态为deleteShowPoint
       */
      // ================================================================
      deleteShowPoints(list) {
        // 判断  目前改变后的显示点承接集合数组 是否有成员，如果没有，则直接弹出
        if (!showPointsList.current.length) {
          return
        }

        // 对数组进行循环，针对其删除点的值进行匹配
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        list.forEach(({ portrait, transverse }) => {
          // 找到 目前改变后的显示点承接集合数组 中需要清除点的具体位置信息
          let needIndex = showPointsList.current.findIndex((value) => {
            // 只有当他们的列数+行数都一样时才会返回
            return (
              value.portrait === portrait && value.transverse === transverse
            )
          })

          // 如果返回的位置信息不为-1的时候，即有这个成员信息的时候，就从 目前改变后的显示点承接集合数组  中删除
          // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
          needIndex !== -1 && showPointsList.current.splice(needIndex, 1)

          // 如果返回的位置信息不为-1的时候，即有这个成员信息的时候，就从 最新展示数据承接数组  中恢复默认颜色
          // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
          needIndex !== -1 &&
            (newestShowList.current[portrait][transverse].color =
              showPointsColor)
        })

        // 当前状态改为删除显示点
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        monitorState.current = 'deleteShowPoint'

        // 对渲染数组重新进行渲染
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        setMonitorFromList(dataChangeDom(newestShowList.current))
      },

      /**
       * @显示行列公共清除函数
       * @ruleObj为一个对象存在portrait或transverse两个参数
       * portrait默认为-1，为需要清除的行的位置数 或 批量删除的位置信息的数组
       * transverse默认为-1，为需要清除的列的位置数 或 批量删除的位置信息的数组
       * 支持单独清理，若只需要清理行则在portrait带上需要删除的具体位置信息，列同理
       * @只是清理了行则改变组件状态为deletePortraits
       * @只是清理了列则改变组件状态为deleteTransverses
       * @行列都清理了则改变组件状态为deletePortraitTransverses
       */
      // ================================================================
      deletePortraitTransverse({ portrait = -1, transverse = -1 }) {
        // 判断都没有传入值，则对其直接弹出
        if (portrait === -1 && transverse === -1) {
          return
        }

        // 判断如果传入了修改行的参数
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (portrait !== -1) {
          let portraitType = typeof portrait // 判断列的类型
          // 判断行传入的是数值还是数组
          if (portraitType === 'number') {
            // 数值时直接调用清除行函数，传入值
            eliminatePortrait(portrait as number)
          } else {
            // 数组时则进行深克隆
            let portraitCloneList: number[] = [
              ...(portrait as unknown as number[]),
            ]

            // 对深克隆的数组进行循环
            portraitCloneList.forEach((value) => {
              // 逐一传入行的参数
              eliminatePortrait(value)
            })
          }

          // 当前状态改为删除行
          monitorState.current = 'deletePortraits'
        }

        // 判断如果传入了列的参数
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        if (transverse !== -1) {
          let transverseType = typeof transverse // 判断行的类型

          if (transverseType === 'number') {
            eliminateTransverse(transverse as number)
          } else {
            // 数组时则进行深克隆
            let transverseCloneList: number[] = [
              ...(transverse as unknown as number[]),
            ]

            // 对深克隆的数组进行循环
            transverseCloneList.forEach((value) => {
              // 逐一传入行的参数
              eliminateTransverse(value)
            })
          }

          // 当前状态改为删除列
          monitorState.current = 'deleteTransverses'
        }

        // 当行列都删除时，将状态改为行列删除
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        portrait !== -1 &&
          transverse !== -1 &&
          (monitorState.current = 'deletePortraitTransverses')

        // 对渲染数组重新进行渲染
        // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
        setMonitorFromList(dataChangeDom(newestShowList.current))
      },
    })
  )

  // hook函数
  // ------------------------------------------------------------------------------
  // 如果初始化数据 initShowList 变化了，则进行刷新操作
  useEffect(() => {
    // 给 初始化dom承接数组 赋值
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    startShowList.current = dataChangeDom(initShowList)

    // 调取刷新函数
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    refreshMonitor()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initShowList])

  // 监听刷新数组的变化，如果改变了则进行调用刷新函数
  // ================================================================
  useEffect(() => {
    // 调取刷新函数
    refreshMonitor()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayList])

  // 监听渲染数组变化，如果改变了，则将 showPointsList newestShowList 数据暴露出去
  // ================================================================
  useEffect(() => {
    // 使用回调函数
    monitorUpdate({
      showPointsList: showPointsList.current,
      monitorState: monitorState.current,
      newestShowList: newestShowList.current,
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitorFromList])

  // 事件函数
  // ------------------------------------------------------------------------------
  /**
   * @显示器刷新函数
   * @type字符串形式的参数
   * init进行显示器初始化
   * refresh进行显示器刷新 --默认值
   */
  const refreshMonitor = (type: string = 'refresh') => {
    showPointsList.current = [] // 初始化 showPointsList 目前改变后的显示点承接集合数组
    monitorState.current = type // 同步当前的状态信息

    // 判断进入的是需要进行什么类型的操作
    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    switch (type) {
      // 进行初始化时，直接将渲染数组进行赋予给 显示器组成渲染数组
      case 'init':
        // 初始化 newestShowList 最新展示数据承接数组
        newestShowList.current = deepClone(initShowList, true)
        // 初始化渲染数据数组
        setMonitorFromList(startShowList.current)
        break

      case 'refresh':
        // 首先判断 渲染是displayList 数组是否有值
        if (displayList.length) {
          // 生成数据承接数组,进行 对初始化数组initShowList 深克隆
          let undertakingList = deepClone(initShowList, true)

          // 对需要渲染的数组进行修改参数处理
          // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
          displayList.forEach((value) => {
            // 判断是否存在超出屏幕的内容区域外的显示点信息，如果没有就进行渲染，有则不会进行渲染
            if (
              value.portrait >= 0 &&
              value.portrait <= portrait - 1 &&
              value.transverse >= 0 &&
              value.transverse <= transverse - 1
            ) {
              // 创建找到的对应坐标点对象信息
              let modifyMsg = undertakingList[value.portrait][value.transverse]

              // 修改对应的对象信息
              modifyMsg.color = value.color
              modifyMsg.identifier = value.identifier

              // 将改变后的点放入 showPointsList 目前改变后的显示点承接集合数组（注意：此只会统计当前屏幕内的点）
              showPointsList.current.push(value)
            }
          })

          // 修改 newestShowList 最新展示数据承接数组
          newestShowList.current = undertakingList

          // 将处理后最新的dom数据赋值给渲染数组
          setMonitorFromList(dataChangeDom(undertakingList))
        } else {
          // displayList 没有内容的话，调起刷新函数的初始化方法
          refreshMonitor('init')
        }
        break

      default:
        break
    }
  }

  /**
   * @节点数组换算为dom节点函数
   * @list处理后的渲染初始化数组
   */
  // ================================================================
  const dataChangeDom = (list: Array<displayListItem>) => {
    // 对深克隆后的数组进行map替换操作，并赋值给 需要弹出的变量needList
    let needList = list.map((value: displayListItem, index: number) => {
      // 对内部显示点成员的数组进行map替换为dom节点，并绑定好对应的值
      let itemDom = value.map((val: displayListItemConst, ind: number) => (
        <span
          className={`${showPointsClass} ${val.customCss}`}
          style={{
            width: showPointsWidth + sizeCompany,
            height: showPointsHeight + sizeCompany,
            backgroundColor: val.color,
          }}
          key={`itemDom${ind}`}
        ></span>
      ))

      // 弹出替换后的每列节点信息，并在其中加上需要的子集dom
      return (
        <div
          className="components_monitor-portrait"
          style={{ gap: gap + sizeCompany }}
          key={`portrait${index}`}
        >
          {itemDom}
        </div>
      )
    })

    // 弹出左后处理好后的变量
    return needList
  }

  /**
   * @清除行的执行函数
   * @portraitNum行的数字
   */
  // ================================================================
  const eliminatePortrait = (portraitNum: number) => {
    // 对 newestShowList最新展示数据承接数组中对应的行套入 进行遍历修改行的内容进行背景颜色的初始化
    newestShowList.current[portraitNum].forEach((value) => {
      value.color = showPointsColor // 进行背景颜色的初始化

      // 找到 目前改变后的显示点承接集合数组 中需要清除点的具体位置信息
      let needIndex = showPointsList.current.findIndex((val) => {
        // 只有当他们的行数都一样时才会返回
        return val.portrait === portraitNum
      })

      // 如果返回的位置信息不为-1的时候，即有这个成员信息的时候，就从 目前改变后的显示点承接集合数组  中删除
      needIndex !== -1 && showPointsList.current.splice(needIndex, 1)
    })
  }

  /**
   * @清除列的执行函数
   * @transverseNum行的数字
   */
  // ================================================================
  const eliminateTransverse = (transverseNum: number) => {
    // 对 newestShowList最新展示数据承接数组 进行遍历
    newestShowList.current.forEach((value, index) => {
      value[transverseNum].color = showPointsColor // 进行背景颜色的初始化

      // 找到 目前改变后的显示点承接集合数组 中需要清除点的具体位置信息
      let needIndex = showPointsList.current.findIndex((val) => {
        // 只有当他们的列数+行数都一样时才会返回
        return val.portrait === index && val.transverse === transverseNum
      })

      // 如果返回的位置信息不为-1的时候，即有这个成员信息的时候，就从 目前改变后的显示点承接集合数组  中删除
      needIndex !== -1 && showPointsList.current.splice(needIndex, 1)
    })
  }

  // html区域
  // ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
  return (
    <div
      className={`components_monitor ${monitorClass}`}
      style={{
        width: monitorWidth + sizeCompany,
        height: monitorHeight + sizeCompany,
        gap: gap + sizeCompany,
        backgroundColor: gapColor,
      }}
    >
      {monitorFromList}
    </div>
  )
})

export default React.memo(Monitor)
