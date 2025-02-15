/*
 * @Author: czy0729
 * @Date: 2022-06-17 20:50:31
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-19 19:15:45
 */
import { EventType, Navigation, SubjectId, UserId, ViewStyle } from '@types'

export type Props = {
  navigation?: Navigation
  style?: ViewStyle
  avatar?: {
    url?: string
    src?: string
  }
  p1?: {
    text: string
    url: string
  }
  p2?: {
    text: string
  }
  p3?: {
    text: string[]
    url: string[]
  }
  p4?: {
    text: string
  }
  image?: string[]
  comment?: string
  reply?: {
    count: number
    url?: string
    content?: string
  }
  time?: string
  star?: string | number
  subject?: string
  subjectId?: SubjectId
  clearHref?: string
  index?: number
  event?: EventType
  onDelete?: (clearHref?: string) => any
  onHidden?: (title?: string, userId?: UserId) => any
}
