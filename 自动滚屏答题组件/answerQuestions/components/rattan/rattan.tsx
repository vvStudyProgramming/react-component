/* 藤组件

*使用属性

*交互方法

 */
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import './rattan.scss'; // 样式引入

// 接口定义
interface Props {
  scrollSwitch?: boolean;
  smallModel?: boolean;
  firstEffect?: boolean;
  topicHeight?: number;
}

const Tattan = forwardRef((props: Props, ref: any) => {
  // 参数解构
  const {
    firstEffect = false, // 首次动画的开关
    smallModel = false, // 小屏幕
  } = props;

  // 变量声明区域
  // ------------------------------------------------------------------------------
  const tattan = useRef(null); // 外层盒子ref
  useImperativeHandle(ref, () => ({
    domRef: tattan.current,
  }));

  // 函数区域
  // ------------------------------------------------------------------------------

  return (
    <div className={`Tattan ${smallModel ? 'smllHead' : ''}`} ref={tattan}>
      {/* 左上花藤 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className={`TattanLeftTop ${firstEffect ? 'openLeftTop' : ''}`}></div>

      {/* 左下花藤 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className={`TattanLeftBottom ${firstEffect ? 'openLeftBottom' : ''}`}></div>

      {/* 右花藤 */}
      {/* ------------------------------------------------------------------------------ */}
      <div className={`TattanRight ${firstEffect ? 'openRight' : ''}`}></div>
    </div>
  );
});

export default React.memo(Tattan);
