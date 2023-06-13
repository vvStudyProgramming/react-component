/*引导语组件

*传入属性
  constList : 渲染气泡的数组
  delayTime :  延迟时间对象 （overall为整体应该延迟多久出现，item是每个成员要多久出现）默认overall=0；item=0.3
  itemFinishTime : 每个成员动画完成时间 默认0.5
  useName : 用户名称
*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useState, useLayoutEffect, useEffect } from 'react';
import './guide.scss'; // 引入样式
import BubbleBox from '../bubbleBox/bubbleBox'; //引入气泡组件
import { remToPx } from '../../../../utils/index';

// 参数接口
interface Props {
  constList?: [any];
  audioMet?: string;
  audios?: any;
  delayTime?: { overall?: number; item?: number };
  itemFinishTime?: number;
  finish?: boolean;
  smallModel?: boolean;
  useName?: string;
  openAutio?: () => void;
}

const Guide: React.FC<Props> = (props) => {
  // 参数解构
  const {
    constList = [], // 渲染气泡的数组
    audios, // 音频路径
    audioMet,
    delayTime = { overall: 0, item: 0.3 }, //延迟时间对象 （overall为整体应该延迟多久出现，item是每个成员要多久出现）默认overall=0；item=0.3
    itemFinishTime = 0.5, // 每个成员动画完成时间 默认0.5
    finish = false, // 是否是最后一题
    smallModel = false, // 是否是小机型
    useName,
    openAutio = () => {},
  } = props;

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  const [showList, setShowList] = useState([]); // 内容渲染实现数组

  // 方法使用区域
  // ------------------------------------------------------------------------------
  useLayoutEffect(() => {
    let newList = [...constList, '']; // 深克隆传入的渲染气泡数组

    // 将此数组进行替换为气泡框组件
    let newLists = newList.map((value, index) => <BubbleBox audioMets={audioMet} audioSrc={audios} acatarShow={index === 0} animationDelay={index * delayTime.item + delayTime.overall} animationDuration={itemFinishTime} constText={value} useName={useName} openAutio={openAutio}></BubbleBox>);
    setShowList(newLists);
  }, []);

  return (
    <div className="Guide" style={{ marginTop: !finish ? (smallModel ? '-' + remToPx((54 * 2) / 100) + 'px' : '') : smallModel ? '-' + remToPx(((23 + 28 + 4) * 2) / 100) + 'px' : '-' + remToPx(((48 + 65 + 4) * 2) / 100) + 'px' }}>
      {/* 展示内容区域 */}
      {showList}
      {finish && <div className="GuideFinish"></div>}
    </div>
  );
};

export default React.memo(Guide);
