/*
 * @Author: czy0729
 * @Date: 2023-04-11 19:47:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-12 10:28:29
 */
import React from 'react'
import { StorybookSPA, StorybookList, getStorybookArgs } from '@components'
import Component from './index'

export default {
  title: 'screens/Wiki',
  component: Component
}

export const Wiki = () => (
  <StorybookSPA>
    <StorybookList>
      <Component {...getStorybookArgs('Wiki')} />
    </StorybookList>
  </StorybookSPA>
)
