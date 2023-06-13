/*答题组件

*传入属性 (具体参数可以参考ts接口定义)
welcomeObj : 导语组件所需属性
minimumScreen : 最小屏幕的数据 默认667
topicCreate : 题目组件渲染数组
topicAnimation : 题目组件动画状态
finishObj  : 结束语渲染对象

*交互方法
lastQuestion : 最后一题的回调函数 传入最后的总分

 */
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useState, useRef, useEffect } from 'react';
import './index.scss'; // 引入样式
import { remToPx, moveElement, randomNum, resultGetName } from '../../utils/index'; // 引入真是屏幕px换算公式+滚动函数+随机数+获取接口名称函数
import Bus from '@magic-module/common-lib-bus'; // 引入bus数据总线
import Tool from '@magic-module/common-lib-tool'; // 引入埋点
import { AnswerQuestionsObj } from '../../constants/index'; // 获取筛选传入图片接口函数

// 组件引入区域
// ------------------------------------------------------------------------------
import Guide from './components/guide/guide'; // 引入导语组件
import Topic from './components/topic/topic'; // 引入题目组件
import Rattan from './components/rattan/rattan'; // 引入花藤组件
import Lottie from 'react-lottie'; // lottie 动画展示组件
import Mask from '@/components/Mask'; // 模态框组件
import logger from '@magic-procode/logger';

// lottie动画json引入
// ------------------------------------------------------------------------------
import headTop from '../../assets/lottie/mainpage_lottie.json'; // 首页头部lottie动画json
import question1 from '../../assets/lottie/question1_lottie.json'; // 第一题lottie动画json
import question2 from '../../assets/lottie/question2_lottie.json'; // 第二题lottie动画json
import question3 from '../../assets/lottie/question3_lottie.json'; // 第三题lottie动画json
import question4 from '../../assets/lottie/question4_lottie.json'; // 第四题lottie动画json
import question5 from '../../assets/lottie/question5_lottie.json'; // 第五题lottie动画json

// 音频引入
// ------------------------------------------------------------------------------
import { messageNotification, question_1, question_2, question_3, question_4, question_5, answer1_a, answer1_b, answer2_a, answer2_b, answer3_a, answer3_b, answer4_a, answer4_b, answer5_a, answer5_b } from '../../constants/music';

// api接口部分
// ------------------------------------------------------------------------------
import { getImageUrl } from '../../api'; // 图片获取接口
import { I18n } from '@ies/starling_intl'; // 翻译内容接口

// 参数接口
// ------------------------------------------------------------------------------
interface Props {
  userinfo?: any;
  voice?: string;
  allAudioBtn?: boolean;
  // 导语组件所需的传入参数对象  Guide
  welcomeObj?: guide;
  finishObj?: guide;
  topicCreate?: topicCreate;
  topicAnimation?: topicAnimation;
  minimumScreen?: number;
  lastQuestion?: (totalScore: number) => void;
  setFeedbackData?: (data: any) => {};
  backgroundMusicOpen?: (audioMet: any) => {};
}

// 导语组件接口定义
type guide = {
  constList?: [string];
  delayTime?: { overall?: number; item?: number };
  itemFinishTime?: number;
};

// 题目组件接口定义
type topicCreate = [
  {
    question?: string;
    constDom?: any;
    topicBtnList?: [{ text?: string; score?: any }];
  }
];

// 题目组件动画+过渡时间接口定义
type topicAnimation = [
  {
    animationDelay?: number;
    animationDuration?: number;
    btnDurationTimet?: number;
    btnDelayTimet?: number;
  }
];

// 头部动画设置
const defaultOptions = {
  loop: 0, // 数字代表重复的次数，true开启动画循环，false关闭动画
  autoplay: true, // 是否自动播放
  animationData: headTop, // 动画加载地址
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  }, // 需要的渲染设置，固定此属性就行
};

