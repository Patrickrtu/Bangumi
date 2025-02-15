/*
 * @Author: czy0729
 * @Date: 2023-03-26 03:37:41
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-26 04:25:10
 */
import React from 'react'
import { Flex, Text } from '@components'
import { _ } from '@stores'
import { ob } from '@utils/decorators'

function TabBarLabel({ focused, route }) {
  // global.rerender('Home.Tab.TabBarLabel')

  return (
    <Flex style={_.container.block} justify='center'>
      <Text type='title' size={13} bold={focused}>
        {route.title}
      </Text>
    </Flex>
  )
}

export default ob(TabBarLabel)
