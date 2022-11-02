/*
 * @Author: czy0729
 * @Date: 2021-06-26 06:43:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-22 04:11:24
 */
import {
  ADV_COLLECTED,
  ADV_DEV,
  ADV_FIRST,
  ADV_SORT,
  ADV_YEAR
} from '@utils/subject/adv'

export const ADVANCE_LIMIT = 60

// 类型分组
const ADV_DEV_GROUP = [[], []]
ADV_DEV.forEach((item, index) => ADV_DEV_GROUP[index % 2 ? 1 : 0].push(item))

export const filterDS = [
  {
    title: '首字　',
    type: 'first',
    data: ADV_FIRST
  },
  {
    title: '发行　',
    type: 'year',
    data: ADV_YEAR,
    always: true
  },
  {
    title: '开发商',
    type: 'dev',
    data: ADV_DEV_GROUP,
    multiple: true
  },
  {
    title: '排序　',
    type: 'sort',
    data: ADV_SORT,
    always: true
  },
  {
    title: '收藏',
    type: 'collected',
    data: ADV_COLLECTED
  }
] as const
