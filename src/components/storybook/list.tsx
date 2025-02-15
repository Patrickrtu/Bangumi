/*
 * @Author: czy0729
 * @Date: 2023-04-04 21:21:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-15 04:58:32
 */
import React from 'react'
import { ScrollView } from 'react-native'
import { _ } from '@stores'
import { stl } from '@utils'
import { STORYBOOK_WIDTH, SCROLL_VIEW_RESET_PROPS, STORYBOOK_GRID } from '@constants'
import { StorybookListProps } from './types'

export const StorybookList = ({
  style,
  wind,
  space,
  children,
  ...other
}: StorybookListProps) => {
  return (
    <ScrollView
      style={stl(styles.scrollView, style)}
      contentContainerStyle={stl(wind && styles.wind, space && styles.space)}
      {...other}
      {...SCROLL_VIEW_RESET_PROPS}
    >
      {children}
    </ScrollView>
  )
}

const styles = _.create({
  scrollView: {
    ...(STORYBOOK_GRID
      ? {
          width: STORYBOOK_WIDTH + 4,
          height: '96vh',
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.64)',
          borderRadius: _.radiusMd
        }
      : {
          width: STORYBOOK_WIDTH,
          height: '100vh'
        }),
    backgroundColor: _.colorPlain,
    overflow: 'hidden',
    overflowY: 'hidden'
  },
  wind: {
    paddingHorizontal: _.wind
  },
  space: {
    paddingVertical: _.md
  }
})
