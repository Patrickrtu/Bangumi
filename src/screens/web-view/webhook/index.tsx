/*
 * @Author: czy0729
 * @Date: 2023-03-10 18:42:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-11 15:21:52
 */
import React from 'react'
import { View } from 'react-native'
import { ScrollView, Page, Flex, Text, SwitchPro, Input, Expand } from '@components'
import { _, systemStore } from '@stores'
import { date } from '@utils'
import { useObserver } from '@utils/hooks'
import { logs } from '@utils/webhooks'
import Header from './header'
import { memoStyles } from './styles'

const Webhook = () => {
  return useObserver(() => {
    const styles = memoStyles()
    const { webhook, webhookUrl } = systemStore.setting
    return (
      <>
        <Header />
        <Page style={styles.container}>
          <Flex>
            <Flex.Item>
              <Text size={15} bold>
                启用
                <Text size={12} lineHeight={15} type='sub' bold>
                  {'  '}不清楚什么用途的请勿开启
                </Text>
              </Text>
            </Flex.Item>
            <SwitchPro
              style={styles.switch}
              value={webhook}
              onSyncPress={() => {
                systemStore.switchSetting('webhook')
              }}
            />
          </Flex>
          <View style={_.mt.md}>
            <Text size={15} bold>
              地址
            </Text>
            <Input
              style={styles.input}
              placeholder={'输入你的 webhook 地址\n默认：https://postman-echo.com/post'}
              multiline
              numberOfLines={3}
              defaultValue={webhookUrl || ''}
              onChangeText={text => {
                systemStore.setSetting('webhookUrl', String(text).trim())
              }}
            />
          </View>
          <ScrollView style={_.mt.md} contentContainerStyle={styles.scrollView}>
            {logs.map((item, index) => (
              <View style={styles.item}>
                <Expand key={`${index}|${item.ts}`} ratio={2} linearGradient={false}>
                  <Flex>
                    <Text
                      type={
                        item.label === 'ERROR'
                          ? 'danger'
                          : item.label === 'POST'
                          ? 'bid'
                          : 'warning'
                      }
                      bold
                    >
                      {item.label}
                    </Text>
                    <Text style={_.ml.sm} type='sub' bold>
                      {date('y-m-d H:i:s', item.ts)}
                    </Text>
                  </Flex>
                  <Text style={_.mt.sm} size={12}>
                    {item.content}
                  </Text>
                </Expand>
              </View>
            ))}
          </ScrollView>
        </Page>
      </>
    )
  })
}

export default Webhook
