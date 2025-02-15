/*
 * @Author: czy0729
 * @Date: 2023-04-24 14:31:09
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-24 14:32:30
 */
import { getTimestamp, info } from '@utils'
import { syncUserStore } from '@utils/async'
import { put, read } from '@utils/db'
import { fetchHTML, xhr } from '@utils/fetch'
import { collect, collectList, is } from '@utils/kv'
import {
  API_TOPIC_COMMENT_LIKE,
  HOST,
  HTML_ACTION_BLOG_REPLY,
  HTML_ACTION_RAKUEN_REPLY
} from '@constants'
import { RakuenReplyType } from '@constants/html/types'
import { Fn, RakuenScrollDirection, RakuenSubExpand, TopicId, UserId } from '@types'
import Fetch from './fetch'
import { INIT_SETTING } from './init'

export default class Action extends Fetch {
  /** 清除电波提醒未读 */
  doClearNotify = async () => {
    const { clearHref } = this.notify
    if (clearHref) {
      await fetchHTML({
        url: `${HOST}${clearHref}`
      })

      const key = 'notify'
      this.setState({
        [key]: {
          ...this.notify,
          unread: 0,
          clearHTML: ''
        }
      })
      this.save(key)
    }
  }

  /** 回复帖子 | 回复帖子子回复 */
  doReply = async (
    args: {
      topicId: string | number
      type?: RakuenReplyType
      content?: string
      formhash?: string
      related?: any
      sub_reply_uid?: any
      post_uid?: any
    },
    success?: (arg?: any) => any
  ) => {
    const { topicId, type = 'group/topic', ...other } = args || {}
    xhr(
      {
        url: HTML_ACTION_RAKUEN_REPLY(topicId, type),
        data: {
          ...other,
          related_photo: 0,
          lastview: getTimestamp(),
          submit: 'submit'
        }
      },
      success
    )
  }

  /** 删除回复 */
  doDeleteReply = async (args: { url: string }, success?: () => any) => {
    const { url } = args || {}
    xhr(
      {
        url
      },
      success
    )
  }

  private _doLiking = false

  /** 添加回复表情 */
  doLike = (
    item: {
      main_id: number
      type: number
      value: string
    },
    floorId: number,
    formhash: string,
    topicId: TopicId,
    callback?: Fn
  ) => {
    if (this._doLiking) return

    this._doLiking = true
    setTimeout(() => {
      this._doLiking = false
    }, 1600)

    xhr(
      {
        url: API_TOPIC_COMMENT_LIKE(
          item.type,
          item.main_id,
          floorId,
          item.value,
          formhash
        )
      },
      responseText => {
        try {
          const data = JSON.parse(responseText)
          if (data?.status === 'ok') {
            const key = 'likes'
            let state: any

            if (data?.data) {
              state = {
                ...this.likes(topicId),
                ...data.data
              }
            } else {
              state = {
                ...this.likes(topicId),
                [floorId]: {}
              }
            }

            this.setState({
              [key]: {
                [topicId]: state
              }
            })
            this.save(key)
            if (typeof callback === 'function') callback()
          }
        } catch (error) {}
      },
      () => {
        if (typeof callback === 'function') callback()
      }
    )
  }

  /** 回复日志 */
  doReplyBlog = async (
    args: {
      blogId: TopicId
      content?: string
      formhash?: string
      related?: any
      sub_reply_uid?: any
      post_uid?: any
    },
    success?: (responseText?: string, request?: any) => any
  ) => {
    const { blogId, ...other } = args || {}
    xhr(
      {
        url: HTML_ACTION_BLOG_REPLY(blogId),
        data: {
          ...other,
          related_photo: 0,
          lastview: getTimestamp(),
          submit: 'submit'
        }
      },
      success
    )
  }

  /** 删除日志回复 */
  doDeleteReplyBlog = async (args: { url: string }, success?: () => any) => {
    const { url } = args || {}
    xhr(
      {
        url
      },
      success
    )
  }

