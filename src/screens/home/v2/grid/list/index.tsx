/*
 * @Author: czy0729
 * @Date: 2022-11-21 06:55:28
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-21 07:32:31
 */
import React from 'react'
import { View } from 'react-native'
import { PaginationList2 } from '@_'
import { systemStore } from '@stores'
import { keyExtractor, renderItem } from './utils'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { Ctx } from '../../types'
import { memoStyles } from '../styles'

function List({ title }, { $ }: Ctx) {
  // global.rerender('Home.Grid.List')

  const styles = memoStyles()
  const { homeGridCoverLayout } = systemStore.setting
  const numColumns = _.isMobileLanscape ? 9 : _.device(4, 5)
  return (
    <PaginationList2
      key={`${_.orientation}${numColumns}`}
      contentContainerStyle={styles.contentContainerStyle}
      keyExtractor={keyExtractor}
      data={$.currentCollection(title).list}
      limit={homeGridCoverLayout === 'square' ? 20 : 16}
      numColumns={numColumns}
      footerNoMoreDataComponent={<View />}
      footerNoMoreDataText=''
      renderItem={renderItem}
      onHeaderRefresh={$.onHeaderRefresh}
    />
  )
}

export default obc(List)
