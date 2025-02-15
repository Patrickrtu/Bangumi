/*
 * @Author: czy0729
 * @Date: 2023-03-26 05:32:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-28 06:56:13
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Iconfont, Text } from '@components'
import { _ } from '@stores'
import { titleCase } from '@utils'
import { ob } from '@utils/decorators'
import { styles } from './styles'

function Content({ icon, size, type, collection }) {
  return (
    <View style={styles.content}>
      <Flex style={styles.icon} justify='center'>
        <Iconfont name={icon} size={size} color={_[`color${titleCase(type)}`]} />
      </Flex>
      <Text style={styles.text} type={type} size={11} align='center'>
        {collection}
      </Text>
    </View>
  )
}

export default ob(Content)
