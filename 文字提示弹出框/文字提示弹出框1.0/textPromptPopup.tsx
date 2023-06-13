/*文字提示弹出框组件

*传入参数
 boxStyle :定义外框组件的样式（直接是绑定的style）  --object
 openShowTime :开始展示时间 默认1.5s  --number
 hideShowTime :结束显示时间  默认1s  --number

***用法介绍***
1、使用此组件，只需要在使用组件时中间加入需要的文字信息即可   例子：<Text ref={text}>这是插入的文字</Text>
2、当需要打开此组件进行展示时，结合ref，然后进行使用。    例子：text.current.displaySwitch()
3、因为考虑到不同业务和要求不同，故此组件没有添加防抖节流，需要的话，自行添加即可。
4、但本组件自身做了伪防抖的动画展示模式。详情见下方代码
*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types"; // 引入默认值验证
import "./textPromptPopup.css"; // 引入样式

// prop接口
interface Props {
  children?: any;
  boxStyle?: any;
  openShowTime?: number;
  hideShowTime?: number;
}

// 使用forwardRef方法创建一个组件
const TextPromptPopup = forwardRef((props: Props, ref) => {
  // 传入参数结构
  const {
    boxStyle = {}, // 定义外框组件的样式（直接是绑定的style）
    openShowTime = 1.5, // 开始展示时间 默认1.5s
    hideShowTime = 1, // 结束显示时间  默认1s
  } = props;

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [boxShow, setBoxShow] = useState(false); // 控制本组件展示或隐藏css属性
  const textShow = useRef(null); // 获取展示组件的ref
  const time = useRef(null); // 做伪防抖处理，呈现关闭动画定时器承接值
  const timeChlid = useRef(null); // 做伪防抖处理，呈现隐藏本组件定时器承接值

  // 方法使用区域
  // ------------------------------------------------------------------------------

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    // 暴露给父级使用展示该组件的方法
    displaySwitch() {
      // 改变本组件的展示style展示情况 并修改 boxShow属性 来 控制本组件展示css
      // ===================================================
      textShow.current.style.display = "block"; // 修改display属性让其展示
      textShow.current.style.animationDuration = `${openShowTime}s`; // 根据传入的展示时间进行赋予动画展示时间
      setBoxShow(true); // 修改 boxShow属性 用于使用开启动画

      // 进行伪防抖处理，清除所有下方的定时器
      // ===================================================
      clearTimeout(time.current);
      clearTimeout(timeChlid.current);

      // 使用定时器进行改变该组件的展示  从显示动画变为隐藏动画  并进行隐藏（根据展示动画的时间为此定时器时间）
      // ===================================================
      time.current = setTimeout(() => {
        textShow.current.style.animationDuration = `${hideShowTime}s`; // 改变动画隐藏时的展示时间
        setBoxShow(false); // 改变 boxShow属性 用于使用关闭动画

        // 额外在使用一个定时器进行根据 动画结束时间 进行改变本组件的隐藏
        timeChlid.current = setTimeout(() => {
          textShow.current.style.display = "none"; // 隐藏本组件
        }, hideShowTime * 1000 + 10);
      }, openShowTime * 1000 + 10);
    },
  }));

  return (
    /* 组件外框
     * boxStyle属性为对象形式，用于直接修改本组件的样式情况
     * textShow 为本组件的ref
     * boxShow属性用于提供依据，进行展示开启或者隐藏动画
     */
    <div
      className={`textPrmptPopup ${boxShow ? "boxShow" : "boxHide"}`}
      style={boxStyle}
      ref={textShow}
    >
      {/* 提示内容 */}
      {props.children}
    </div>
  );
});

// 验证默认值规则
TextPromptPopup.propTypes = {
  boxStyle: PropTypes.object,
  openShowTime: PropTypes.number,
  hideShowTime: PropTypes.number,
};

export default TextPromptPopup;
