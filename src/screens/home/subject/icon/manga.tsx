/*
 * @Author: czy0729
 * @Date: 2021-01-16 17:31:24
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-06 03:08:11
 */
import React from 'react'
import { Flex, Touchable, Text, Iconfont, Heatmap } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import styles from './styles'
import { Ctx } from '../types'

function IconManga(props, { $ }: Ctx) {
  if ($.isLimit || !$.source?.mangaId) return null

  return (
    <Touchable style={styles.icon} onPress={$.toManhuadb}>
      <Flex>
        <Iconfont name='md-visibility' />
        <Text style={_.ml.xs} size={13} type='sub'>
          漫画
        </Text>
      </Flex>
      <Heatmap id='条目.阅读漫画' />
    </Touchable>
  )
}

export default obc(IconManga)
