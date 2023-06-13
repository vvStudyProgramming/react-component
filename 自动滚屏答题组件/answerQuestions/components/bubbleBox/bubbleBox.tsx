/*气泡框组件 

*传入属性
  topicAnimation : 是否开启题目组件动画 true开启；false关闭 默认（false）
  acatarShow : 是否展示左侧头像  默认 false（true展示，false隐藏）
  animationDelay : 动画延迟时间 默认0
  animationDuration :  动画完成时间 默认0.5
  maxWidth : 气泡框最长的宽度 默认5.88 （即294px）
  unit : 数据单位，默认 rem
  useName : 用户姓名

*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useEffect, useState, useRef } from 'react';
import './bubbleBox.scss'; // 引入样式
import Tool from '@magic-module/common-lib-tool'; // 引入埋点+端内外判断
import { dialogueIcon } from '../../../../constants/image';
import { remToPx } from '../../../../utils/index';
import Lottie from 'react-lottie';
import loding from '../../../../assets/lottie/loading_lottie.json';
import Bus from '@magic-module/common-lib-bus';
import { messageNotification } from '../../../../constants/music'; // 引入音频

interface Props {
  children?: any;
  audioMets?: string;
  topicAnimation?: boolean;
  acatarShow?: boolean;
  animationDelay?: number;
  animationDuration?: number;
  audioSrc?: any;
  constText?: string;
  useName?: string;
}

const BubbleBox: React.FC<Props> = (props) => {
  // 参数解构
  const {
    topicAnimation = false, // 是否开启题目组件动画 true开启；false关闭 默认（false）
    audioMets = '1', //
    acatarShow = false, // 是否展示左侧头像  默认 false（true展示，false隐藏）
    animationDelay = 0, // 动画延迟时间 默认0
    animationDuration = 0.5, //  动画完成时间 默认0.5
    audioSrc, // 音频路径
    constText = '', // 展示的数据信息
    useName = '',
  } = props;

  // lottie动画所需的内容
  const defaultOptions = {
    loop: true, // 数字代表重复的次数，true开启动画循环，false关闭动画
    autoplay: true, // 是否自动播放
    animationData: loding, // 动画加载地址
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }, // 需要的渲染设置，固定此属性就行
  };

  // 变量声明区
  // ------------------------------------------------------------------------------
  const bubbleBoxAudio = useRef(null); // 音频ref
  const openAudioBtn = useRef(null); // 音频按键ref

  const [audioMet, setAudioMet] = useState('1'); // 音频是否静音
  const [showText, setShowText] = useState(null); // 气泡渲染内容承接值

  // 函数使用区
  // ------------------------------------------------------------------------------
  useEffect(() => {
    // 判断是否带有用户姓名的展位符
    if (constText.indexOf('@username') !== -1) {
      // 有的话，将此占位符换成#，方便后续处理
      let newText = constText.replace('@username', '#');
      // 创造一个节点进行包裹此字符串的截取情况+创建一个span进行处理用户的姓名
      let dom = (
        <div>
          {newText.substring(0, newText.indexOf('#'))}
          <span>{Tool.inApp() ? '@' + useName : useName}</span>
          {newText.substring(newText.indexOf('#') + 1)}
        </div>
      );
      setShowText(dom);
    } else {
      // 不是的话，进行直接赋值
      setShowText(constText);
    }

    // 根据动画延迟时间进行播放音频
    setTimeout(() => {
      openAudioBtn.current.click();
    }, animationDelay * 1000);
  }, []);

  // 按键触发函数
  const openAudio = () => {
    bubbleBoxAudio.current.play().catch(() => {
      // 当错误时，判断是否是开启播放
      if (audioMets === '1') {
        // 是的话重新创建一个音频进行播放
        let aud = new Audio();
        aud.src = messageNotification;
        aud.play();
      }
    });
  };

  useEffect(() => {
    setAudioMet(audioMets);

    //监听声音改变事件
    Bus.on(`changeVoice`, ({ status }: { status: string }) => {
      setAudioMet(status);
    });
  }, []);

  return (
    <div
      className={`BubbleBox ${topicAnimation ? 'topicClass' : ''}`}
      style={{
        transform: topicAnimation ? 'translateY(100%)' : 'translateY(50vh)',
        animationName: topicAnimation ? 'topic' : 'shows',
        animationDelay: animationDelay + 's',
        animationDuration: animationDuration + 's',
      }}
    >
      {/* 左侧头像展示部分 */}
      <div className="BubbleBoxAvatar" style={{ backgroundImage: acatarShow ? `url(${dialogueIcon})` : '', top: topicAnimation ? remToPx(0.04) + 'px' : '' }}></div>

      {/* 气泡框文字内容部分 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className="BubbleBoxFont" style={{ padding: !showText ? '0' : '' }}>
        {showText ? showText : <Lottie options={defaultOptions} width={remToPx(1.26)} height={remToPx(0.8)} />}
      </div>

      {/* 默认音频播放器 */}
      {/* ------------------------------------------------------------------------------ */}
      <audio src={audioSrc} ref={bubbleBoxAudio} muted={audioMet === '0'}></audio>

      {/* 加入button的原因是防止报错，因为直接调用播放方法play会提醒未与用户交互造成报错 */}
      {/* ------------------------------------------------------------------------------ */}
      <button className="BubbleBoxAudioBtn" ref={openAudioBtn} onClick={openAudio}></button>
    </div>
  );
};

export default React.memo(BubbleBox);
