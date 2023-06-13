/*顶部导航栏组件（移动端）

*传入属性
 outerStyle : 整个组件最外层样式  --objeck
 leftBox : 左边盒子属性,具体传入属性 { iconStyle:图标部分的样式 , style:该区域整体的样式 , text:需要标注的文字 , icon: 图标的地址 } --objeck
 rightBox : 右边盒子属性,具体传入属性 { iconStyle:图标部分的样式 , style:该区域整体的样式 , text:需要标注的文字 , icon: 图标的地址   --objeck
 title : 题目  --string

*交互方法
leftClick : 左边点击函数传出方法
rightClick : 右边点击函数传出方法

**使用介绍**
 1、使用此组件插槽功能时，要注意，此插槽是用插入对象的形式进行区别 左边 或 右边 的内容节点
    例如：
      <Top>
        {{left:"左边",right:"右边"}}
      </Top>
  2、如果不需要自定义插槽功能，则按照leftBox 和 rightBox的样式
 */

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useState } from "react";
import "./topNavigationBar.css"; // 引入css样式

// prop接口
interface Popups {
  children?: { left?: any; right?: any };
  outerStyle?: any;
  leftBox?: box;
  rightBox?: box;
  title?: string;
  leftClick?: () => void;
  rightClick?: () => void;
}
// 定义给box的接口对象
type box = {
  iconStyle?: any; // 图标部分的样式
  style?: any; // 该区域整体的样式
  text?: string; // 需要标注的文字
  icon?: any; // 图标的地址
};

const TopNavigationBar: React.FC<Popups> = (props) => {
  // 参数结构
  const {
    children = { left: "", right: "" }, // 插槽属性 (此处插入的是一个对象，里面包括left属性和right属性，分别代表左右两个按键的dom区域)
    outerStyle, // 整个组件最外层样式
    leftBox = {
      text: "返回",
      icon: require("./img/left.png"), // 使用本地存入的图片，按照此写法才能让背景图片进行展示出来
    }, //左边盒子属性
    rightBox = {
      text: "搜索",
      icon: require("./img/放大镜.png"), // 使用本地存入的图片，按照此写法才能让背景图片进行展示出来
    }, //右边盒子属性
    title = "标题", //题目

    // 传出事件
    // ------------------------------------------------------------------------------
    leftClick = () => {}, // 左边点击函数传出方法
    rightClick = () => {}, // 右边点击函数传出方法
  } = props;

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [leftDownBox, setLeftDownBox] = useState(false); // 左边按下时展示背景盒子开关
  const [rightDownBox, setRightDownBox] = useState(false); // 右边按下时展示背景盒子开关

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 事件函数区
  // ================================================================
  // 左边鼠标按下或手指按下事件
  const leftDown = () => {
    // 打开 左边按下时展示背景盒子开关
    setLeftDownBox(true);
  };

  // 左边鼠标抬起或者手指抬起事件
  const leftUp = () => {
    // 关闭 左边按下时展示背景盒子开关
    setLeftDownBox(false);
    // 使用父级配套函数
    leftClick();
  };

  // 右边鼠标按下或手指按下事件
  const rightDown = () => {
    // 打开 右边按下时展示背景盒子开关
    setRightDownBox(true);
  };

  // 右边鼠标抬起或者手指抬起事件
  const rightUp = () => {
    // 关闭 右边按下时展示背景盒子开关
    setRightDownBox(false);
    // 使用父级配套函数
    rightClick();
  };

  return (
    <div className="topNavigationBar" style={outerStyle}>
      {/* 左边按键区域
       *此区域根据 插槽里面有没有本区域的节点内容  或者  左边的图标  或者 左边的文字信息 是否存在，如果都没有则此区域隐藏
       *如果 插槽里面有本区域的节点内容，那么默认提供的图标+文字结构就不会显示，只会显示插槽内的节点
       *按下后的蒙层是根据此区域的点击情况进行绑定展示的  按下后暂时  抬起后隐藏
       */}
      {/* ------------------------------------------------------------------------------ */}
      {(children.left || leftBox.icon || leftBox.text) && (
        <div
          className="topNavigationBar-left"
          style={leftBox.style}
          onMouseDown={leftDown}
          onMouseUp={leftUp}
          onTouchStart={leftDown}
          onTouchEnd={leftUp}
        >
          {/* 代表如果插槽中有对应节点存在，则展示此节点，否则不展示 */}
          {children.left && children.left}

          {/* 图标 */}
          {leftBox.icon && !children.left && (
            <div
              className="topNavigationBar-left-icon"
              style={{
                backgroundImage: `url(${leftBox.icon})`,
                ...leftBox.iconStyle,
              }}
            ></div>
          )}

          {/* 标注文字 */}
          {!children.left && leftBox.text}

          {/* 按下后显示的蒙层 */}
          <div
            className="mask"
            style={{ display: leftDownBox ? "block" : "none" }}
          ></div>
        </div>
      )}

      {/* 中间题目 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className="topNavigationBar-title">{title}</div>

      {/* 右边按键区域
       *此区域根据 插槽里面有没有本区域的节点内容  或者  右边的图标  或者 右边的文字信息 是否存在，如果都没有则此区域隐藏
       *如果 插槽里面有本区域的节点内容，那么默认提供的图标+文字结构就不会显示，只会显示插槽内的节点
       *按下后的蒙层是根据此区域的点击情况进行绑定展示的  按下后暂时  抬起后隐藏
       */}
      {/* ------------------------------------------------------------------------------ */}
      {(children.right || rightBox.icon || rightBox.text) && (
        <div
          className="topNavigationBar-right"
          style={rightBox.style}
          onMouseDown={rightDown}
          onMouseUp={rightUp}
          onTouchStart={rightDown}
          onTouchEnd={rightUp}
        >
          {/* 代表如果插槽中有对应节点存在，则展示此节点，否则不展示 */}
          {children.right && children.right}

          {/* 图标 */}
          {rightBox.icon && !children.right && (
            <div
              className="topNavigationBar-right-icon"
              style={{
                backgroundImage: `url(${rightBox.icon})`,
                ...rightBox.iconStyle,
              }}
            ></div>
          )}

          {/* 标注文字 */}
          {!children.right && rightBox.text}

          {/* 按下后显示的蒙层 */}
          <div
            className="mask"
            style={{ display: rightDownBox ? "block" : "none" }}
          ></div>
        </div>
      )}
    </div>
  );
};

// 导出时进行性能优化
export default React.memo(TopNavigationBar);
