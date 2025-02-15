/*
 * @Author: czy0729
 * @Date: 2023-04-28 04:08:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-28 04:19:32
 */
import { HOST } from '@constants'

export const LINKS = [
  {
    key: '条目',
    value: `${HOST}/subject/`,
    text: `${HOST}/subject/{ID}`
  },
  {
    key: '帖子',
    value: `${HOST}/group/topic/`,
    text: `${HOST}/group/topic/{ID}`
  },
  {
    key: '小组',
    value: `${HOST}/group/`,
    text: `${HOST}/group/{ID}`
  },
  {
    key: '虚拟人物',
    value: `${HOST}/character/`,
    text: `${HOST}/character/{ID}`
  },
  {
    key: '现实人物',
    value: `${HOST}/person/`,
    text: `${HOST}/person/{ID}`
  },
  {
    key: '用户空间',
    value: `${HOST}/user/`,
    text: `${HOST}/user/{ID}`
  },
  {
    key: '标签',
    value: `${HOST}/tag/`,
    text: `${HOST}/tag/{ID}`
  },
  {
    key: '目录',
    value: `${HOST}/index/`,
    text: `${HOST}/index/{ID}`
  },
  {
    key: '日志',
    value: `${HOST}/blog/`,
    text: `${HOST}/blog/{ID}`
  }
] as const
