/*
 * 辅助分析HTML的函数
 * @Author: czy0729
 * @Date: 2019-04-23 11:18:25
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-31 04:36:14
 */
import cheerioRN from 'cheerio-without-node-native'
import HTMLParser from './../thirdParty/html-parser'

/** 去除 HTML */
export function removeHTMLTag(str: any, removeAllSpace: boolean = true): string {
  const _str = String(str)
    .replace(/<\/?[^>]*>/g, '') // 去除HTML tag
    .replace(/[ | ]*\n/g, '\n') // 去除行尾空白
    .replace(/\n[\s| | ]*\r/g, '\n') // 去除多余空行

  if (!removeAllSpace) return _str

  return _str.replace(/ /gi, '') // 去掉
}

const DECODE_SPECIAL_CHARS = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&nbsp;': ' ',
  '&#39;': "'",
  '&quot;': '"'
} as const

/** HTML 反转义 */
export function HTMLDecode(str: string = ''): string {
  if (str.length === 0) return ''

  return str.replace(
    /(&amp;|&lt;|&gt;|&nbsp;|&#39;|&quot;)/g,
    match => DECODE_SPECIAL_CHARS[match]
  )
}

const ENCODE_SPECIAL_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  ' ': '&nbsp;',
  "'": '&#39;',
  '"': '&quot;'
} as const

/** HTML 转义 */
export function HTMLEncode(str: string = ''): string {
  if (str.length === 0) return ''

  return str.replace(/[&<>"' ]/g, match => ENCODE_SPECIAL_CHARS[match])
}

/** HTML 压缩 */
export function HTMLTrim(str: any = '', deep?: boolean) {
  if (typeof str !== 'string') return str

  if (deep) {
    return removeCF(str)
      .replace(/<!--.*?-->/gi, '')
      .replace(/\/\*.*?\*\//gi, '')
      .replace(/[ ]+</gi, '<')
      .replace(/\n+|\s\s\s*|\t/g, '')
      .replace(/"class="/g, '" class="')
      .replace(/> </g, '><')
  }

  return removeCF(str)
    .replace(/\n+|\s\s\s*|\t/g, '')
    .replace(/"class="/g, '" class="')
    .replace(/> </g, '><')
}

/**
 * @deprecated html 字符串转对象
 * @param {*} html
 * @param {*} cmd  是否生成 cmd 字符串(开发用)
 */
export function HTMLToTree(html: string, cmd = true) {
  const tree: any = {
    tag: 'root',
    attrs: {},
    text: [],
    children: []
  }
  if (cmd) tree.cmd = 'root'

  let ref = tree
  HTMLParser(html, {
    start: (tag, attrs, unary) => {
      const attrsMap = {}
      attrs.forEach(({ name, value, escaped }) => {
        // @issue 190507
        // 带有 cookie 的请求经过 cloudflare 返回的 html 部分 attr 的属性被加上了 data-cf 前缀 ??? 醉了
        const _name = name.replace('data-cf', '')
        return (attrsMap[_name] = escaped || value)
      })
      const item: any = {
        tag,
        attrs: attrsMap
      }
      if (cmd) {
        item.cmd = `${ref.cmd} > ${tag}`
      }
      if (!unary) {
        item.parent = ref
        item.text = []
        item.children = []
      }
      ref.children.push(item)

      if (!unary) {
        ref = item
      }
    },
    chars: text => {
      ref.text.push(text)
    },
    end: () => {
      const _ref = ref.parent
      delete ref.parent
      ref = _ref
    }
  })

  return tree
}

/**
 * @deprecated tree 查找
 * ul > li > a|title
 * ul > li > a|title=123
 * ul > li > a|title=123&class=article
 * ul > li > a|text&title=123&class=article
 * @param {*} children
 * @param {*} cmd
 * @return {Array}
 */
export function findTreeNode(children: any, cmd: string = '', defaultValue?) {
  if (!cmd) return children

  const split = ' > '
  const tags = cmd.split(split)
  const tag = tags.shift()
  const find = children.filter(item => {
    let temp = tag.split('|')
    const _tag = temp[0]
    const attr = temp[1] || ''

    if (attr) {
      const attrs = attr.split('&')
      let match = true
      attrs.forEach(attr => {
        if (attr.indexOf('~') !== -1) {
          // ~
          temp = attr.split('~')
          const _attr = temp[0]
          const _value = temp[1]
          if (_value) {
            match =
              match &&
              item.tag === _tag &&
              item.attrs[_attr] &&
              item.attrs[_attr].indexOf(_value) !== -1
          } else if (_attr) {
            match = match && item.tag === _tag && item.attrs[_attr] !== undefined
          }
        } else {
          // =
          temp = attr.split('=')
          const _attr = temp[0]
          const _value = temp[1]
          if (_value) {
            match = match && item.tag === _tag && item.attrs[_attr] == _value
          } else if (_attr) {
            if (_attr === 'text') {
              match = match && item.tag === _tag && item.text.length !== 0
            } else {
              match = match && item.tag === _tag && item.attrs[_attr] !== undefined
            }
          }
        }
      })
      return match
    }
    return item.tag === _tag
  })
  if (!find.length) {
    return undefined || defaultValue
  }
  if (!tags.length) {
    return find
  }

  const _find = []
  find.forEach(item => {
    _find.push(...(findTreeNode(item.children, tags.join(split)) || []))
  })
  if (!_find.length) {
    return undefined || defaultValue
  }
  return _find
}

/**
 * 干掉 cloudfare 乱插的 dom
 * @param {*} HTML
 */
export function removeCF(HTML: string = ''): string {
  return HTML.replace(
    /<script[^>]*>([\s\S](?!<script))*?<\/script>|<noscript[^>]*>([\s\S](?!<script))*?<\/noscript>|style="display:none;visibility:hidden;"/g,
    ''
  ).replace(/data-cfsrc/g, 'src')
}

/** cheerio.load */
export function cheerio(
  target: any,
  remove: boolean | object = true,
  decodeEntities: boolean = false
) {
  if (typeof target === 'string') {
    if (remove) {
      return cheerioRN.load(removeCF(target), {
        decodeEntities
      })
    }
    return cheerioRN.load(target, {
      decodeEntities
    })
  }

  return cheerioRN(target)
}
