/*
 * 开发调试
 * @Author: czy0729
 * @Date: 2019-03-26 18:37:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-05 05:31:56
 */
import { DEV, LOG_LEVEL } from '@/config'
import { RERENDER_SHOW } from '@/config'
import { AnyObject } from '@types'
import { pad } from '../utils'
import { handleCircular } from './utils'
import { RERENDER_LOG_COUNT, RERENDER_MEMO } from './ds'

/** 调试查看组件 re-render 情况 */
export function rerender(key: string, ...other: any[]) {
  if (!DEV || !key || !RERENDER_SHOW.test(key)) return

  if (!RERENDER_MEMO.data[key]) RERENDER_MEMO.data[key] = 0
  RERENDER_MEMO.data[key] += 1

  let _key = key
  for (let len = _key.length; len <= 24; len += 1) {
    _key += ' '
  }

  let _count = String(RERENDER_MEMO.data[key])
  if (_count && Number(_count) <= RERENDER_LOG_COUNT) return

  _count += ' '
  for (let len = 1; len <= Math.min(RERENDER_MEMO.data[key], 12); len += 1) {
    _count += '■'
  }

  for (let len = _count.length; len <= 12; len += 1) {
    _count += ' '
  }

  console.info(now(), '[render]', _key, _count, ...other)
}

/** 当前时间戳字符串 */
export function now() {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  return `${h}:${pad(m)}:${pad(s)}`
}

const _collectLogKeys = {}
const _collectLogItems = []
let _collectIndex = 0

/** 收集项数据, 到达一定数目后打印 */
export function ll(item: AnyObject, key: string | number, limit: number = 12) {
  if (_collectLogItems.length >= limit) return

  if (!key) {
    _collectIndex += 1
    key = _collectIndex
  }

  if (!_collectLogKeys[key]) {
    _collectLogKeys[key] = true
    _collectLogItems.push(item)
    if (_collectLogItems.length === limit) {
      console.info('\n', JSON.stringify(_collectLogItems))
    }
  }
}

/**
 * 测试 log
 * @version 171024 0.1
 * @version 181101 1.0 测试环境才显示
 * @param {String} type  消息类型
 * @param {String} key   消息键
 * @param {Any}    value 消息值
 */
export function log(type: any = '', key: any = '', value: any = '', ...other) {
  if (LOG_LEVEL === 0) return

  const res: any[] = [now(), type]
  if (key !== undefined) res.push('\n', key)
  if (value !== undefined) res.push('\n', value)
  if (other && other.length) res.push('\n', other)

  console.info(...res)
}

/** 全局 log, 能打印循环引用 */
export function globalLog(value: any, space: string | number) {
  if (!DEV) return

  console.info(JSON.stringify(value, handleCircular(), space))
}

/** 全局警告 */
export function globalWarn(key: any, method: any) {
  if (!DEV) return
  log(`\x1b[40m\x1b[33m[${key}] ${method}\x1b[0m`)
}

/** 字符串填充 */
export function fill(str: string, len: number = 32, mark: string = ' ') {
  if (!len) return str

  let _str = str
  if (_str.length > len) return _str

  for (let i = _str.length; i < len; i += 1) _str += mark
  return _str
}
