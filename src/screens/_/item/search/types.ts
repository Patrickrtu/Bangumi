/*
 * @Author: czy0729
 * @Date: 2022-06-15 10:51:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-28 05:49:41
 */
import { EventType, Id, Navigation, SubjectTypeCn, ViewStyle } from '@types'

export type Props = {
  navigation?: Navigation
  style?: ViewStyle
  index?: number
  id?: Id
  name?: string
  nameCn?: string
  cover?: string
  // type?: SubjectType
  typeCn?: SubjectTypeCn
  tip?: string
  rank?: number | string
  score?: number | string
  total?: number | string
  comments?: string
  collection?: string
  collected?: boolean
  position?: string[]
  event?: EventType
}
