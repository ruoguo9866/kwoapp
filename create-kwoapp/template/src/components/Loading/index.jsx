import { Mask, SpinLoading } from 'antd-mobile'
import PropTypes from 'prop-types'

/**
 * 全局Loading组件
 * @param {boolean} visible - 是否显示loading
 * @param {string} text - loading文字提示
 */
function Loading({ visible, text = '加载中...' }) {
  // 不可见时直接不渲染，避免任何遮罩拦截点击
  if (!visible) return null

  return (
    <Mask
      visible={visible}
      disableBodyScroll={false}
      opacity={0.6}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        // 允许点击事件穿透到底层页面，避免误拦截
        pointerEvents: 'none',
      }}
    >
      <SpinLoading
        style={{
          '--size': '48px',
          '--color': '#1677ff',
        }}
      />
      <div
        style={{
          marginTop: '12px',
          color: '#fff',
          fontSize: '14px',
        }}
      >
        {text}
      </div>
    </Mask>
  )
}

Loading.propTypes = {
  visible: PropTypes.bool.isRequired,
  text: PropTypes.string,
}

export default Loading