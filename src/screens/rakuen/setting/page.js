/*
 * @Author: czy0729
 * @Date: 2022-03-15 23:05:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-12 06:35:16
 */
import React from 'react'
import {
  Page,
  ScrollView,
  SwitchPro,
  Flex,
  SegmentedControl,
  Input,
  Touchable,
  Iconfont
} from '@components'
import { ItemSetting } from '@_'
import { _, rakuenStore } from '@stores'
import { ob } from '@utils/decorators'
import { t } from '@utils/fetch'
import { info } from '@utils/ui'
import { MODEL_RAKUEN_SCROLL_DIRECTION } from '@constants/model'
import Block from '../../user/setting/block'
import Tip from '../../user/setting/tip'
import History from './history'

const scrollDirectionDS = MODEL_RAKUEN_SCROLL_DIRECTION.data.map(item => item.label)

export default
@ob
class RakuenSetting extends React.Component {
  state = {
    keyword: ''
  }

  onChange = keyword => {
    this.setState({
      keyword: keyword.trim()
    })
  }

  onSubmit = () => {
    const { keyword } = this.state
    if (!keyword.length) {
      info('不能为空')
      return
    }

    rakuenStore.addBlockKeyword(keyword)
    this.setState({
      keyword: ''
    })
  }

  get setting() {
    return rakuenStore.setting
  }

  renderTopic() {
    const { matchLink, acSearch, quote, quoteAvatar, scrollDirection } = this.setting
    return (
      <Block>
        <Tip>帖子</Tip>
        <ItemSetting
          hd='楼层链接显示成信息块'
          information='若楼层出现特定页面链接，使用不同的UI代替'
          ft={
            <SwitchPro
              style={this.styles.switch}
              value={matchLink}
              onSyncPress={() => {
                t('超展开设置.切换', {
                  title: '显示信息块',
                  checked: !matchLink
                })
                rakuenStore.switchSetting('matchLink')
              }}
            />
          }
          withoutFeedback
        />
        <ItemSetting
          hd='[实验性] 楼层内容猜测条目'
          information='使用条目词库对楼层文字进行猜测匹配，若匹配成功文字下方显示下划线，点击直接去到条目页面'
          ft={
            <SwitchPro
              style={this.styles.switch}
              value={acSearch}
              onSyncPress={() => {
                t('超展开设置.切换', {
                  title: '猜测条目',
                  checked: !acSearch
                })
                rakuenStore.switchSetting('acSearch')
              }}
            />
          }
          withoutFeedback
        />
        <ItemSetting
          hd='展开引用'
          information='展开子回复中上一级的回复内容'
          ft={
            <SwitchPro
              style={this.styles.switch}
              value={quote}
              onSyncPress={() => {
                t('超展开设置.切换', {
                  title: '展开引用',
                  checked: !quote
                })
                rakuenStore.switchSetting('quote')
              }}
            />
          }
          withoutFeedback
        />
        {quote && (
          <ItemSetting
            hd='显示引用头像'
            ft={
              <SwitchPro
                style={this.styles.switch}
                value={quoteAvatar}
                onSyncPress={() => {
                  t('超展开设置.切换', {
                    title: '显示引用头像',
                    checked: !quoteAvatar
                  })
                  rakuenStore.switchSetting('quoteAvatar')
                }}
              />
            }
            withoutFeedback
          />
        )}
        <ItemSetting
          border
          hd='楼层直达条'
          ft={
            <SegmentedControl
              style={this.styles.segmentedControl}
              backgroundColor={_.select(_.colorBg, _.colorPlain)}
              size={12}
              values={scrollDirectionDS}
              selectedIndex={MODEL_RAKUEN_SCROLL_DIRECTION.data.findIndex(
                item => item.value === scrollDirection
              )}
              onValueChange={title => {
                t('超展开设置.切换', {
                  title: '楼层导航条方向',
                  value: title
                })
                rakuenStore.setScrollDirection(
                  MODEL_RAKUEN_SCROLL_DIRECTION.getValue(title)
                )
              }}
            />
          }
        />
      </Block>
    )
  }

