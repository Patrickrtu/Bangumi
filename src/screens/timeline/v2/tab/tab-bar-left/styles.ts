/*
 * @Author: czy0729
 * @Date: 2022-08-14 07:05:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-14 07:06:25
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  tabBarLeft: {
    height: _.r(42),
    paddingLeft: _.r(_._wind),
    paddingRight: _.sm,
    marginTop: _.device(0, 2),
    backgroundColor: _.ios('transparent', _.select('transparent', _.colorPlain))
  },
  btn: {
    width: _.r(48),
    height: _.r(24),
    borderRadius: _.r(16)
  }
}))
