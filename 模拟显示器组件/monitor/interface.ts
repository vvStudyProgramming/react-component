// props传参定义接口
// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
export interface Props {
  displayList?: displayListItem | [] // 显示数组
  monitorClass?: string // 外层额外自定义的css
  monitorWidth?: number // 外层自定义的宽度
  monitorHeight?: number // 外层自定义的高度
  showPointsClass?: string // 显示点的额外自定义css
  showPointsColor?: string // 显示点的默认展示背景颜色
  showPointsWidth?: number // 显示点的自定义宽度
  showPointsHeight?: number // 显示点的自定义高度
  portrait?: number // 行数
  transverse?: number // 列数
  gap?: number // 间隔距离
  gapColor?: string // 间隔颜色
  sizeCompany?: string // 比例单位

  // 回调方法
  // ================================================================
  monitorUpdate?: MonitorUpdate //显示器更新回调函数
}

// props内部数据所需接口
// ------------------------------------------------------------------------------
// 显示数组的ts接口
export interface displayListItemConst {
  portrait: number // 第几行
  transverse: number // 第几列
  color: string // 显示的颜色
  identifier?: string | number //特殊标识
  customCss?: string // 单独真的此显示点的自定义css名称
}
// 显示数组的ts接口继承
export type displayListItem = displayListItemConst[]

// 显示器更新回调函数接口
// ================================================================
export interface MonitorUpdate {
  (data: MonitorUpdateDate): void
}

// 显示器更新回调函数参数接口
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
export interface MonitorUpdateDate {
  showPointsList: displayListItem
  newestShowList: Array<displayListItem>
  monitorState: string
}

// 暴露给父组件的方法定义接口
// ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
export interface RefReturn
  extends Pick<displayListItemConst, 'portrait' | 'transverse'> {
  init: () => void
  showRanksStatusQuery: (
    target?: string
  ) => number[] | showRanksStatusQueryReturn
  appointPointStatusQuery: AppointPointStatusQuery
  appointRanksStatusQuery: AppointRanksStatusQuery
  deleteShowPoints: DeleteShowPoints
  deletePortraitTransverse: DeletePortraitTransverse
}

// 显示行列状态查询函数
// ------------------------------------------------------------------------------
export type showRanksStatusQueryReturn = {
  portrait: number[]
  transverse: number[]
}
// 规则对象接口
// ================================================================
export interface showRanksStatusQueryRuleObj
  extends showRanksStatusQueryReturn {
  ranks: showRanksStatusQueryReturn
}

// 指定显示点状态查询函数
// ------------------------------------------------------------------------------
interface AppointPointStatusQuery {
  (
    appointPoints:
      | AppointPointStatusQueryParameter
      | AppointPointStatusQueryParameter[]
  ): boolean[] | boolean
}
export type AppointPointStatusQueryParameter = Pick<
  displayListItemConst,
  'portrait' | 'transverse'
>

// 指定行列状态查询函数
// ------------------------------------------------------------------------------
interface AppointRanksStatusQuery {
  (
    appointTarget: AppointRanksStatusQueryReturnParameter
  ): AppointRanksStatusQueryReturn
}
// 参数接口
// ================================================================
interface AppointRanksStatusQueryReturnParameter {
  portraits?: number | number[]
  transverses?: number | number[]
}

// 返回参数接口
// ================================================================
export type AppointRanksStatusQueryReturn = {
  portrait?: boolean[] | boolean
  transverse?: boolean[] | boolean
}

// 显示点单独删除函数
// ------------------------------------------------------------------------------
interface DeleteShowPoints {
  (list: Pick<displayListItemConst, 'portrait' | 'transverse'>[]): void
}
// 显示行列公共删除函数
// ------------------------------------------------------------------------------
export interface DeletePortraitTransverse {
  (ruleObj: DeletePortraitTransverseRuleObj): void
}
// ruleObj属性定义
// ================================================================
type DeletePortraitTransverseRuleObjItem = 'portrait' | 'transverse'

// ruleObj的定义接口
// ================================================================
export type DeletePortraitTransverseRuleObj = {
  [k in DeletePortraitTransverseRuleObjItem]?: number | number[]
}
