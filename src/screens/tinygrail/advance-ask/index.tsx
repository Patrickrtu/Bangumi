/*
 * @Author: czy0729
 * @Date: 2020-01-08 11:37:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-11 04:59:44
 */
import React from 'react'
import { Header, Page } from '@components'
import { IconHeader } from '@_'
import { _ } from '@stores'
import { inject, obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { alert } from '@utils/ui'
import StatusBarEvents from '@tinygrail/_/status-bar-events'
import ToolBar from '@tinygrail/_/tool-bar'
import List from './list'
import Store from './store'
import { Ctx } from './types'

class TinygrailAdvanceAsk extends React.Component {
  componentDidMount() {
    const { $ }: Ctx = this.context
    $.init()
  }

  render() {
    const { $ }: Ctx = this.context
    const { level } = $.state
    return (
      <>
        <StatusBarEvents />
        <Header
          title='买入推荐'
          hm={['tinygrail/advance-ask', 'TinygrailAdvanceAsk']}
          statusBarEvents={false}
          statusBarEventsType='Tinygrail'
          headerRight={() => (
            <IconHeader
              name='md-info-outline'
              color={_.colorTinygrailPlain}
              onPress={() => {
                t('卖一推荐.提示')

                alert(
                  '从活跃列表里面查找\n第一卖单股数 > 10 且 Max(流动股息, 圣殿股息) > 4\nMax(流动股息, 圣殿股息) / 第一卖单价 * 10 = 分数',
                  '当前计算方式'
                )
              }}
            />
          )}
        />
        <Page style={_.container.tinygrail}>
          <ToolBar
            style={_.mt._sm}
            level={level}
            levelMap={$.levelMap}
            onLevelSelect={$.onLevelSelect}
          />
          <List />
        </Page>
      </>
    )
  }
}

export default inject(Store)(obc(TinygrailAdvanceAsk))