  renderList() {
    const { filterDelete, isBlockDefaultUser, isMarkOldTopic } = this.setting
    return (
      <Block>
        <Tip>列表</Tip>
        <ItemSetting
          hd='过滤用户删除的楼层'
          ft={
            <SwitchPro
              style={this.styles.switch}
              value={filterDelete}
              onSyncPress={() => {
                t('超展开设置.切换', {
                  title: '过滤删除',
                  checked: !filterDelete
                })
                rakuenStore.switchSetting('filterDelete')
              }}
            />
          }
          withoutFeedback
        />
        <ItemSetting
          hd='屏蔽疑似广告姬'
          information='屏蔽默认头像发布且回复数小于4的帖子'
          ft={
            <SwitchPro
              style={this.styles.switch}
              value={isBlockDefaultUser}
              onSyncPress={() => {
                t('超展开设置.切换', {
                  title: '屏蔽广告',
                  checked: !isBlockDefaultUser
                })
                rakuenStore.switchSetting('isBlockDefaultUser')
              }}
            />
          }
          withoutFeedback
        />
        <ItemSetting
          information='标记发布时间大于1年的帖子'
          hd='标记坟贴'
          ft={
            <SwitchPro
              style={this.styles.switch}
              value={isMarkOldTopic}
              onSyncPress={() => {
                t('超展开设置.切换', {
                  title: '坟贴',
                  checked: !isMarkOldTopic
                })
                rakuenStore.switchSetting('isMarkOldTopic')
              }}
            />
          }
          withoutFeedback
        />
      </Block>
    )
  }

  renderCustom() {
    const { keyword } = this.state
    return (
      <Block>
        <Tip>屏蔽关键字（对标题、正文内容生效）</Tip>
        <History
          data={this.setting.blockKeywords}
          onDelete={item => {
            t('超展开设置.取消关键字', {
              item
            })
            rakuenStore.deleteBlockKeyword(item)
          }}
        />
        <Flex style={this.styles.section}>
          <Flex.Item>
            <Input
              style={this.styles.input}
              value={keyword}
              placeholder='输入关键字'
              returnKeyType='search'
              returnKeyLabel='添加'
              onChangeText={this.onChange}
              onSubmitEditing={this.onSubmit}
            />
          </Flex.Item>
          <Touchable style={_.ml.md} onPress={this.onSubmit}>
            <Flex style={this.styles.icon} justify='center'>
              <Iconfont name='md-add' size={24} />
            </Flex>
          </Touchable>
        </Flex>
      </Block>
    )
  }

  renderBlock() {
    const { navigation } = this.props
    return (
      <>
        <Block>
          <Tip>屏蔽小组 / 条目（对帖子所属小组名生效）</Tip>
          <History
            data={this.setting.blockGroups}
            onDelete={item => {
              t('超展开设置.取消关键字', {
                item
              })
              rakuenStore.deleteBlockGroup(item)
            }}
          />
        </Block>
        <Block>
          <Tip>屏蔽用户（对发帖人、楼层主、条目评分留言人生效）</Tip>
          <History
            navigation={navigation}
            data={this.setting.blockUserIds}
            onDelete={item => {
              t('超展开设置.取消用户', {
                item
              })
              rakuenStore.deleteBlockUser(item)
            }}
          />
        </Block>
      </>
    )
  }

  render() {
    return (
      <Page style={_.select(_.container.bg, _.container.plain)}>
        <ScrollView contentContainerStyle={this.styles.container}>
          {this.renderTopic()}
          {this.renderList()}
          {this.renderCustom()}
          {this.renderBlock()}
        </ScrollView>
      </Page>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(() => ({
  container: {
    paddingTop: _.sm,
    paddingBottom: _.bottom
  },
  segmentedControl: {
    height: 28 * _.ratio,
    width: 164 * _.ratio
  },
  switch: {
    marginRight: -4,
    transform: [
      {
        scale: _.device(0.8, 1.12)
      }
    ]
  },
  icon: {
    width: 36,
    height: 36
  },
  information: {
    maxWidth: '80%',
    marginTop: _.xs
  },
  section: {
    paddingVertical: _.sm,
    paddingRight: _.sm,
    paddingLeft: _._wind
  },
  input: {
    height: 44,
    paddingVertical: 0
  }
}))
