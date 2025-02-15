/*
 * @Author: czy0729
 * @Date: 2022-10-17 00:00:34
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-17 16:20:27
 */
import { CollectionStatus, SubjectId } from '@types'
import { StateData } from './types'

export const NAMESPACE = 'ScreenDouban'

export const EXCLUDE_STATE = {
  progress: {
    fetching: false,
    message: '',
    current: 0,
    total: 0
  }
}

export const STATE = {
  doubanId: '',

  /** 追番记录 (douban) */
  data: {
    list: [],
    _loaded: 0
  } as StateData,

  /** 收藏信息 (bgm) */
  collections: {} as Record<
    SubjectId,
    {
      comment?: string
      ep_status?: number
      rating?: number
      status?: CollectionStatus
      private?: 0 | 1
      loaded: number
    }
  >,

  /** 补充条目的总集数 (bgm) */
  totalEps: {} as Record<SubjectId, number>,

  /** 置底数据 */
  bottom: {
    current: 0
  },

  /** 收起 (弹窗) */
  hide: false,

  /** 隐藏看过的条目 */
  hideWatched: false,

  /** 隐藏相同收藏的条目 */
  hideSame: false,

  /** 隐藏未匹配的条目 */
  hideNotMatched: false,

  /** 创建时间作为评论 */
  noCommentUseCreateDate: false,

  /** 评分 -1 */
  scoreMinuesOne: false,

  /** 收藏是否可见 */
  privacy: false,

  ...EXCLUDE_STATE,
  _loaded: false
}

export const HOST_API = 'https://api.bgm.tv'

/** 存放请求缓存 */
export const LOADED = {}

/** 存放请求条目总集数缓存 */
export const LOADED_TOTAL_EPS = {}
