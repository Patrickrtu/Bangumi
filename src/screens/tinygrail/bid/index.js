/*
 * @Author: czy0729
 * @Date: 2019-08-25 19:12:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-11-04 16:56:50
 */
import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import { _ } from '@stores'
import { inject, withHeader, observer } from '@utils/decorators'
import { hm } from '@utils/fetch'
import { withHeaderParams } from '../styles'
import StatusBarEvents from '../_/status-bar-events'
import Tabs from '../_/tabs-v2'
import ToolBar from '../_/tool-bar'
import List from './list'
import Store, { tabs, sortDS } from './store'

const title = '我的委托'

export default
@inject(Store)
@withHeader({
  screen: title,
  withHeaderParams
})
@observer
class TinygrailBid extends React.Component {
  static navigationOptions = {
    title
  }

  static contextTypes = {
    $: PropTypes.object,
    navigation: PropTypes.object
  }

  componentDidMount() {
    const { $ } = this.context
    $.init()

    const { type = 'bid' } = $.params
    hm(`tinygrail/${type}`, 'TinygrailBid')
  }

  renderContentHeaderComponent() {
    const { $ } = this.context
    const { level, sort, direction } = $.state
    return (
      <ToolBar
        data={sortDS}
        level={level}
        levelMap={$.levelMap}
        sort={sort}
        direction={direction}
        onLevelSelect={$.onLevelSelect}
        onSortPress={$.onSortPress}
      />
    )
  }

  render() {
    const { $ } = this.context
    const { _loaded } = $.state
    return (
      <View style={this.styles.container}>
        <StatusBarEvents />
        {!!_loaded && (
          <Tabs
            routes={tabs}
            renderContentHeaderComponent={this.renderContentHeaderComponent()}
            renderItem={item => <List key={item.key} id={item.key} />}
          />
        )}
      </View>
    )
  }

  get styles() {
    return memoStyles()
  }
}

const memoStyles = _.memoStyles(_ => ({
  container: {
    flex: 1,
    backgroundColor: _.colorTinygrailContainer
  }
}))
