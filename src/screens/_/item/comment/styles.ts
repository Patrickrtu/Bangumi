/*
 * @Author: czy0729
 * @Date: 2022-06-17 12:43:08
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-18 13:47:40
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  item: {
    backgroundColor: _.colorPlain
  },
  image: {
    marginTop: _.md,
    marginLeft: _.wind
  },
  content: {
    paddingVertical: _.md,
    paddingRight: _.wind,
    marginLeft: _.sm
  },
  border: {
    borderTopColor: _.colorBorder,
    borderTopWidth: _.hairlineWidth
  },
  stars: {
    marginVertical: _.xs
  },
  touch: {
    marginVertical: -8,
    marginRight: -2,
    borderRadius: 20,
    overflow: 'hidden'
  },
  icon: {
    width: 36,
    height: 36
  }
}))
