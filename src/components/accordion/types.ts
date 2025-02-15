/*
 * @Author: czy0729
 * @Date: 2022-06-25 16:11:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-25 16:12:03
 */
import { ViewStyle } from '@types'

export type Props = {
  style?: ViewStyle

  /** 是否展开 */
  expand: boolean

  /** 收起后是否销毁 */
  lazy?: boolean

  children: any
}
