/*
 * @Author: czy0729
 * @Date: 2022-09-01 14:07:22
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-13 16:03:11
 */
import { systemStore, _ } from '@stores'
import { Images, Navigation, SubjectId, ViewStyle } from '@types'
import { memoStyles } from './styles'

export const DEFAULT_PROPS = {
  navigation: {} as Navigation,
  styles: {} as ReturnType<typeof memoStyles>,
  hideScore: false as (typeof systemStore)['setting']['hideScore'],
  style: {} as ViewStyle,
  subjectId: 0 as SubjectId,
  name: '' as string,
  images: {} as Images,
  score: '' as string | number,
  collection: '' as string,
  air: '' as string | number,
  time: '2359' as string
}

export const HIT_SLOP = {
  top: _.device(2, 4),
  right: _.device(4, 4),
  bottom: _.device(10, 4),
  left: _.device(4, 4)
} as const
