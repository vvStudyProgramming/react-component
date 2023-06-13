import { onelink, Result } from '../constants/index';
import Tool from '@magic-module/common-lib-tool';

/**
 * 像素换算
 * @param user_id
 */
export const remToPx = (number: number): number => {
  // 如果能获取到根元素设置的fontsize
  let remSize = parseFloat(window?.getComputedStyle(document.documentElement)["fontSize"]) || 0;
  // 未获取到根元素fontsize 则自己计算rem
  if (!remSize) {
    remSize = 100 / (750 / document.body.clientWidth);
  }
  // 依然未获取设置固定值
  if (!remSize) {
    remSize = 50;
  }
  return Math.round(remSize * (number * 1000)) / 1000;
}

/**
 * 替换url指定参数
 */
export const replaceQueryString = (url: string, name: string, value: string) => {
  const re = new RegExp(name + '=[^&#]*', 'gi');
  // 先判断是否存在参数
  if (re.test(url)) {
    return url.replace(re, name + '=' + value);
  } else {
    const lastIndex = url.indexOf('#');
    url = url.substring(0, lastIndex === -1 ? url.length : lastIndex); //去掉了#之后内容防止出问题
    return `${url}${url.indexOf('?') == -1 ? '?' : '&'}${name}=${value}`;
  }
}

/**
 * 替换username
 */
export const replaceUsername = (str: string, nickname: string) => {
  const reg = new RegExp('@username', 'g');
  return str.replace(reg, nickname? (`@${nickname}`): 'You')
}

/**
 * 获取onelink数据
 */
export const getOnelink = () => {
  const lang: string = getLang();
  const local: string = getLocal();
  return (onelink as any)[local][lang]?.qrcode;
}

/**
 * 答题组件页面滑动函数
 * 
 * boxElement:最外层父级元素
 * itemElement:内部会滑动的元素
 * delayedMove:延迟滑动的时间
 */
export const moveElement = (boxElement: any, itemElement: any, delayedMove: number, setmask: any, ifMaskClick: any
) => {
  let boxHeight = boxElement.offsetHeight; // 获取到父级的高度

  // 使用异步的方式，得到当前插入后，被插入节点的实际高度
  setTimeout(() => {
    let itemHeight = itemElement.offsetHeight; // 获取异步得到的高度

    // 判断此时成员的高度 是否大于 父级的高度
    if (itemHeight > boxHeight) {
      let he = itemHeight - boxHeight; // 计算此之间的差值
      // 打开遮罩层
      setmask(true)
      // 承接循环定时器
      let clock = requestAnimationFrame(function fn() {
        // 让父级进行滚动
        boxElement.scrollTop += parseInt(boxHeight + boxHeight / 2) / 100;
        let clocks = requestAnimationFrame(fn)

        // 判断如果此时 父级卷入的高度 大于或等于此 差值时清除定时器
        if (he <= boxElement.scrollTop + 1) {

          // 在端内的话，关闭遮罩层;端外的情况下，开启点击函数
          // if (Tool.inApp()) {
          setTimeout(() => {
            setmask(false)
          }, 2250);
          // }else{
            // setTimeout(() => {
            //   ifMaskClick.current=true
            // }, 2250);
          // }

          // 清除定时器
          cancelAnimationFrame(clock);
          cancelAnimationFrame(clocks);
        }
      });
    }
  }, delayedMove * 1000);
};

/**
 * 出血区域计算方法
 * proportionHeight 参考比例的高度
 * proportionWidth  参考比例的宽度
 * nowHeight 目前的高度值
 * 返回最新的宽度值
 */
export const bleedingAreaRatio = (proportionHeight: number, proportionWidth: number, nowHeight: number) => {
  let proportion = proportionHeight / proportionWidth  // 计算出此宽高比
  let nowWidth = nowHeight / proportion  // 根据宽高比计算出对应的宽度

  return nowWidth
}

// 获取活动地区
export const getLocal = (): string => {
  const host = window.location.host;
  if (host.indexOf('activity.tiktok.com') === 0) {
    return 'sg';
  } else if (host.indexOf('m.tiktok.com') === 0) {
    return 'us';
  } else if (host.indexOf('activity.us.tiktok.com') === 0) {
    return 'ttp';
  }
  return 'sg';
}

// 获取页面语言
export const getLang = (): string => {
  let queryRegion: any = window.location.search.match(/lang=?([^&]*)/g);
  queryRegion = queryRegion && queryRegion[0].split('=')[1];
  return queryRegion || 'en';
}

/**
 * 随机数
 */
export const randomNum = (min: number, max: number) => {
  var range = max - min;
  var rand = Math.random();
  var num = min + Math.round(rand * range);
  return num;
}

/**
 * 根据答案换取名词和形容词、文案
 * test: resultGetName('result2'))
 */

export const resultGetName = (key: string) => {

  // 找到对应结果的对象
  const lang = getLang();
  const data = JSON.parse(JSON.stringify(Result.personality[key]));

  // 排除的数据
  const exclude = Result.exclude[lang];
  if (exclude && exclude[key]?.noun) {
    const excludeArr: any = [];
    exclude[key].noun.map((item: number) => {
      excludeArr.push(data.noun[item - 1]);
    })
    excludeArr.map((item: number) => {
      const index = data.noun.indexOf(item);
      data.noun.splice(index, 1);
      data.text.splice(index, 1);
    })
  }
  // console.log(data)

  // 名词
  const nounIndex = randomNum(0, data.noun.length - 1);
  const noun = data.noun[nounIndex];

  // 生成新的描述数组 如最后确定不需要可删掉
  const textArr: any = [];
  for (let i = 0; i < data.text[nounIndex]; i++) {
    textArr.push(i + 1);
  }
  // 排除当前语言不存在的文案数据
  if (exclude && exclude[key]?.text && exclude[key]?.text[nounIndex]) {
    const excludeArr: any = [];
    exclude[key].text[nounIndex].map((item: number) => {
      excludeArr.push(textArr[item - 1]);
    })

    excludeArr.map((item: number) => {
      const index = textArr.indexOf(item);
      textArr.splice(index, 1);
    })
  }
  // 描述索引
  const textIndex = textArr[randomNum(0, textArr.length - 1)];
  // const textIndex = data.text[lang][randomNum(0, data.text[lang].length - 1)];

  // 形容词索引
  const adjIndex = randomNum(0, data.adj - 1);

  // 预测索引
  const forecastIndex = randomNum(0, Result.forecast - 1);

  return {
    result: key,
    noun: noun,
    nounKey: `${key}_noun${nounIndex + 1}`,
    adjKey: `${key}_adj${adjIndex + 1}`,
    text1: `${key}_noun${nounIndex + 1}_description1_${textIndex}`,
    text2: `${key}_noun${nounIndex + 1}_description2`,
    forecastKey: `forecast${forecastIndex + 1}`
  }
}