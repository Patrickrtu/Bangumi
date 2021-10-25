/*
 * @Author: czy0729
 * @Date: 2019-06-08 22:14:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2021-10-26 01:47:51
 */
import React from 'react'
import { View } from 'react-native'
import Progress from '@ant-design/react-native/lib/progress'
import { Flex, Text, Input, Button, Heatmap } from '@components'
import { SectionTitle } from '@screens/_'
import { _ } from '@stores'
import { obc, memo } from '@utils/decorators'
import IconSearch from './icon/search'
import IconManga from './icon/manga'
import IconWenku from './icon/wenku'
import IconHD from './icon/hd'

const defaultProps = {
  chap: '',
  vol: '',
  book: {},
  status: {
    name: '未收藏'
  },
  onChangeText: Function.prototype,
  doUpdateBookEp: Function.prototype,
  doUpdateNext: Function.prototype
}

const BookEp = memo(
  ({ chap, vol, book, status, onChangeText, doUpdateBookEp, doUpdateNext }) => {
    rerender('Subject.BookEp.Main')

    return (
      <View style={styles.container}>
        <SectionTitle
          right={
            <>
              <IconSearch />
              <IconManga />
              <IconWenku />
              <IconHD />
            </>
          }
        >
          章节
        </SectionTitle>
        <Flex style={_.mt.md} align='start'>
          {status.name === '未收藏' ? (
            <Text type='sub'>收藏后开启管理</Text>
          ) : (
            <>
              <Flex.Item>
                <Flex>
                  <Text style={styles.label} align='right'>
                    Chap.
                  </Text>
                  <View style={[styles.input, _.ml.sm]}>
                    <Input
                      style={styles.inputRaw}
                      keyboardType='numeric'
                      value={chap}
                      placeholder={book.chap || '0'}
                      clearButtonMode='never'
                      returnKeyType='done'
                      returnKeyLabel='更新'
                      onChangeText={text => {
                        const newText = text.replace(/[^\d]+/, '')
                        onChangeText('chap', newText)
                      }}
                      onSubmitEditing={doUpdateBookEp}
                    />
                    {!!book.totalChap && (
                      <Text style={styles.total} type='sub'>
                        / {book.totalChap}
                      </Text>
                    )}
                  </View>
                  <Button
                    style={[styles.btnPlus, _.ml.sm]}
                    styleText={styles.btnText}
                    type='ghostPrimary'
                    onPress={() => doUpdateNext('chap')}
                  >
                    +
                  </Button>
                </Flex>
                {!!book.totalChap && (
                  <Flex style={styles.progressWrap}>
                    <Progress
                      style={styles.progress}
                      barStyle={styles.bar}
                      percent={(parseInt(chap) / parseInt(book.totalChap)) * 100}
                    />
                  </Flex>
                )}
                <Flex style={_.mt.sm}>
                  <Text style={styles.label} align='right'>
                    Vol.
                  </Text>
                  <View style={[styles.input, _.ml.sm]}>
                    <Input
                      style={styles.inputRaw}
                      keyboardType='numeric'
                      value={vol}
                      placeholder={book.vol || '0'}
                      clearButtonMode='never'
                      returnKeyType='done'
                      returnKeyLabel='更新'
                      onChangeText={text => {
                        const newText = text.replace(/[^\d]+/, '')
                        onChangeText('vol', newText)
                      }}
                      onSubmitEditing={doUpdateBookEp}
                    />
                    {!!book.totalVol && (
                      <Text style={styles.total} type='sub'>
                        / {book.totalVol}
                      </Text>
                    )}
                  </View>
                  <Button
                    style={[styles.btnPlus, _.ml.sm]}
                    styleText={styles.btnText}
                    type='ghostPrimary'
                    onPress={() => doUpdateNext('vol')}
                  >
                    +
                  </Button>
                  <Heatmap id='条目.更新书籍下一个章节' />
                </Flex>
                {!!book.totalVol && (
                  <Flex style={styles.progressWrap}>
                    <Progress
                      style={styles.progress}
                      barStyle={styles.bar}
                      percent={(parseInt(vol) / parseInt(book.totalVol)) * 100}
                    />
                  </Flex>
                )}
              </Flex.Item>
              <View style={_.ml.md}>
                <Button style={styles.btn} type='ghostPrimary' onPress={doUpdateBookEp}>
                  更新
                </Button>
                <Heatmap id='条目.更新书籍章节' />
              </View>
            </>
          )}
        </Flex>
      </View>
    )
  },
  defaultProps
)

export default obc((props, { $ }) => {
  rerender('Subject.BookEp')

  return (
    <BookEp
      chap={$.state.chap}
      vol={$.state.vol}
      book={$.subjectFormHTML.book}
      status={$.collection.status}
      onChangeText={$.changeText}
      doUpdateBookEp={$.doUpdateBookEp}
      doUpdateNext={$.doUpdateNext}
    />
  )
})

const labelWidth = 48 * _.ratio
const inputWidth = 120 * _.ratio

const styles = _.create({
  container: {
    height: 120 * _.ratio,
    paddingHorizontal: _.wind,
    marginTop: _.lg
  },
  label: {
    width: labelWidth
  },
  input: {
    width: inputWidth,
    height: _.device(34, 48)
  },
  inputRaw: {
    height: 34 * _.ratio,
    paddingVertical: 0,
    paddingHorizontal: _.sm + 2,
    color: _.colorSub,
    fontWeight: 'bold',
    ..._.device(_.fontSize13, _.fontSize15)
  },
  total: {
    position: 'absolute',
    zIndex: 100,
    top: _.device(8, 10),
    right: 12 * _.ratio
  },
  btn: {
    width: 56 * _.ratio,
    height: _.device(34, 48)
  },
  btnPlus: {
    width: 40 * _.ratio,
    height: _.device(34, 48)
  },
  btnText: _.device(_.fontSize13, _.fontSize18),
  progressWrap: {
    width: inputWidth,
    marginLeft: labelWidth + _.sm,
    marginBottom: 4
  },
  progress: {
    backgroundColor: 'transparent',
    borderRadius: 4
  },
  bar: {
    backgroundColor: 'transparent',
    borderBottomColor: _.colorPrimary,
    borderBottomWidth: 4,
    borderRadius: 4
  }
})
