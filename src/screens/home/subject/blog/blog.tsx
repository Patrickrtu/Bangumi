/*
 * @Author: czy0729
 * @Date: 2019-03-26 02:36:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-19 14:47:42
 */
import React from 'react'
import { Expand, Heatmap } from '@components'
import { InView, SectionTitle, ItemArticle } from '@_'
import { _ } from '@stores'
import { stl } from '@utils'
import { memo } from '@utils/decorators'
import { useExpandLazy } from '@utils/hooks'
import IconBlog from '../icon/blog'
import IconHidden from '../icon/hidden'
import { DEFAULT_PROPS } from './ds'

export default memo(
  ({ navigation, styles, showBlog, subjectId, blog, onSwitchBlock }) => {
    // global.rerender('Subject.Blog.Main')

    const { list, onExpand } = useExpandLazy(blog)
    return (
      <InView style={stl(styles.container, !showBlog && _.short)}>
        <SectionTitle
          style={styles.sectionTitle}
          right={showBlog ? <IconBlog /> : <IconHidden name='日志' value='showBlog' />}
          icon={!showBlog && 'md-navigate-next'}
          onPress={() => onSwitchBlock('showBlog')}
        >
          日志
        </SectionTitle>
        {showBlog && (
          <>
            <Expand style={_.mt.sm} onExpand={onExpand}>
              {list.map(item => (
                <ItemArticle
                  key={item.id}
                  style={styles.item}
                  navigation={navigation}
                  avatar={item.user.avatar.small}
                  title={item.title}
                  summary={item.summary.replace(/\r\n/g, '').trim()}
                  nickname={item.user.nickname}
                  userId={item.user.username}
                  timestamp={item.timestamp}
                  replies={item.replies}
                  url={item.url}
                  event={{
                    id: '条目.跳转',
                    data: {
                      from: '评论',
                      subjectId
                    }
                  }}
                />
              ))}
            </Expand>
            <Heatmap id='条目.跳转' from='评论' />
          </>
        )}
      </InView>
    )
  },
  DEFAULT_PROPS
)
