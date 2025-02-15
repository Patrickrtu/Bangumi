/*
 * 触摸反馈整合 (因封装前并未有官方的 Pressable，没必要前不会考虑重新整合)
 * @Author: czy0729
 * @Date: 2019-03-28 15:35:04
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-05-18 19:06:56
 */
import React from 'react'
import { observer } from 'mobx-react'
import { _ } from '@stores'
// import { syncSystemStore } from '@utils/async'
// import { IOS } from '@constants'
import { STORYBOOK } from '@constants'
import TouchableWithoutFeedback from './touchable-without-feedback'
// import TouchableNativeFeedback from './touchable-native-feedback'
import TouchableHighlight from './touchable-highlight'
import TouchableOpacity from './touchable-opacity'
import TouchableAnimated from './touchable-animated'
import { defaultHitSlop, callOnceInInterval } from './utils'
import { Props as TouchableProps } from './types'

export { TouchableProps }

const EXTRA_BUTTON_PROPS = {
  rippleColor: 'rgba(255, 255, 255, 0)',
  exclusive: true,
  disabled: true
} as const

const EXTRA_BUTTON_PROPS_DARK = {
  rippleColor: 'rgba(0, 0, 0, 0)',
  exclusive: true,
  disabled: true
} as const

export const Touchable = observer(
  ({
    style,
    withoutFeedback = false,
    highlight = false,
    delay = true,
    hitSlop = defaultHitSlop,
    delayPressIn = 0,
    delayPressOut = 0,
    useRN = false,
    ripple,
    animate,
    scale,
    onPress = () => {},
    children,
    ...other
  }: TouchableProps) => {
    /** @todo 安卓开发环境热使用 RNGH 的组件会导致 GestureHandler already initialized 问题, 暂时规避 */
    // const _useRN = !IOS && DEV ? true : useRN
    const passProps = {
      useRN,
      style,
      hitSlop,
      delayPressIn,
      delayPressOut,
      extraButtonProps: _.select(EXTRA_BUTTON_PROPS, EXTRA_BUTTON_PROPS_DARK),
      onPress: delay ? () => callOnceInInterval(onPress) : onPress,
      children,
      ...other
    }
    if (STORYBOOK) passProps.useRN = true

    if (withoutFeedback) return <TouchableWithoutFeedback {...passProps} />

    // const _ripple = ripple === undefined ? syncSystemStore().setting.ripple : ripple
    // if (!IOS && _ripple) return <TouchableNativeFeedback {...passProps} />

    if (highlight) return <TouchableHighlight {...passProps} />

    if (!STORYBOOK && !useRN && animate) {
      return <TouchableAnimated {...passProps} scale={scale} />
    }

    // 绝大部分情况会 return 这个
    return <TouchableOpacity {...passProps} />
  }
)
