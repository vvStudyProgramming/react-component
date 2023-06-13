/**
 * @数据深克隆方法_只针对数组或对象
 * @data传入需要深克隆的数据
 */
interface DeepClone {
  <T>(data: T, json?: boolean): T
}

export const deepClone: DeepClone = <T>(data: T, json = false) => {
  // 如果没有参数时，直接弹出并提示错误信息
  if (!data) {
    console.error('未存在深克隆参数')

    return

    // 判断是否开启了json深克隆模式的开关
  } else if (json) {
    // 是的话，直接进行弹出json好的属性
    return JSON.parse(JSON.stringify(data))
  }

  // 类型声明对象
  let dataStateArray = data instanceof Array
  let dataStateObject = data instanceof Object

  // 如果类型判断出不是数组或对象类型，则进行警告提示，并弹出此数据
  if (!dataStateArray && !dataStateObject) {
    console.warn('此参数不是对象或数组')
    return data
  }

  // 根据 data的数据类型，进行创建对应的深克隆原始类型
  let cloneData = dataStateArray ? [] : {}

  // 判断data是否是数组
  if (data instanceof Array) {
    // 是数组的话，进行循环遍历
    data.forEach((value, index) => {
      // 深克隆成员承接值
      let needValue: typeof value

      // 判断此成员是否是对象或者数组 是的话再次调用本方法
      value instanceof Object || value instanceof Array
        ? (needValue = deepClone(value))
        : (needValue = value)

      // 给对应的位置上进行赋值
      cloneData[index] = needValue
    })

    // 如果data是个对象
  } else if (data instanceof Object) {
    // 对对象进行遍历
    for (const key in data) {
      // 当前对应的data中的值
      let dataValue = data[key]
      // 后续数据承接值
      let needKeyValue: typeof dataValue
      // 判断当前在data中的值是什么类型，如果对象或数组的话，直接调用此方法，否则直接赋值
      dataValue instanceof Object || dataValue instanceof Array
        ? (needKeyValue = deepClone(dataValue))
        : (needKeyValue = dataValue)

      // 在深克隆数据承接对象中赋予对应的参数
      cloneData[key as unknown as string] = needKeyValue
    }
  }

  // 弹出最后的值
  return cloneData
}
