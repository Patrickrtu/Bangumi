/*
 * @Author: czy0729
 * @Date: 2020-04-28 12:02:22
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-20 12:06:04
 */
import React from 'react'
import { View } from 'react-native'
import { Expand, Flex, Text, Image, Touchable } from '@components'
import { _ } from '@stores'
import { cnjp } from '@utils'
import { t } from '@utils/fetch'
import { useExpandLazy, useObserver } from '@utils/hooks'
import { EVENT, IMG_WIDTH_SM, IMG_HEIGHT_SM } from '@constants'
import { InView, Cover, Tag } from '../../base'
import { AVATAR_SIZE } from './ds'
import { memoStyles } from './styles'
import { Props as ItemVoiceProps } from './types'

export { ItemVoiceProps }

const ITEM_HEIGHT = 132

export const ItemVoice = ({
  style,
  navigation,
  event = EVENT,
  index,
  id,
  name,
  nameCn,
  cover,
  subject = [],
  children
}: ItemVoiceProps) => {
  const { list, onExpand } = useExpandLazy(subject, 4)

  return useObserver(() => {
    const styles = memoStyles()
    const cn = cnjp(nameCn, name)
    const jp = cnjp(name, nameCn)
    const y = ITEM_HEIGHT * index + 1
    const content = (
      <>
        <Flex style={styles.wrap} align='start'>
          <Flex.Item flex={1.8}>
            <Touchable
              animate
              onPress={() => {
                t(event.id, {
                  ...event.data,
                  to: 'Mono',
                  monoId: id
                })

                navigation.push('Mono', {
                  monoId: `character/${id}`,
                  _name: nameCn,
                  _jp: name,
                  _image: cover
                })
              }}
            >
              <Flex align='start'>
                <InView style={styles.inViewAvatar} y={y}>
                  <Image size={AVATAR_SIZE} src={cover} radius shadow />
                </InView>
                <Flex.Item style={_.ml.sm}>
                  <Text size={12} bold>
                    {cn}
                  </Text>
                  {!!jp && jp !== cn && (
                    <Text style={_.mt.xs} size={11} type='sub' lineHeight={12} bold>
                      {jp}
                    </Text>
                  )}
                </Flex.Item>
              </Flex>
            </Touchable>
          </Flex.Item>
          <Flex.Item style={_.ml.sm} flex={3.2}>
            {list.map((item, idx) => {
              const cn = cnjp(item.nameCn, item.name)
              const jp = cnjp(item.name, item.nameCn)
              return (
                <Touchable
                  key={item.id}
                  style={idx !== 0 && _.mt.md}
                  animate
                  onPress={() => {
                    t(event.id, {
                      ...event.data,
                      to: 'Subject',
                      subjectId: item.id
                    })

                    navigation.push('Subject', {
                      subjectId: item.id,
                      _jp: item.name,
                      _cn: item.nameCn,
                      _image: item.cover
                    })
                  }}
                >
                  <Flex align='start'>
                    <Flex.Item style={_.mr.md}>
                      <Text align='right' size={12} bold>
                        {cn}
                      </Text>
                      <Text
                        style={_.mt.xs}
                        size={11}
                        type='sub'
                        align='right'
                        lineHeight={12}
                        bold
                      >
                        {jp}
                      </Text>
                      <Flex style={_.mt.sm} justify='end'>
                        <Tag value={item.staff} />
                      </Flex>
                    </Flex.Item>
                    <InView style={styles.inViewCover} y={y}>
                      <Cover
                        size={IMG_WIDTH_SM}
                        height={IMG_HEIGHT_SM}
                        src={item.cover}
                        radius
                        shadow
                      />
                    </InView>
                  </Flex>
                </Touchable>
              )
            })}
          </Flex.Item>
        </Flex>
        {children}
      </>
    )

    if (list.length >= 4) {
      return (
        <Expand style={style} ratio={1.8} onExpand={onExpand}>
          {content}
        </Expand>
      )
    }

    return <View style={style}>{content}</View>
  })
}
