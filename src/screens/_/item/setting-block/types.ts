/*
 * @Author: czy0729
 * @Date: 2022-06-17 20:11:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-21 14:20:15
 */
import { TextType } from '@components'
import { ColorValue, IconfontNames, TextStyle, ViewStyle } from '@types'

export type ItemSettingBlockItemProps = {
  style?: ViewStyle
  itemStyle?: ViewStyle
  show?: boolean
  active?: boolean
  icon?: IconfontNames
  iconStyle?: TextStyle
  iconColor?: ColorValue
  title?: string
  information?: string
  informationType?: TextType
  filter?: string
  children?: any
  onPress?: () => any
}

export type ItemSettingBlockProps = {
  style?: ViewStyle
  show?: boolean
  title?: string
  information?: string
  informationType?: TextType
  size?: number
  filter?: string
  thumb?:
    | false
    | {
        url: string
        _url?: string
        headers?: object
      }[]
  align?: any
  children?: any
}

export interface IItemSettingBlock {
  (props: ItemSettingBlockProps): JSX.Element
  Item?: (props: ItemSettingBlockItemProps) => JSX.Element
}
