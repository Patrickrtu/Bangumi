/*
 * @Author: czy0729
 * @Date: 2023-04-20 16:39:37
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-20 16:40:06
 */
import { _ } from '@stores'
import { IMG_HEIGHT, IMG_WIDTH } from '@constants'

export const styles = _.create({
  inView: {
    minWidth: IMG_WIDTH,
    minHeight: IMG_HEIGHT
  }
})
