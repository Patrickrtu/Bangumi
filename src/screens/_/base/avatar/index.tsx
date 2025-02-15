/*
 * 头像
 * @Author: czy0729
 * @Date: 2019-05-19 17:10:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-05-14 16:49:56
 */
import React from 'react'
import { View } from 'react-native'
import { Image, Touchable } from '@components'
import { _, systemStore } from '@stores'
import { stl } from '@utils'
import { HOST_API_V0 } from '@utils/fetch.v0/ds'
import { ob } from '@utils/decorators'
import { HOST_CDN, IOS } from '@constants'
import { AnyObject } from '@types'
import {
  USER_LARGE,
  fixedHD,
  fixedLarge,
  fixedSize,
  getAvatar,
  getCDNAvatar,
  getOnPress,
  getRadius
} from './utils'
import { memoStyles } from './styles'
import { Props as AvatarProps } from './types'

export { AvatarProps }

export const Avatar = ob(
  ({
    style,
    navigation,
    userId,
    name,
    src,
    size = 40,
    borderWidth,
    borderColor = _.colorBorder,
    event = {},
    params = {},
    round,
    radius,
    placeholder,
    fallbackSrc,
    onPress,
    onLongPress
  }: AvatarProps) => {
    const styles = memoStyles()
    let _src = getAvatar(src)
    const _size = _.r(size)
    const _radius = getRadius(radius, round, _size)
    const _onPress = getOnPress(onPress, {
      navigation,
      userId,
      event,
      src: _src,
      name,
      params
    })

    /**
     * [安卓] gif 图片不能直接设置 borderRadius, 需要再包一层
     * //lain.bgm.tv/pic/user/l/icon.jpg 实际上根本不是 jpg 而是 gif
     */
    if (!IOS && typeof src === 'string' && src.includes('/icon.jpg')) {
      const _style = [
        styles.avatar,
        {
          width: _size,
          height: _size,
          borderWidth: 0
        },
        style
      ]
      const { avatarRound } = systemStore.setting
      if (avatarRound) {
        _style.push({
          borderRadius: _size / 2
        })
      }
      return (
        <View style={_style}>
          <Image
            size={_size}
            src={_src}
            radius={_radius}
            quality={false}
            placeholder={placeholder}
            fallbackSrc={fallbackSrc || src}
            scale={0.8}
            onPress={_onPress}
            onLongPress={onLongPress}
          />
        </View>
      )
    }

    _src = fixedLarge(_src)
    _src = fixedSize(_src)
    _src = fixedHD(_src)
    _src = getCDNAvatar(_src)

    const isUrl = typeof _src === 'string'
    const { dev } = systemStore.state
    const containerStyle = stl(
      style,
      dev && isUrl && _src.includes(HOST_CDN) && styles.dev
    )
    const passProps: AnyObject = {
      key: isUrl ? _src : 'avatar',
      size: _size,
      src: _src,
      radius: _radius,
      border: borderColor,
      borderWidth: borderWidth,
      quality: false,
      placeholder: placeholder,

      // @issue 有些第三方地址使用 rn-fast-image 不使用 fallback 都会直接加载失败
      fallback: isUrl && !_src.includes(USER_LARGE) && !_src.includes(HOST_API_V0),
      fallbackSrc: fixedHD(fixedSize(String(fallbackSrc || src)))
    }
    if (_onPress || onLongPress) {
      return (
        <Touchable
          style={containerStyle}
          animate
          scale={0.88}
          onPress={_onPress}
          onLongPress={onLongPress}
        >
          <Image {...passProps} />
        </Touchable>
      )
    }

    passProps.style = containerStyle
    return <Image {...passProps} />
  }
)
