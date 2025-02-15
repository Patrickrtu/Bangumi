/*
 * @Author: czy0729
 * @Date: 2019-05-06 00:28:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-12 11:00:14
 */
import React, { useEffect } from 'react'
import { uiStore } from '@stores'
import { ic } from '@utils/decorators'
import { useIsFocused, useRunAfter } from '@utils/hooks'
import Page from './page'
import Store from './store'
import { Ctx } from './types'

const Zone = (props, { $ }: Ctx) => {
  const isFocused = useIsFocused()

  useRunAfter(() => {
    $.init()
  })

  useEffect(() => {
    if (!isFocused) uiStore.closePopableSubject()
  }, [isFocused])

  return <Page />
}

export default ic(Store, Zone)
