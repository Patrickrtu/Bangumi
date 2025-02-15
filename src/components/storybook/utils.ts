/*
 * @Author: czy0729
 * @Date: 2023-04-10 15:21:47
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-15 05:39:27
 */
import { appNavigate, urlStringify } from '@utils'
import { AnyObject } from '@types'
import { setNavigating } from './state'

export function parseUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const result = {}

  // @ts-expect-error
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/** 统一跳转函数, 不传参数等于后退 */
export function navigate(
  routeName?: string,
  params: AnyObject = {},
  replace: boolean = false
) {
  if (routeName === 'WebBrowser' && params?.url) {
    appNavigate(params.url)
    return
  }

  setNavigating(routeName === undefined ? 'POP' : replace ? 'REPLACE' : 'PUSH')
  if (!routeName) {
    window.history.back()
    return
  }

  const config = {
    viewMode: 'story',

    // params
    ...Object.entries(params || {})
      // .filter(([key]) => !key.startsWith('_'))
      .filter(([, value]) => value)
      .reduce((obj, [key, value]) => {
        obj[key] = value
        return obj
      }, {}),

    // CatalogDetail -> catalogdetail--catalog-detail
    // LoginV2 -> loginv2--login-v-2
    id: `screens-${routeName.toLowerCase()}--${routeName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/(\d+)/g, '-$1')
      .toLowerCase()}`
  }
  const url = `iframe.html?${urlStringify(config)}`

  window.history[replace ? 'replaceState' : 'pushState']({}, '', url)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
