/*
 * @Author: czy0729
 * @Date: 2022-09-03 05:05:22
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-19 17:04:32
 */
import { _ } from '@stores'
import {
  MODEL_RAKUEN_SCOPE,
  MODEL_RAKUEN_TYPE_GROUP,
  MODEL_RAKUEN_TYPE_MONO,
  RAKUEN_TYPE
} from '@constants'
import { RakuenScope, RakuenTypeGroup, RakuenTypeMono } from '@types'

export const NAMESPACE = 'ScreenRakuen'

export const H_TABBAR = 48

// export const TABS = RAKUEN_TYPE.map(item => ({
//   title: item.label
// }))

export const TABS = RAKUEN_TYPE.map(item => ({
  title: item.label,
  key: item.value
})).filter(item => !!item.title)

/** 每次预读取未读帖子数量 */
export const PREFETCH_COUNT = 20

export const INIT_PREFETCH_STATE = {
  prefetching: false,
  prefetchTotal: 0,
  prefetchCurrent: 0
}

export const EXCLUDE_STATE = {
  /** 可视范围底部 y */
  visibleBottom: _.window.height,
  isFocused: true,
  _mounted: false
}

export const STATE = {
  /** 超展开板块 */
  scope: MODEL_RAKUEN_SCOPE.getValue<RakuenScope>('全局聚合'),

  /** Tabs 当前页数 */
  page: 1,

  /** 小组范围 */
  group: MODEL_RAKUEN_TYPE_GROUP.getValue<RakuenTypeGroup>('全部'),

  /** 人物类型 */
  mono: MODEL_RAKUEN_TYPE_MONO.getValue<RakuenTypeMono>('全部'),

  /** Prefetch */
  ...INIT_PREFETCH_STATE,

  ...EXCLUDE_STATE,

  _loaded: false
}
