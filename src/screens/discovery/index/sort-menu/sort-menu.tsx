/*
 * @Author: czy0729
 * @Date: 2022-09-10 07:56:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-11 11:34:04
 */
import React, { useState, useMemo, useCallback } from 'react'
import { View } from 'react-native'
import { DraggableGrid } from '@components/@/react-native-draggable-grid/draggable-grid'
import { Flex, Text } from '@components'
import { memo } from '@utils/decorators'
import { rerender } from '@utils/dev'
import { ORIENTATION_PORTRAIT } from '@constants'
import Btn from '../btn'
import { getMenus } from '../ds'
import Btns from './btns'
import { DEFAULT_PROPS } from './ds'

export default memo(
  ({
    styles,
    orientation,
    dragging,
    discoveryMenu,
    discoveryMenuNum,
    onToggle,
    onSubmit
  }) => {
    rerender('Discovery.SortMenu.Main')

    const [menu, setMenu] = useState(discoveryMenu)
    const menus = useMemo(() => getMenus(menu), [menu])

    const openIndex = menus.findIndex(item => item.key === 'Open')
    const renderItem = useCallback(
      (item, index?: number) => (
        <View
          key={item.key}
          style={
            index > openIndex &&
            item.key !== 'Cancel' &&
            item.key !== 'Save' &&
            styles.transparent
          }
        >
          <Btn item={item} />
        </View>
      ),
      [openIndex, styles.transparent]
    )

    const onDragRelease = useCallback(data => {
      const _menu = []
      data.forEach(item => {
        if (item.key === 'Save') return
        if (item.key === 'Split') return _menu.push('Open')
        _menu.push(item.key)
      })
      setMenu(_menu)
    }, [])

    const onCancel = useCallback(() => {
      onToggle()
      setTimeout(() => {
        setMenu(discoveryMenu)
      }, 80)
    }, [discoveryMenu, onToggle])

    const onSave = useCallback(() => {
      onSubmit(menu)
      setTimeout(() => {
        onToggle()
      }, 80)
    }, [menu, onSubmit, onToggle])

    const btns = useMemo(
      () => dragging && <Btns setMenu={setMenu} onCancel={onCancel} onSave={onSave} />,
      [dragging, onCancel, onSave]
    )

    const isPortrait = orientation === ORIENTATION_PORTRAIT
    let data: any[]
    if (dragging) {
      data = [
        ...menus.slice(0, openIndex),
        {
          key: 'Split',
          name: '后面隐藏',
          text: '|',
          size: 20
        },
        ...menus.slice(openIndex + 1, menus.length)
      ]
    } else {
      data = menus.filter((_item, index) => index <= openIndex)
    }

    return (
      <View>
        {isPortrait && dragging && (
          <Text style={styles.text} size={13} bold>
            按住拖拽排序，拖动到分割线左侧显示，右侧隐藏
          </Text>
        )}
        {!isPortrait && btns}
        {dragging ? (
          <DraggableGrid
            key={`${orientation}|${discoveryMenuNum}`}
            data={data}
            numColumns={discoveryMenuNum}
            itemHeight={styles.dragItem.height}
            renderItem={renderItem}
            onDragRelease={onDragRelease}
          />
        ) : (
          <Flex wrap='wrap'>{data.map(item => renderItem(item))}</Flex>
        )}
        {isPortrait && btns}
      </View>
    )
  },
  DEFAULT_PROPS
)