  // -------------------- page --------------------
  /**
   * 更新帖子历史查看信息
   * @param {*} topicId 帖子Id
   * @param {Int} replies 回复数
   */
  updateTopicReaded = (topicId: TopicId, replies: number = 0) => {
    const readed = this.readed(topicId)
    const key = 'readed'
    const time = getTimestamp()
    this.setState({
      [key]: {
        [topicId]: {
          replies,
          time,
          _time: readed.time === 0 ? time : readed.time
        }
      }
    })
    this.save(key)
  }

  /** 设置`子楼层折叠` */
  setSubExpand = (subExpand: RakuenSubExpand) => {
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        subExpand
      }
    })
    this.save(key)
  }

  /** 设置`楼层导航条方向` */
  setScrollDirection = (scrollDirection: RakuenScrollDirection) => {
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        scrollDirection
      }
    })
    this.save(key)
  }

  /** 切换 */
  switchSetting = (switchKey: keyof typeof INIT_SETTING) => {
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        [switchKey]: !this.setting[switchKey]
      }
    })
    this.save(key)
  }

  /** 添加屏蔽关键字 */
  addBlockKeyword = (keyword: string) => {
    const { blockKeywords } = this.setting
    if (blockKeywords.includes(keyword)) return

    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockKeywords: [...blockKeywords, keyword]
      }
    })
    this.save(key)
  }

  /** 删除屏蔽关键字 */
  deleteBlockKeyword = (keyword: string) => {
    const { blockKeywords } = this.setting
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockKeywords: blockKeywords.filter(item => item !== keyword)
      }
    })
    this.save(key)
  }

  /**
   * 添加屏蔽小组
   * @param {string} group 小组名字
   */
  addBlockGroup = (group: string) => {
    const { blockGroups } = this.setting
    if (blockGroups.includes(group)) return

    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockGroups: [...blockGroups, group]
      }
    })
    this.save(key)
  }

  /**
   * 删除屏蔽小组
   * @param {string} group 小组名字
   */
  deleteBlockGroup = (group: string) => {
    const { blockGroups } = this.setting
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockGroups: blockGroups.filter(item => item !== group)
      }
    })
    this.save(key)
  }

  /**
   * 添加屏蔽用户
   * @param {string} userNameSpace `${userName}@${userId}`
   */
  addBlockUser = async (userNameSpace: string) => {
    this.init('setting')

    const { blockUserIds } = this.setting
    if (blockUserIds.includes(userNameSpace)) return

    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockUserIds: [...blockUserIds, userNameSpace]
      }
    })
    this.save(key)
  }

  /**
   * 删除屏蔽用户
   * @param {string} userNameSpace `${userName}@${userId}`
   */
  deleteBlockUser = (userNameSpace: string) => {
    const { blockUserIds } = this.setting
    const key = 'setting'
    this.setState({
      [key]: {
        ...this.setting,
        blockUserIds: blockUserIds.filter(item => item !== userNameSpace)
      }
    })
    this.save(key)
  }

  /** @deprecated 设置是否收藏*/
  setFavor = (topicId: TopicId, isFavor: boolean) => {
    const key = 'favor'
    this.setState({
      [key]: {
        [topicId]: isFavor
      }
    })
    this.save(key)
  }

  /** 设置收藏 */
  getFavor = async () => {
    await this.init('favorV2')

    const { myUserId } = syncUserStore()
    if (!myUserId) return null

    const result = await collectList(myUserId)
    if (result?.code === 200 && Array.isArray(result?.data)) {
      const data = {}
      result.data.forEach((item: { createTime: string; id: string }) => {
        data[item.id] = true
      })

      const key = 'favorV2'
      this.setState({
        [key]: data
      })
      this.save(key)
    }

    return result
  }

  /** 设置收藏 */
  setFavorV2 = async (topicId: TopicId, isFavor: boolean) => {
    await this.init('favorV2')
    await this.init('favorCount')

    const { myUserId } = syncUserStore()
    if (!myUserId) {
      info('请先登录')
      return null
    }

    const result = await collect(myUserId, topicId, isFavor)
    if (result?.code === 200) {
      this.setState({
        favorV2: {
          [topicId]: isFavor
        },
        favorCount: {
          [topicId]: result?.data?.total || 0
        }
      })
      this.save('favorV2')
      this.save('favorCount')
    }

    return result
  }

  /** 检查帖子收藏 */
  checkIsFavor = async (topicId: TopicId) => {
    await this.init('favorCount')

    const { myUserId } = syncUserStore()
    if (!myUserId) return false

    const result = await is(myUserId, topicId)
    if (result?.code === 200) {
      if (result?.data?.total) {
        this.setState({
          favorCount: {
            [topicId]: result.data.total || 0
          }
        })
        this.save('favorCount')
      }
      return true
    }

    return false
  }

  /** 上传收藏帖子到云端 */
  uploadFavorTopic = () => {
    const { id } = syncUserStore().userInfo
    return put({
      path: `topic/${id}.json`,
      content: escape(JSON.stringify(this.favorTopic))
    })
  }

  /** @deprecated 同步云端收藏帖子 */
  downloadFavorTopic = async () => {
    const { id } = syncUserStore().userInfo
    const { content } = await read({
      path: `topic/${id}.json`
    })
    if (!content) return false

    try {
      const { favor } = this.state
      const { _favor, ...cloudTopic } = JSON.parse(unescape(content))
      this.setState({
        favor: {
          ..._favor,
          ...favor
        },
        cloudTopic
      })

      this.save('favor')
      this.save('cloudTopic')
      return true
    } catch (error) {
      return false
    }
  }

  /** 上传当前设置到云端 */
  uploadSetting = () => {
    const { id } = syncUserStore().userInfo
    return put({
      path: `rakuen-setting/${id}.json`,
      content: JSON.stringify({
        ...this.setting,
        blockKeywords: escape(JSON.stringify(this.setting.blockKeywords)),
        blockGroups: escape(JSON.stringify(this.setting.blockGroups)),
        blockUserIds: escape(JSON.stringify(this.setting.blockUserIds))
      })
    })
  }

  /** 恢复到云端的设置 */
  downloadSetting = async () => {
    const { id } = syncUserStore().userInfo
    const { content } = await read({
      path: `rakuen-setting/${id}.json`
    })

    if (!content) return false

    try {
      const setting = JSON.parse(content)
      const key = 'setting'

      // 屏蔽的数据还需要跟现在的合并
      let { blockKeywords, blockGroups, blockUserIds } = setting
      blockKeywords = JSON.parse(unescape(blockKeywords))
      blockGroups = JSON.parse(unescape(blockGroups))
      blockUserIds = JSON.parse(unescape(blockUserIds))
      this.setting.blockKeywords.forEach(item => {
        if (!blockKeywords.includes(item)) blockKeywords.push(item)
      })
      this.setting.blockGroups.forEach(item => {
        if (!blockGroups.includes(item)) blockGroups.push(item)
      })
      this.setting.blockUserIds.forEach(item => {
        if (!blockUserIds.includes(item)) blockUserIds.push(item)
      })

      this.setState({
        [key]: {
          ...this.setting,
          ...setting,
          blockKeywords,
          blockGroups,
          blockUserIds
        }
      })
      this.save(key)
      return true
    } catch (error) {
      console.info('rakuenStore downloadSetting', error)
      return false
    }
  }

  /** 屏蔽用户的屏蔽次数 +1 */
  trackBlockedUser = (userId: UserId) => {
    const key = 'blockedUsersTrack'
    this.setState({
      [key]: {
        [userId]: this.blockedUsersTrack(userId) + 1
      }
    })
    this.save(key)
  }
}
