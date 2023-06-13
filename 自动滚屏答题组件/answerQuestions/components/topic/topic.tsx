/*题目组件

*传入属性
topicHeight: 获取外层盒子的高度
smallModel : 是否是小机型
numberOfQuestions :  第几题
Topic : 题目组件渲染对象  (question:题目文字，constDom:内容区域渲染数据，topicBtnList: 按键区域渲染数组)

整体动画属性
================================================================
animationDelay : 动画延迟时间 默认0
animationDuration : 动画完成时间 默认0.5

按键属性
================================================================
btnDurationTimet : 按键过渡持续时间
btnDelayTimet : 按键过渡延迟时间

*交互方法
topicChoose: 使用父级回调函数 传递选中分数+目前的题目数
*/

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useRef, useEffect, useState } from 'react';
import './topic.scss'; // 样式引用
import { remToPx, bleedingAreaRatio } from '../../../../utils/index'; // 引入真是屏幕px换算公式

import BubbleBox from '../bubbleBox/bubbleBox'; // 气泡组件
import TopicSelection from '../topicSelection/topicSelection'; // 题目选择组件
import Bus from '@magic-module/common-lib-bus';

import Lottie from 'react-lottie';

// 参数接口
interface Props {
  userMsg?: any;
  constJson?: string;
  topicHeight?: number;
  audioMets?: string;
  smallModel?: boolean;
  Topic?: TopicObj;
  numberOfQuestions?: number;
  animationDelay?: number;
  animationDuration?: number;
  btnDurationTimet?: number;
  btnDelayTimet?: number;
  topicChoose?: (score?: number, numberOfQuestions?: number) => void;
  onSetToset?: (data: any) => {};
  openAutio?: () => {};
}
// 渲染对象接口属性
type TopicObj = {
  question?: string;
  constDom?: any;
  audioSrc?: any;
  bubbleAudio?: any;
  topicBtnList?: [{ text?: string; score?: any }];
};

