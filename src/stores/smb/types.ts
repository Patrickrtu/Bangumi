/*
 * @Author: czy0729
 * @Date: 2023-02-21 00:53:11
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-20 04:36:28
 */
import { Loaded, SubjectId } from '@types'

export type SMB = {
  smb: {
    uuid: string
    name: string
    ip: string
    username: string
    password: string
    sharedFolder: string
    path: string
    port: string
    workGroup: string
    url: string
    loaded: Loaded
  }
  list: {
    name: string
    lastModified: string
    path: string
    ids: SubjectId[]
    tags: string[]
    list: {
      name: string
      type: string
      lastModified: string
    }[]
  }[]
}[]
