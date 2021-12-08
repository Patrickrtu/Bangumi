/*
 * @Author: czy0729
 * @Date: 2020-05-02 15:54:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-12-07 07:10:39
 */
import React from 'react'
import { Page, ListView, Heatmap } from '@components'
import { ItemCatalog } from '@screens/_'
import { _ } from '@stores'
import { open } from '@utils'
import { inject, withHeader, obc } from '@utils/decorators'
import { t, hm } from '@utils/fetch'
import { keyExtractor } from '@utils/app'
import Store from './store'

const title = '条目目录'
const event = {
  id: '条目目录.跳转'
}

export default
@inject(Store)
@withHeader({
  title: ({ name } = {}) => (name ? `包含${name}的目录` : title),
  screen: title
})
@obc
class SubjectCatalogs extends React.Component {
  componentDidMount() {
    const { $, navigation } = this.context
    $.init()

    navigation.setParams({
      heatmap: '条目目录.右上角菜单',
      popover: {
        data: ['浏览器查看'],
        onSelect: key => {
          t('条目目录.右上角菜单', {
            key
          })

          switch (key) {
            case '浏览器查看':
              open($.url)
              break

            default:
              break
          }
        }
      }
    })

    hm(`subject/${$.subjectId}/index`, 'SubjectCatalogs')
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.context
    return (
      <ItemCatalog
        navigation={navigation}
        event={event}
        isUser
        id={item.id}
        name={item.userName}
        title={item.title}
        last={item.time}
      >
        {!index && <Heatmap id='条目目录.跳转' />}
      </ItemCatalog>
    )
  }

  render() {
    const { $ } = this.context
    return (
      <Page loaded={$.list._loaded}>
        <ListView
          contentContainerStyle={_.container.bottom}
          keyExtractor={keyExtractor}
          data={$.list}
          renderItem={this.renderItem}
          scrollToTop
          onHeaderRefresh={() => $.fetchSubjectCatalogs(true)}
          onFooterRefresh={$.fetchSubjectCatalogs}
        />
        <Heatmap bottom={_.bottom} id='条目目录' screen='SubjectCatalogs' />
      </Page>
    )
  }
}
