/*
 * @Author: czy0729
 * @Date: 2022-03-23 09:54:07
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-29 05:26:39
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text, Iconfont } from '@components'
import { Popover, Tag } from '@_'
import { _ } from '@stores'
import { confirm, stl } from '@utils'
import { obc } from '@utils/decorators'
import Form from '../form'
import { Ctx } from '../types'
import { styles } from './styles'

const Item = ({ type, id, uuid, active, name, url, sort }, { $ }: Ctx) => {
  const actions = []
  const isBase = !!id
  const isActive = !!active
  actions.push(isBase ? '编辑排序' : '编辑', isActive ? '停用' : '启用')
  if (!isBase) actions.push('删除')
  actions.push('测试')

  const { edit } = $.state
  const isEdit =
    edit.type === type &&
    ((id && edit.item.id === id) || (uuid && edit.item.uuid === uuid))
  return (
    <>
      <Flex style={stl(styles.item, !isActive && styles.disabled)}>
        <Flex.Item>
          <Text size={15} bold>
            {name}
            {isBase && (
              <Text type='sub' size={10} lineHeight={15} bold>
                {' '}
                示例
              </Text>
            )}
          </Text>
          <Flex style={_.mt.sm}>
            {sort >= 0 && <Tag style={_.mr.sm} value={sort} />}
            <Flex.Item>
              <Text size={12} type='sub' numberOfLines={1}>
                {url}
              </Text>
            </Flex.Item>
          </Flex>
        </Flex.Item>
        {isActive && <Tag style={_.ml.md} value='生效' />}
        <Popover
          style={_.ml.md}
          data={actions}
          onSelect={title => {
            switch (title) {
              case '编辑排序':
                $.openEdit(type, {
                  id,
                  uuid: '',
                  name,
                  url,
                  sort,
                  active
                })
                break

              case '编辑':
                $.openEdit(type, {
                  id: '',
                  uuid,
                  name,
                  url,
                  sort,
                  active
                })
                break

              case '删除':
                confirm(`确定删除 [${name}] ?`, () => {
                  $.deleteItem({
                    uuid,
                    type
                  })
                })
                break

              case '停用':
                $.disableItem({
                  id,
                  uuid,
                  type
                })
                break

              case '启用':
                $.activeItem({
                  id,
                  uuid,
                  type
                })
                break

              case '测试':
                $.go({
                  type,
                  url
                })
                break

              default:
                break
            }
          }}
        >
          <View style={styles.touch}>
            <Iconfont name='md-more-vert' color={_.colorDesc} />
          </View>
        </Popover>
      </Flex>
      {isEdit && <Form name={name} url={url} isBase={isBase} />}
    </>
  )
}

export default obc(Item)
