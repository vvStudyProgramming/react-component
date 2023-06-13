/*渲染隐藏成员组件

*传入属性
 name : 渲染名称
 keys : 唯一的key值
 status : 自身控制状态 用于展示是否是选中状态的开关

*交互方法
onItemCheck : 父级回调方法，用于传递点击后的该渲染信息全部给父级

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React from "react";
import "./downSelectionItem.css"; // 引入样式

// 接口定义
interface Props {
  name?: string;
  keys?: Number | string;
  status?: boolean;
  onItemCheck?: (msg: object) => void;
}

const DownSelectionItem: React.FC<Props> = (props) => {
  // 参数解构
  const {
    name, // 渲染名称
    keys, // 唯一的key值
    status, // 自身控制状态 用于展示是否是选中状态的开关
    onItemCheck = (msg) => {}, // 父级回调方法，用于传递点击后的该渲染信息全部给父级
  } = props;

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  return (
    // 根据 itemObj.status 的状态进行判断是否是选中的情况
    <div
      className={`downSelectionItem ${
        status ? "downSelectionItem-checked" : ""
      }`}
      onClick={() => {
        // 使用父级组件函数
        onItemCheck({ name: name, key: keys });
      }}
    >
      {/* 渲染展示名称 */}
      {name}
    </div>
  );
};

export default React.memo(DownSelectionItem);
