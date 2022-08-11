/*
 * @Author: czy0729
 * @Date: 2022-05-01 11:46:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-12 03:17:24
 */
import { Text, TextInput } from 'react-native'
import { _ } from '@stores'
import { IOS } from '@constants'
import { setDefaultProps } from './utils'

if (!IOS) {
  setDefaultProps(Text, _.fontStyle)
  setDefaultProps(TextInput, _.fontStyle)
}

export const memoStyles = _.memoStyles(() => ({
  /** base style */
  text: _.ios(
    {
      fontWeight: 'normal'
    },
    _.fontStyle
  ),
  bold: _.ios(
    {
      fontWeight: 'bold'
    },
    _.fontBoldStyle
  ),
  underline: {
    textDecorationLine: 'underline',
    textDecorationColor: _.select(_.colorMain, _.colorSub)
  },
  alignCenter: {
    textAlign: 'center'
  },
  alignRight: {
    textAlign: 'right'
  },
  shadow: {
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.24)'
  },

  /** theme color */
  plain: {
    color: _.colorPlain
  },
  __plain__: {
    color: _.__colorPlain__
  },
  main: {
    color: _.colorMain
  },
  primary: {
    color: _.colorPrimary
  },
  success: {
    color: _.colorSuccess
  },
  warning: {
    color: _.colorWarning
  },
  danger: {
    color: _.colorDanger
  },

  /** font color */
  title: {
    color: _.colorTitle
  },
  desc: {
    color: _.colorDesc
  },
  sub: {
    color: _.colorSub
  },
  icon: {
    color: _.colorIcon
  },
  border: {
    color: _.colorBorder
  },
  avatar: {
    color: _.colorAvatar
  },

  /** tinygrail theme color */
  bid: {
    color: _.colorBid
  },
  ask: {
    color: _.colorAsk
  },
  tinygrailPlain: {
    color: _.colorTinygrailPlain
  },
  tinygrailText: {
    color: _.colorTinygrailText
  },
  tinygrailIcon: {
    color: _.colorTinygrailIcon
  }
}))
