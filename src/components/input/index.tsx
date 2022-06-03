/*
 * 输入框
 *
 * @Doc: https://www.react-native.cn/docs/textinput
 * @Doc: https://lefkowitz.me/visual-guide-to-react-native-textinput-keyboardtype-options/
 * @Author: czy0729
 * @Date: 2019-03-19 01:43:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-06-03 16:48:29
 */
import React from 'react'
import { View, TextInput, TouchableWithoutFeedback } from 'react-native'
import { observer } from 'mobx-react'
import { _ } from '@stores'
import { IOS } from '@constants'
import { Iconfont } from '../iconfont'
import { Touchable } from '../touchable'
import { Flex } from '../flex'
import { memoStyles } from './styles'
import { Props } from './types'

/** 一行的大概高度 */
const initInputHeight = 18

export const Input = observer(
  class InputComponent extends React.Component<Props> {
    static defaultProps = {
      style: undefined,
      multiline: false,
      numberOfLines: 1,
      showClear: false,
      colorClear: undefined,
      autoFocus: false,
      placeholderTextColor: undefined,
      onChange: Function.prototype,
      onChangeText: Function.prototype
    }

    state = {
      value: this.props.value
    }

    UNSAFE_componentWillReceiveProps({ value }) {
      this.setState({
        value
      })
    }

    componentDidMount() {
      const { autoFocus } = this.props
      if (autoFocus) this.onFocus()
    }

    inputRef: TextInput

    onFocus = () => {
      try {
        this.inputRef.focus()

        setTimeout(() => {
          this.inputRef.focus()
        }, 0)
      } catch (error) {}
    }

    onBlur = () => {
      try {
        this.inputRef.blur()

        setTimeout(() => {
          this.inputRef.blur()
        }, 0)
      } catch (error) {}
    }

    onChange = evt => {
      const { onChange } = this.props
      const { nativeEvent } = evt
      const { text } = nativeEvent
      this.setState({
        value: text
      })
      onChange(evt)
    }

    clear = () => {
      const { onChange, onChangeText } = this.props
      onChange({
        nativeEvent: {
          text: ''
        }
      })
      onChangeText('')
    }

    get borderRadius() {
      return _.radiusXs
    }

    get clearButtonMode() {
      // 安卓使用了模拟按钮代替原生按钮
      if (!IOS) return 'never'

      const { showClear } = this.props
      return showClear ? 'while-editing' : 'never'
    }

    renderClear() {
      const { value } = this.state
      if (IOS || value === '') return null

      const { colorClear } = this.props
      return (
        <Touchable style={this.styles.close} useRN onPress={this.clear}>
          <Flex style={this.styles.icon} justify='center'>
            <Iconfont name='md-close' size={16} color={colorClear} />
          </Flex>
        </Touchable>
      )
    }

    render() {
      const {
        style,
        multiline,
        numberOfLines,
        showClear,
        colorClear,
        autoFocus,
        placeholderTextColor,
        ...other
      } = this.props
      if (multiline) {
        const containerHeight = initInputHeight * numberOfLines + 18
        return (
          <View style={this.styles.container}>
            <TouchableWithoutFeedback onPress={this.onFocus}>
              <View
                style={[
                  this.styles.multiContainer,
                  {
                    height: containerHeight,
                    borderRadius: this.borderRadius
                  },
                  style
                ]}
              >
                <TextInput
                  ref={ref => (this.inputRef = ref)}
                  style={this.styles.multiInput}
                  multiline
                  textAlignVertical='top'
                  numberOfLines={numberOfLines}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  allowFontScaling={false}
                  placeholderTextColor={placeholderTextColor || _.colorDisabled}
                  {...other}
                  onChange={this.onChange}
                />
              </View>
            </TouchableWithoutFeedback>
            {showClear && this.renderClear()}
          </View>
        )
      }

      return (
        <View style={this.styles.container}>
          <TextInput
            ref={ref => (this.inputRef = ref)}
            style={[
              this.styles.input,
              {
                borderRadius: this.borderRadius
              },
              style
            ]}
            numberOfLines={numberOfLines}
            allowFontScaling={false}
            autoCapitalize='none'
            autoCorrect={false}
            underlineColorAndroid='transparent'
            clearButtonMode={this.clearButtonMode}
            placeholderTextColor={placeholderTextColor || _.colorDisabled}
            selectionColor={_.colorMain}
            // @ts-ignore
            cursorColor={_.colorMain}
            {...other}
            onChange={this.onChange}
          />
          {showClear && this.renderClear()}
        </View>
      )
    }

    get styles() {
      return memoStyles()
    }
  }
)