const Topic: React.FC<Props> = (props) => {
  // 参数解构
  const {
    userMsg = null, // 用户信息
    topicHeight, // 获取外层盒子的高度
    audioMets,
    smallModel = false, // 是否是小机型
    numberOfQuestions = 1, // 第几题
    Topic = {
      question: '',
      audioSrc: '', // 每题的音频路径
      bubbleAudio: '', // 气泡提示的音效
      constDom: '', // 内容区域的json
      topicBtnList: [],
    }, // 题目组件渲染对象  (question:题目文字，constDom:内容区域渲染数据，topicBtnList: 按键区域渲染数组)

    // 整体动画属性
    // ================================================================
    animationDelay = 0, //动画延迟时间 默认0
    animationDuration = 0.5, //动画完成时间 默认0.5

    // 按键属性
    // ================================================================
    btnDurationTimet = 0.3, // 按键过渡持续时间
    btnDelayTimet = 0, //按键过渡延迟时间

    topicChoose = () => {}, //父级回调函数
    onSetToset = (data: any) => {}, //toset提醒函数
  } = props;

  // 声明变量使用内容
  // ------------------------------------------------------------------------------
  // ref声明区
  const topicConst = useRef(null); // 获取内容区域的ref
  const audios = useRef(null);
  const [audioMet, setAudioMet] = useState('1'); // 音频是否静音
  const openAudios = useRef(null); // 按键ref

  // 状态声明区域
  // ================================================================
  const [lottieSize, setLottieSize] = useState(null); // lottie的宽高状态

  // lottie动画所需的内容
  const defaultOptions = {
    loop: true, // 数字代表重复的次数，true开启动画循环，false关闭动画
    autoplay: false, // 是否自动播放
    animationData: Topic.constDom, // 动画加载地址
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    }, // 需要的渲染设置，固定此属性就行
  };

  // 函数使用区
  // ------------------------------------------------------------------------------
  useEffect(() => {
    let median = { width: 0, height: 0 }; // 取中间值进行计算 lottie的宽高
    median.height = topicConst.current.offsetHeight; // lottie的高为父级的高度
    median.width = bleedingAreaRatio(325, 428, median.height); // lottie的宽度需要动态计算

    // 更新lottie的宽高状态
    setLottieSize(median);

    setTimeout(() => {
      // 开启音频
      openAudios.current.click();
    }, (animationDelay + animationDuration) * 1000);
  }, []);

  useEffect(() => {
    setAudioMet(audioMets);
    //监听声音改变事件
    Bus.on(`changeVoice`, ({ status }: { status: string }) => {
      setAudioMet(status);
    });
  }, []);

  // 事件函数区域
  // ================================================================
  const btnClicks = (score: any) => {
    // 使用父级回调函数 传递选中分数+目前的题目数
    topicChoose(score, numberOfQuestions);
  };

  // 按键触发函数
  const openAudio = () => {
    audios.current.play().catch(() => {
      // 当错误时，判断是否是开启播放
      if (audioMet === '1') {
        // 是的话重新创建一个音频进行播放
        let aud = new Audio();
        aud.src = Topic.audioSrc;
        aud.play();
      }
    });
  };

  return (
    <div className="Topic" style={{ marginTop: numberOfQuestions === 1 ? 0 : smallModel ? '-' + remToPx(((23 + 28 + 20 + 4) * 2) / 100) + 'px' : '-' + remToPx(((48 + 65 + 4) * 2) / 100) + 'px' }}>
      {/* 题目区域 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className="TopicHead" style={{ height: smallModel ? remToPx((129 * 2) / 100) + 'px' : numberOfQuestions === 1 ? remToPx((194 * 2) / 100) + 'px' : remToPx((130 * 2) / 100) + 'px', alignItems: smallModel || numberOfQuestions === 1 ? 'center' : 'flex-start' }}>
        <BubbleBox acatarShow audioMets={audioMets} topicAnimation animationDelay={animationDelay} animationDuration={animationDuration} constText={Topic.question} audioSrc={Topic.bubbleAudio}></BubbleBox>
      </div>

      {/* 内容展示区域 */}
      {/* ------------------------------------------------------------------------------ */}
      <div
        className="TopicConst"
        style={{
          height: smallModel ? topicHeight - remToPx(((9 + 119 + 154) * 2) / 100) + 'px' : numberOfQuestions === 1 ? topicHeight - remToPx(((194 + 238) * 2) / 100) + 'px' : topicHeight - remToPx(((9 + 130 + 238 + 57) * 2) / 100) + 'px',
          animationDelay: animationDelay + animationDuration + 's',
          animationDuration: animationDuration + 0.15 + 's',
        }}
        ref={topicConst}
      >
        {/* lottie动画区域 */}
        <Lottie options={defaultOptions} width={lottieSize?.width} height={lottieSize?.height} />

        {/* 遮挡层，防止点击关闭动画 */}
        <div className="TopicConstMask"></div>
      </div>

      {/* 选项区域 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className="TopicBtn" style={{ height: smallModel ? remToPx((154 * 2) / 100) + 'px' : remToPx((238 * 2) / 100) + 'px' }}>
        <TopicSelection
          userinfo={userMsg}
          itemBtnClick={btnClicks}
          animationDelay={animationDelay + 0.15 + 2 * animationDuration}
          animationDuration={animationDuration}
          DelayTimet={btnDelayTimet}
          durationTimet={btnDurationTimet}
          btnShowList={Topic.topicBtnList}
          setFeedbackData={onSetToset}
        ></TopicSelection>
      </div>

      {/* 题目专属音频 */}
      {/* ------------------------------------------------------------------------------ */}
      <audio src={Topic.audioSrc} ref={audios} muted={audioMet === '0'}></audio>
      {/* 加入button的原因是防止报错，因为直接调用播放方法play会提醒未与用户交互造成报错 */}
      {/* ------------------------------------------------------------------------------ */}
      <button className="AudioBtn" ref={openAudios} onClick={openAudio}></button>
    </div>
  );
};

export default React.memo(Topic);
