/*
 * @Author: czy0729
 * @Date: 2022-11-20 11:15:18
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-27 22:42:48
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Loading, Mesume, Text } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import GridInfo from '../../grid-info'
import { Ctx } from '../../types'
import { memoStyles } from '../styles'
import { PREV_TEXT } from './ds'

function Info({ title }, { $ }: Ctx) {
  // global.rerender('Home.Grid.Info')

  if (!$.collection._loaded) return <Loading />

  const styles = memoStyles()
  const { current, grid } = $.state
  const isGame = title === '游戏'
  const find = isGame
    ? grid
    : $.currentCollection(title).list.find(item => item.subject_id === current)
  return (
    <View style={isGame ? styles.gameInfo : styles.info}>
      {find ? (
        <GridInfo
          subjectId={find.subject_id}
          subject={find.subject}
          epStatus={find.ep_status}
        />
      ) : (
        <Flex style={styles.noSelect} justify='center' direction='column'>
          <Mesume size={80} />
          <Text style={_.mt.sm} type='sub' align='center'>
            请先点击下方{PREV_TEXT[title]}
          </Text>
        </Flex>
      )}
    </View>
  )
}

export default obc(Info)
