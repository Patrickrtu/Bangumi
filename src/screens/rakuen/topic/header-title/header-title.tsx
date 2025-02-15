/*
 * @Author: czy0729
 * @Date: 2022-09-28 17:24:36
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-05-16 16:38:01
 */
import React from 'react'
import { Flex, Text, UserStatus } from '@components'
import { Avatar } from '@_'
import { _ } from '@stores'
import { memo } from '@utils/decorators'
import { IMG_WIDTH, DEFAULT_PROPS } from './ds'
import { styles } from './styles'

export default memo(({ navigation, avatar, userId, userName, title, group }) => {
  // global.rerender('Topic.HeaderTitle.Main')

  const texts = [userName || group, group].filter(item => !!item).join(' · ')
  return (
    <Flex style={styles.container}>
      {!!avatar && (
        <UserStatus userId={userId}>
          <Avatar
            navigation={navigation}
            size={IMG_WIDTH}
            src={avatar}
            userId={userId}
            name={userName}
          />
        </UserStatus>
      )}
      <Flex.Item style={_.ml.sm}>
        <Text size={13} numberOfLines={1}>
          {title}
        </Text>
        {!!texts && (
          <Text type='sub' size={10} lineHeight={12} bold numberOfLines={1}>
            {texts}
          </Text>
        )}
      </Flex.Item>
    </Flex>
  )
}, DEFAULT_PROPS)
