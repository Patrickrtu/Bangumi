/*
 * @Author: czy0729
 * @Date: 2022-10-21 12:29:56
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-22 13:15:50
 */
import React from 'react'
import { Page } from '@components'
import { ic } from '@utils/decorators'
import { useRunAfter, useObserver } from '@utils/hooks'
import Header from './header'
import List from './list'
import Store from './store'
import { Ctx } from './types'

const Preview = (props, { $ }: Ctx) => {
  useRunAfter(() => {
    $.init()
  })

  return useObserver(() => (
    <>
      <Header />
      <Page loaded={$.state._loaded}>
        <List />
      </Page>
    </>
  ))
}

export default ic(Store, Preview)
