/* 题目选择组件 

*传入属性
 btnShowList : 按键渲染数组
 durationTimet : 过渡持续时间
 DelayTimet : 过渡延迟时间
 animationDelay : 动画延迟时间 默认0
 animationDuration : 动画完成时间 默认0.5

*交互方法
 itemBtnClick : 父级外层回调函数 传入选择的分数

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useState, useEffect } from 'react';
import './topicSelection.scss'; // 样式引入
import { I18n } from '@ies/starling_intl'; // 翻译内容接口

// 组件引入
import TopicBtn from '../topicBtn/topicBtn'; // 题目按键组件
import Tool from '@magic-module/common-lib-tool'; // 引入埋点

interface Props {
  userinfo?: any;
  btnShowList?: showList;
  durationTimet?: number;
  DelayTimet?: number;
  animationDelay?: number;
  animationDuration?: number;
  itemBtnClick?: (score?: number) => void;
  setFeedbackData?: (data: any) => {};
}
// 渲染数组类型
type showList = [{ text?: string; score?: any }];

const TopicSelection: React.FC<Props> = (props) => {
  // 参数解构
  const {
    userinfo = null, // 用户信息对象
    btnShowList = [], // 按键渲染数组
    durationTimet = 0.3, // 过渡持续时间
    DelayTimet = 0, // 过渡延迟时间
    animationDelay = 0, // 动画延迟时间 默认0
    animationDuration = 0.5, //  动画完成时间 默认0.5
    itemBtnClick = () => {}, // 父级外层回调函数 传入选择的分数
    setFeedbackData = (data: any) => {}, //toset提醒函数
  } = props;

  // 变量声明区域
  // ------------------------------------------------------------------------------
  const [selectionList, setSelectionList] = useState([]); // 渲染按键数组
  const [itemIndex, setItemIndex] = useState(null); // 获取目前点击的按键位置信息

  // 函数使用区
  // ------------------------------------------------------------------------------
  // 根据传入的 btnShowList 数组，进行渲染为 TopicBtn 题目按键组件
  useEffect(() => {
    let newList = [...btnShowList]; // 深克隆
    let changeList = newList.map((value, index) => (
      <TopicBtn
        score={value.score}
        index={index}
        chooseShow={!index}
        FinishAnimation={itemIndex === index ? 'choose' : itemIndex !== null ? 'disappear' : ''}
        transitionDuration={durationTimet}
        DelayTimet={DelayTimet}
        animationDelay={animationDelay + index * animationDuration} // 动画的延迟按照传入的延迟时间+该位置*一次完成的时间
        animationDuration={animationDuration}
        btnClick={itemClick}
      >
        {value.text}
      </TopicBtn>
    ));
    setSelectionList(changeList);
  }, [itemIndex]);

  // 事件函数
  // ================================================================
  const itemClick = (score: any, index: number) => {
    // 判断是否在端外
    // if (!Tool.inApp()) {
    //   // 进入端内
    //   Tool.backToApp();
    //   return;

    //   // 判断用户是否未登录
    // } else if (!userinfo) {
    //   // 调用提醒弹窗函数
    //   setFeedbackData(I18n.t('quiztoast_notloggedin'));

    //   setTimeout(() => {
    //     // 没有的话，调用去登陆的接口
    //     window?.__MAGIC__?.action?.magicUnifyJsb?.openLogin();
    //   }, 2000);

    //   return;
    // }

    // 动态改变选中的位置信息
    setItemIndex(index);
    // 使用父级回调函数，传入选择的分数
    itemBtnClick(score);
  };

  return <div className="TopicSelection">{selectionList}</div>;
};

export default React.memo(TopicSelection);