const AnswerQuestions: React.FC<Props> = (props) => {
  // 参数解构
  const {
    userinfo = null, // 用户信息对象
    voice, // 音乐总开关
    welcomeObj = {
      constList: [I18n.t('welcome1'), I18n.t('welcome2'), I18n.t('welcome3')], // 渲染气泡的数组
      delayTime: { overall: 0, item: 1.3 }, //延迟时间对象 （overall为整体应该延迟多久出现，item是每个成员要多久出现）默认overall=0；item=0.3
      itemFinishTime: 0.5, // 每个成员动画完成时间 默认0.5
    }, // 导语组件所需属性
    minimumScreen = AnswerQuestionsObj.minimumScreen, // 最小屏幕的数据 默认667
    topicCreate = [
      {
        question: I18n.t('question1'),
        constDom: question1,
        audioSrc: question_1,
        bubbleAudio: messageNotification,
        topicBtnList: [
          { text: I18n.t('answer1_a'), score: { title: 'result2', number: 1, audioId: 'answer1_a' } },
          { text: I18n.t('answer1_b'), score: { title: 'result3', number: 1, audioId: 'answer1_b' } },
        ],
      },
      {
        question: I18n.t('question2'),
        constDom: question2,
        audioSrc: question_2,
        bubbleAudio: messageNotification,
        topicBtnList: [
          { text: I18n.t('answer2_a'), score: { title: 'result3', number: 1, audioId: 'answer2_b' } },
          { text: I18n.t('answer2_b'), score: { title: 'result1', number: 1, audioId: 'answer2_b' } },
        ],
      },
      {
        question: I18n.t('question3'),
        constDom: question3,
        audioSrc: question_3,
        bubbleAudio: messageNotification,
        topicBtnList: [
          { text: I18n.t('answer3_a'), score: { title: 'result4', number: 1, audioId: 'answer3_b' } },
          { text: I18n.t('answer3_b'), score: { title: 'result2', number: 1, audioId: 'answer3_b' } },
        ],
      },
      {
        question: I18n.t('question4'),
        constDom: question4,
        audioSrc: question_4,
        bubbleAudio: messageNotification,
        topicBtnList: [
          { text: I18n.t('answer4_a'), score: { title: 'result5', number: 1, audioId: 'answer4_b' } },
          { text: I18n.t('answer4_b'), score: { title: 'result1', number: 1, audioId: 'answer4_b' } },
        ],
      },
      {
        question: I18n.t('question5'),
        constDom: question5,
        audioSrc: question_5,
        bubbleAudio: messageNotification,
        topicBtnList: [
          { text: I18n.t('answer5_a'), score: { title: 'result4', number: 1, audioId: 'answer5_b' } },
          { text: I18n.t('answer5_b'), score: { title: 'result5', number: 1, audioId: 'answer5_b' } },
        ],
      },
    ], // 题目组件渲染数组

    topicAnimation = AnswerQuestionsObj.topicAnimation, // 题目组件动画状态

    finishObj = {
      constList: [I18n.t('finish1'), I18n.t('finish2')], // 渲染气泡的数组
      delayTime: { overall: 0, item: 1.3 }, //延迟时间对象 （overall为整体应该延迟多久出现，item是每个成员要多久出现）默认overall=0；item=0.3
      itemFinishTime: 0.5, // 每个成员动画完成时间 默认0.5
    }, // 结束语渲染对象
    changeContent = () => {}, //
    setFeedbackData = (data: any) => {},
  } = props;

  // 声明变量使用内容
  // --------------------------------------------------------------------------------------------------------------
  // ref声明区
  // ================================================================
  const answerQuestions = useRef(null); // 最外层盒子ref
  const slideBox = useRef(null); // 滚动内容盒子ref
  const chooseNum = useRef(null); // 获取目前渲染数组的中间值
  const constShowList = useRef([]); // 全部渲染数据数组
  const fraction = useRef([]); // 已点击后题目承接数组
  const fractionObj = useRef({ result1: 0, result2: 0, result3: 0, result4: 0, result5: 0 }); // 分数承接对象
  const flower = useRef(null); // 承接鲜花组件
  const imgNameChange = useRef(null); // 图片筛选后得到的筛选名称
  const hideCom = useRef(false); // 图片加载成功后的隐藏开关
  const renderNumber0 = useRef(null); // renderNumber0的时候，滚动区域的高度
  const renderNumber1 = useRef(null); // renderNumber1的时候，滚动区域的高度
  const ifMaskClick = useRef(false); // 遮罩层点击函数判断开关
  const audioMetRef = useRef(null); // 遮罩层点击函数判断开关

  // 渲染数组变量区
  // ================================================================
  const [renderList, setrenderList] = useState([]); //渲染数组
  const [renderNumber, setrenderNumber] = useState(null); //渲染数组的中间值
  const [flowerFirstOpen, setFlowerFirstOpen] = useState(false); //花藤首次开启移动开关
  const [mask, setmask] = useState(false); // 遮罩层状态开关
  const [showDisclaimer, setShowDisclaimer] = useState(false); // 接口报错弹窗开关
  const [audioMet, setAudioMet] = useState(null); // 音频是否静音 ('0'打开 '1'关闭)
  const [AnswerQuestionsHeadShow, setAnswerQuestionsHeadShow] = useState(false); // 定时打开首屏动画

  // 函数使用区
  // --------------------------------------------------------------------------------------------------------------
  // hook函数区域
  // =================================================================================================
  // 动态获取并赋予最外层盒子的高度
  useEffect(() => {
    let winHeight = window.screen.height; // 获取目前屏幕的分辨率
    let visibleHeight = window.innerHeight; // 获取目前浏览器可是距离高度
    answerQuestions.current.style.height = visibleHeight - remToPx((88 * 2) / 100) + 'px'; // 动态计算出此时 最外层盒子 需要的高度

    let welcomeList = [<Guide useName={userinfo?.nickname} {...welcomeObj} smallModel={winHeight <= minimumScreen} audios={messageNotification} audioMet={audioMet}></Guide>]; // 欢迎语，承接数组
    let finishList = [<Guide {...finishObj} finish smallModel={winHeight <= minimumScreen} audios={messageNotification} audioMet={audioMet}></Guide>]; // 结束语，承接数组
    let topicList = [...topicCreate]; // 题目改造数组
    // 进行数据换成节点改造并加入实际属性
    topicList = topicList.map((value, index) => (
      <Topic userMsg={userinfo} onSetToset={setFeedbackData} numberOfQuestions={index + 1} audioMets={audioMet} topicHeight={answerQuestions.current.offsetHeight} smallModel={winHeight <= minimumScreen} {...topicAnimation} Topic={{ ...value }} topicChoose={topicItemClicks}></Topic>
    ));

    // 进行数据整合
    constShowList.current = [...welcomeList, ...topicList, ...finishList];

    // 控制花朵和欢迎语出现的时间
    setTimeout(() => {
      setFlowerFirstOpen(true);
      setrenderNumber(0);

      // 控制题目出现的时间
      setTimeout(() => {
        setrenderNumber(1);
      }, (welcomeObj.constList.length * welcomeObj.delayTime.item + welcomeObj.itemFinishTime + 2) * 1000);
    }, 1500);
  }, [userinfo?.nickname]);

  //监听声音改变事件+首屏动画的出现
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  useEffect(() => {
    // 进行本地化存储
    setAudioMet(voice);
    // 间隔1s后首屏动画出现
    setTimeout(() => {
      setAnswerQuestionsHeadShow(true);
    }, 1000);
    Bus.on(`changeVoice`, ({ status }: { status: string }) => {
      setAudioMet(status);
      sessionStorage.setItem('audioMet', status);
    });
  }, []);

  useEffect(() => {
    // 同步犯错值
    audioMetRef.current = audioMet;

    let winHeight = window.screen.height; // 获取目前屏幕的分辨率
    let visibleHeight = window.innerHeight; // 获取目前浏览器可是距离高度
    answerQuestions.current.style.height = visibleHeight - remToPx((88 * 2) / 100) + 'px'; // 动态计算出此时 最外层盒子 需要的高度

    let welcomeList = [<Guide useName={userinfo?.nickname} {...welcomeObj} smallModel={winHeight <= minimumScreen} audios={messageNotification} audioMet={audioMet}></Guide>]; // 欢迎语，承接数组
    let finishList = [<Guide {...finishObj} finish smallModel={winHeight <= minimumScreen} audios={messageNotification} audioMet={audioMet}></Guide>]; // 结束语，承接数组
    let topicList = [...topicCreate]; // 题目改造数组
    // 进行数据换成节点改造并加入实际属性
    topicList = topicList.map((value, index) => (
      <Topic userMsg={userinfo} onSetToset={setFeedbackData} numberOfQuestions={index + 1} audioMets={audioMet} topicHeight={answerQuestions.current.offsetHeight} smallModel={winHeight <= minimumScreen} {...topicAnimation} Topic={{ ...value }} topicChoose={topicItemClicks}></Topic>
    ));

    // 进行数据整合
    constShowList.current = [...welcomeList, ...topicList, ...finishList];
  }, [audioMet]);

  // 监听 渲染数组的中间值 执行组件滚动或插入的函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  useEffect(() => {
    // 如果中间值是null，则不需要执行
    if (renderNumber === null) {
      return;
    }
    // 打开遮罩层+遮罩层点击函数变为false不能触发点击函数
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    setmask(true);
    ifMaskClick.current = false;

    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    chooseNum.current = renderNumber; // 获取目前渲染数组的中间值
    let showList = [...renderList]; // 深克隆渲染数组
    showList.push(constShowList.current[renderNumber]); // 将中间值套入
    setrenderList(showList); // 更新渲染数组

    // 判断首屏+第一次滚动时的 滚动区域高度
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    if (renderNumber === 0) {
      setTimeout(() => {
        renderNumber0.current = slideBox.current.offsetHeight;
      });
    } else if (renderNumber === 1) {
      // 开始答题埋点
      Tool.sendLog('button_click', {
        activityId: '62b4122dae04150335c1780f',
        ccompid: `start`,
        comptype: '@magic-module/answering',
      });
      setTimeout(() => {
        renderNumber1.current = slideBox.current.offsetHeight;
      });
    }

    // 调取滚动函数
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    moveElement(answerQuestions.current, slideBox.current, topicAnimation.btnDurationTimet, setmask, ifMaskClick);
  }, [renderNumber]);

  // 事件函数区域函数区域
  // =================================================================================================
  // 题目选择成员点击函数
  const topicItemClicks = async (score: any, numberOfQuestions: number) => {
    // 判断点击的按键是否和已经存在的对应 fraction分数数组 位置一样 是的话，直接弹出
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    if (fraction.current[numberOfQuestions - 1] === numberOfQuestions) {
      return;
    }
    fraction.current[numberOfQuestions - 1] = numberOfQuestions; // 将选中的题目存放在对应位置上的数组
    fractionObj.current[score.title] = fractionObj.current[score.title] + score.number; // 给总分统计对象的对应数据进行相加

    // 播放对应的音频
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    document.getElementById(score.audioId)?.play();

    let num = chooseNum.current; // 获取到最新的中间值信息
    // 题目点击埋点(传入题目数量)
    Tool.sendLog('quiz_option', {
      ccompid: `answering_questions_btn`,
      activityId: '62b4122dae04150335c1780f',
      option_id: numberOfQuestions,
      comptype: '@magic-module/answering-quiz-btn',
    });

    // 因业务需要，等1.5s后在滑动下一题
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    setTimeout(() => {
      num++; // 自动增加一
      setrenderNumber(num); // 绑定给最新的渲染值
    }, 1500);

    // 判断是否是点击题目的最后一题
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    if (numberOfQuestions === topicCreate.length) {
      let totalScore: any = []; // 最终统计的选择数组
      let scoreList: any = []; // 所有分数集合数组
      let chooseName = ''; // 承接选出的人格类型名称
      let fractionName = Object.keys(fractionObj.current); // 将所有题目的对象进行换成数组

      // 遍历目前获得的总分的承接数组
      fractionName.forEach((value: string) => {
        // 将遍历后的所有的数据给 分数集合数组
        scoreList.push(fractionObj.current[value]);
      });

      // 分数按照从小到大排列
      scoreList.sort((a: number, b: number) => a - b);

      // 再次遍历对象 ， 将所有和最高分数的选项进行分入 最终统计的选择数组
      fractionName.forEach((value: string) => {
        if (fractionObj.current[value] === scoreList[scoreList.length - 1]) {
          totalScore.push(value);
        }
      });

      // 判断是只有一个最大值
      if (totalScore.length === 1) {
        // 是的话直接赋值 给chooseName
        chooseName = totalScore[0];
      } else {
        // 否则随机取一个给 chooseName
        chooseName = totalScore[randomNum(0, totalScore.length - 1)];
      }
      // 赋予筛选成功的数据
      imgNameChange.current = chooseName;

      // 因为业务需要，所以要在延迟1.5s后在执行判断
      // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
      setTimeout(() => {
        // 使用图片请求接口函数
        haveImage();
      }, 1500);
    }
  };

  // 图片请求接口函数
  const haveImage = async () => {
    // 使用拿去名称接口
    let result = resultGetName(imgNameChange.current);

    // 请求接口，拿取图片地址
    let ImageUrl = await getImageUrl(result.noun);
    // let ImageUrl = 'https://p6-t2i.byteimg.com/tos-cn-i-kwkis77vis/h5/r2/dolphin/00016.jpg~tplv-kwkis77vis-image.image123';

    // 如果存在图片地址的话
    if (ImageUrl) {
      // 创造一个图片 使用此地址
      let newImg = new Image();
      // 绑定图片地址
      newImg.src = ImageUrl;
      // 使用图片加载完成函数
      newImg.onload = () => {
        // 预处理后续需要传入的对象数据
        let newResult: any = { ...result };
        newResult.image = ImageUrl;
        // 创建一个循环定时器，进行监听是否 存在开关 已经发生了改变（最后结束语已经展示完整）
        let timer = setInterval(() => {
          if (hideCom.current) {
            // 使用传出的函数
            changeContent(newResult);

            // 清理定时器
            clearInterval(timer);
          }
        });
      };

      // 如果图片没有加载成功则调取弹框
      newImg.onerror = (err: any) => {
        // 报错时发送给报错接口
        logger.error('加载智创图片失败', err);
        // 创建一个循环定时器，进行监听是否 存在开关 已经发生了改变（最后结束语已经展示完整）
        let timer = setInterval(() => {
          if (hideCom.current) {
            setShowDisclaimer(true); // 打开图片请求失败的弹窗
            // 清理定时器
            clearInterval(timer);
          }
        });
      };
    } else {
      // 创建一个循环定时器，进行监听是否 存在开关 已经发生了改变（最后结束语已经展示完整）
      let timer = setInterval(() => {
        if (hideCom.current) {
          setShowDisclaimer(true); // 打开图片请求失败的弹窗
          // 清理定时器
          clearInterval(timer);
        }
      });
      console.log('没有图片');
    }
  };

  // 遮罩层点击判断函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  const ifMask = () => {
    // 先判断是否开启了函数开关，如果没有，则直接弹出，不用触发
    if (!ifMaskClick.current) {
      return;
    }

    // 判断是否在端外
    if (!Tool.inApp()) {
      // 进入端内
      Tool.backToApp();
      return;
    }
  };

  // 外层滚动函数
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  const answerQuestionsScroll = (e: any) => {
    // 关联标题文字显示的判断方法
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    if (e.target.scrollTop < renderNumber0.current) {
      Bus.emit(`changeNavStatus`, {
        status: '2',
      });
    } else if (e.target.scrollTop > renderNumber0.current && e.target.scrollTop > renderNumber1.current) {
      Bus.emit(`changeNavStatus`, {
        status: '1',
      });
    }

    // 判断是否已经到了最后一个组件展示
    // ～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～
    if (chooseNum.current === 6) {
      // 是的话，开启一个定时器进行根据动画进度打开关闭此的开关
      setTimeout(() => {
        hideCom.current = true;
      }, (finishObj.itemFinishTime + finishObj.constList.length * finishObj.delayTime.item + 2.5) * 1000);
    }
  };

  // 元素节点
  // --------------------------------------------------------------------------------------------------------------
  return (
    <div className="AnswerQuestions" ref={answerQuestions} onScroll={answerQuestionsScroll}>
      {/* 滚动内容盒子 */}
      <div className="slideBox" ref={slideBox}>
        {/* 头部背景图片 */}
        {/* ================================================================ */}
        {AnswerQuestionsHeadShow && (
          <div className={`AnswerQuestionsHead ${window.screen.height <= minimumScreen ? 'smllBack' : ''}`}>
            <Lottie options={defaultOptions} width={remToPx(7.5)} />
          </div>
        )}

        {/* 花藤组件 */}
        {/* ================================================================ */}
        <Rattan firstEffect={flowerFirstOpen} smallModel={window.screen.height <= minimumScreen} ref={flower}></Rattan>

        {/* 内容渲染函数 */}
        {/* ================================================================ */}
        {renderList}
      </div>

      {/* 接口报错弹窗 */}
      {/* ================================================================ */}
      <Mask id="disclaimer" name="disclaimerModal" showModal={showDisclaimer} style={{ display: 'block' }} onHide={(): void => {}} maskCloseable={false}>
        <div className="AnswerQuestionsMistake">
          {/* 头像 */}
          <div className="AnswerQuestionsMistakeHead"></div>

          {/* 文字内容 */}
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
          <div className="AnswerQuestionsMistakeText">{I18n.t('popup_reminder')}</div>

          {/* 按键内容 */}
          {/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */}
          <div className="AnswerQuestionsMistakeBtn" onClick={haveImage}>
            {I18n.t('popup_button')}
          </div>
        </div>
      </Mask>

      {/* 题目音频区域 */}
      {/* ================================================================ */}
      <audio src={answer1_a} id="answer1_a" muted={audioMet === '0'}></audio>
      <audio src={answer1_b} id="answer1_b" muted={audioMet === '0'}></audio>
      <audio src={answer2_a} id="answer2_a" muted={audioMet === '0'}></audio>
      <audio src={answer2_b} id="answer2_b" muted={audioMet === '0'}></audio>
      <audio src={answer3_a} id="answer3_a" muted={audioMet === '0'}></audio>
      <audio src={answer3_b} id="answer3_b" muted={audioMet === '0'}></audio>
      <audio src={answer4_a} id="answer4_a" muted={audioMet === '0'}></audio>
      <audio src={answer4_b} id="answer4_b" muted={audioMet === '0'}></audio>
      <audio src={answer5_a} id="answer5_a" muted={audioMet === '0'}></audio>
      <audio src={answer5_b} id="answer5_b" muted={audioMet === '0'}></audio>

      {/* 遮罩层 */}
      {/* ================================================================ */}
      {mask && <div className="AnswerQuestionsMask" onClick={ifMask} style={{ height: answerQuestions.current.offsetHeight }}></div>}
    </div>
  );
};

export default React.memo(AnswerQuestions);
