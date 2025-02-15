/*
 * @Author: czy0729
 * @Date: 2019-09-09 17:38:05
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-09-28 00:18:41
 */
import { observable, computed } from 'mobx'
import { userStore, usersStore } from '@stores'
import store from '@utils/store'
import { t } from '@utils/fetch'
import { HOST } from '@constants'
import { Params } from './types'

const NAMESPACE = 'ScreenCharacter'

export default class ScreenCharacter extends store {
  params: Params

  state = observable({
    page: 0,
    _loaded: true
  })

  init = async () => {
    const { page } = this.state
    const { key } = this.tabs[page]
    const { _loaded } = this.list(key)
    if (!_loaded) return this.fetchList(key, true)

    return true
  }

  // -------------------- fetch --------------------
  fetchList = (key: string, refresh: boolean = false) => {
    switch (key) {
      case 'recents':
        return usersStore.fetchRecents(refresh)

      case 'persons':
        return usersStore.fetchPersons(
          {
            userId: this.userId
          },
          refresh
        )

      default:
        return usersStore.fetchCharacters(
          {
            userId: this.userId
          },
          refresh
        )
    }
  }

  // -------------------- get --------------------
  @computed get userId() {
    const { userName: userId = userStore.myId } = this.params
    return userId
  }

  @computed get tabs() {
    if (this.userId === userStore.myId) {
      return [
        {
          title: '人物近况',
          key: 'recents'
        },
        {
          title: '虚拟角色',
          key: 'characters'
        },
        {
          title: '现实人物',
          key: 'persons'
        }
      ]
    }

    return [
      {
        title: '虚拟角色',
        key: 'characters'
      },
      {
        title: '现实人物',
        key: 'persons'
      }
    ]
  }

  list(key: string) {
    switch (key) {
      case 'persons':
        return computed(() => usersStore.persons(this.userId)).get()

      case 'recents':
        return computed(() => usersStore.recents).get()

      default:
        return computed(() => usersStore.characters(this.userId)).get()
    }
  }

  @computed get url() {
    return `${HOST}/user/${this.params?.userName}/mono`
  }

  // -------------------- page --------------------
  onChange = (page: number) => {
    if (page === this.state.page) return

    t('收藏的人物.标签页切换')
    this.setState({
      page
    })
    this.setStorage(undefined, undefined, NAMESPACE)
    this.tabChangeCallback(page)
  }

  tabChangeCallback = (page: number) => {
    const { key } = this.tabs[page]
    const { _loaded } = this.list(key)
    if (!_loaded) {
      this.fetchList(key, true)
    }
  }
}
