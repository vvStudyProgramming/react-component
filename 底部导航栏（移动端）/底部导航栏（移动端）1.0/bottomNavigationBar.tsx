/* 底部导航栏（移动端） 

*传入属性
 itemList : 成员渲染数组  
      示例 :[{title:'',icon:'',iconChange:'',url:''}]  (title表示标题，icon为默认展示图标，iconChange为变化后的图标，url为跳转的地址)
 itemStyle : 每个成员的样式
 textChange : 点击后标题文字的样式变化

*交互方法
itemClicks : 传递给父级的点击函数 ， 点击成员的标题和需要跳转的页面地址。  还有就是该成员的位置信息

**使用介绍**
1、根据渲染数组 itemList 的进行展示渲染
2、在渲染数组中，支持只带文字或图标的形式，只需要传入对应的参数即可

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

*/

import React, { useState } from "react";
import "./bottomNavigationBar.css"; // 引入底部导航栏样式

// prop接口
interface Props {
  itemList?: [
    {
      title?: string;
      icon?: string;
      iconChange?: string;
      url?: string;
    }
  ];
  itemStyle?: {
    width?: string;
    height?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    lineHeight?: string;
  };
  textChange?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    lineHeight?: string;
  };
  itemClicks?: (
    value?: { title?: string; url?: string },
    index?: number
  ) => void;
}

const BottomNavigationBar: React.FC<Props> = (props) => {
  // 参数结构
  const {
    itemList = [], // 成员渲染数组
    itemStyle = {}, // 每个成员的样式
    textChange = { fontWeight: "700" }, // 点击后标题文字的样式变化

    // 传出事件
    // ------------------------------------------------------------------------------
    itemClicks = (value, index) => {}, // 传递给父级的点击函数 ， 点击成员的标题和需要跳转的页面地址 。  还有就是该成员的位置信息
  } = props;

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [indexChange, setIndexChange] = useState(0); // 用户选中的位置信息

  // 方法使用区域
  // ------------------------------------------------------------------------------
  // 事件函数区
  // ================================================================
  // 成员点击函数
  const itemClick = (value, index) => {
    // 改变 用户选中的位置信息 为点击的位置信息
    setIndexChange(index);

    itemClicks({ title: value.title, url: value.url }, index);
  };

  return (
    <div className="bottomNavigationBar">
      {/* 循环成员渲染数组，进行成员的展示 */}
      {itemList.map((value, index) => {
        // 成员外层
        // ------------------------------------------------------------------------------
        return (
          <div
            className="bottomNavigationBar-item"
            style={{
              fontSize: itemStyle.fontSize,
              fontFamily: itemStyle.fontFamily,
              fontWeight: itemStyle.fontWeight,
              lineHeight: itemStyle.lineHeight,
              color: itemStyle.color,
            }}
            onClick={() => {
              // 使用成员点击函数
              itemClick(value, index);
            }}
          >
            {/* icon图标 */}
            {/* ================================================================ */}
            {value.icon && (
              <div
                className="bottomNavigationBar-item-icon"
                style={{
                  width: itemStyle.width,
                  height: itemStyle.height,
                  backgroundImage: `url(${
                    indexChange !== index ? value.icon : value.iconChange
                  })`,
                }}
              ></div>
            )}

            {/* 标题 */}
            {/* ================================================================ */}
            {value.title && (
              <div
                className="bottomNavigationBar-item-title"
                style={indexChange === index ? textChange : {}}
              >
                {value.title}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 导出时进行性能优化
export default React.memo(BottomNavigationBar);
