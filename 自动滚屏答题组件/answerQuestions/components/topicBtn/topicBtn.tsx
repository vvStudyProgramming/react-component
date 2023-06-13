/*题目按键组件

*传入属性
  children : 插槽传入文字内容
  chooseShow : 怎么展示按键的排列情况  true展示上方，false展示下方
  FinishAnimation : 结束的动画名称 （ choose 选中的动画  disappear 消失的动画）默认是空
  score: 此选项的分值
  index: 此选项的位置信息
  transitionDuration: 过渡持续时间
  transitionDelay: 过渡延迟时间

  animationDelay: 动画延迟时间 默认0
  animationDuration: 动画完成时间 默认0.5

*交互方法
  btnClick : 点击的函数 传递分数+位置信息
 */

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useEffect, useRef } from 'react';
import './topicBtn.scss'; // 引入样式
import Tool from '@magic-module/common-lib-tool'; // 引入埋点

// 接口参数
interface Props {
  children?: any;
  chooseShow?: boolean;
  FinishAnimation?: string;
  score?: number;
  index?: number;
  transitionDuration?: number;
  transitionDelay?: number;
  animationDelay?: number;
  animationDuration?: number;
  btnClick?: (score?: number, index?: number) => void;
}

const TopicBtn: React.FC<Props> = (props) => {
  // 参数解构
  const {
    children, // 插槽传入文字内容
    chooseShow, //  怎么展示按键的排列情况  true展示上方，false展示下方
    FinishAnimation = '', // 结束的动画名称 （ choose 选中的动画  disappear 消失的动画）默认是空
    score, // 此选项的分值
    index, // 此选项的位置信息
    transitionDuration, // 过渡持续时间
    transitionDelay, // 过渡延迟时间

    animationDelay, // 动画延迟时间 默认0
    animationDuration, //  动画完成时间 默认0.5
    btnClick = () => {}, // 点击的函数 传递分数+位置信息
  } = props;

  //   变量声明区域
  // ------------------------------------------------------------------------------
  const btns = useRef(null); // 获取此组件的ref
  const defaults = useRef(null); // 获取默认的的ref

  // 函数使用区
  // ------------------------------------------------------------------------------
  // 监听 FinishAnimation 结束的动画名称
  useEffect(() => {
    // 如果是 disappear 消失的动画名称，则对其元素进行隐藏
    if (FinishAnimation === 'disappear') {
      setTimeout(() => {
        btns.current.style.display = 'none';
      }, transitionDuration * 1000 + 50);
    }
    // 判断是否是选中动画
    if (FinishAnimation === 'choose') {
      // 是的话将其宽度变为对应的默认宽度
      btns.current.style.width = defaults.current.offsetWidth + 'px';
      // 判断是第二个按键
      if (index === 1) {
        // 则对其的下边距进行调整
        btns.current.style.marginBottom = btns.current.offsetTop + 'px';
      }
    }
  }, [FinishAnimation]);

  // 事件函数
  // ================================================================
  //   按键点击函数
  const topicBtn = () => {
    // 使用父级回调函数 传递分数+位置信息
    btnClick(score, index);
  };

  return (
    <div
      className={`topicBtn ${chooseShow ? 'top' : 'bottom'} ${FinishAnimation}`}
      style={{ transitionDuration: FinishAnimation === 'disappear' ? transitionDuration - 0.2 + 's' : transitionDuration + 's', transitionDelay: transitionDelay + 's', animationDelay: animationDelay + 's', animationDuration: animationDuration + 's' }}
      ref={btns}
      onClick={topicBtn}
    >
      {children}
      <div className="topicBtn topicBtnDefault" ref={defaults}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(TopicBtn);
