/*
 * @Author: czy0729
 * @Date: 2019-06-30 15:48:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-03 06:09:36
 */
import React from 'react'
import { View } from 'react-native'
import Constants from 'expo-constants'
import cheerio from 'cheerio-without-node-native'
import {
  KeyboardSpacer,
  StatusBarEvents,
  Touchable,
  Text,
  Flex,
  Iconfont,
  UM,
  Heatmap
} from '@components'
import { StatusBarPlaceholder } from '@_'
import { _, userStore, usersStore, rakuenStore } from '@stores'
import { getTimestamp, setStorage, getStorage, open, urlStringify } from '@utils'
import { ob } from '@utils/decorators'
import { xhrCustom, hm, t, queue } from '@utils/fetch'
import { info, feedback, confirm } from '@utils/ui'
import axios from '@utils/thirdParty/axios'
import { HOST, APP_ID, APP_SECRET, URL_OAUTH_REDIRECT, URL_PRIVACY } from '@constants'
import i18n from '@constants/i18n'
import Preview from './preview'
import Form from './form'

const title = '登录'
const namespace = 'LoginV2'
const AUTH_RETRY_COUNT = 10

class LoginV2 extends React.Component {
  state = {
    host: HOST,
    clicked: false,
    email: '',
    password: '',
    captcha: '',
    base64: '',
    isCommonUA: false,
    loading: false,
    info: '',
    focus: false
  }

  userAgent = ''
  formhash = ''
  lastCaptcha = ''
  cookie = {}
  code = ''
  accessToken = {}
  retryCount = 0

  codeRef

  async componentDidMount() {
    const state = {}
    const host = await getStorage(`${namespace}|host`)
    if (host) state.host = host

    const email = await getStorage(`${namespace}|email`)
    if (email) state.email = email

    const password = await getStorage(`${namespace}|password`)
    if (password) state.password = password

    const isCommonUA = await getStorage(`${namespace}|isCommonUA`)
    if (isCommonUA) state.isCommonUA = isCommonUA

    this.setState(state, () => {
      this.reset()
    })
    hm('login/v2', 'LoginV2')
  }

  /**
   * 游客访问
   */
  onTour = async () => {
    t('登录.游客访问')

    try {
      info('正在从github获取游客cookie...')

      const { _response } = await xhrCustom({
        url: `https://gitee.com/a296377710/bangumi/raw/master/tourist.json?t=${getTimestamp()}`
      })
      const { accessToken, userCookie } = JSON.parse(_response)
      userStore.updateAccessToken(accessToken)

      const { navigation } = this.props
      userStore.updateUserCookie({
        cookie: userCookie.cookie,
        userAgent: userCookie.userAgent,
        v: 0,
        tourist: 1
      })

      info(`${i18n.login()}成功, 正在请求个人信息...`, 6)
      userStore.fetchUserInfo()
      userStore.fetchUsersInfo()
      feedback()
      navigation.popToTop()
    } catch (error) {
      warn(namespace, 'onTour', error)
      info(`${i18n.login()}状态过期, 请稍后再试`)
    }
  }

  /**
   * 显示登录表单
   */
  onPreviewLogin = () =>
    this.setState({
      clicked: true
    })

  /**
   * 登录最终失败
   */
  loginFail = async info => {
    t('登录.错误')

    this.setState({
      loading: false,
      info
    })
    this.reset()
  }

  /**
   * 登录流程
   */
  onLogin = async () => {
    const { email, password, captcha } = this.state
    if (!email || !password || !captcha) {
      info('请填写以上字段')
      return
    }

    try {
      if (this.lastCaptcha !== captcha) {
        t('登录.登录')

        if (typeof this?.codeRef?.inputRef?.blur === 'function') {
          this.codeRef.inputRef.blur()
        }
        setStorage(`${namespace}|email`, email)

        await this.login()

        if (!this.cookie.chii_auth) {
          this.loginFail(`验证码或密码错误，稍会再重试或前往授权${i18n.login()} →`)
          return
        }

        // 缓存上次的正确的验证码
        this.lastCaptcha = captcha

        await this.oauth()
        await this.authorize()
      } else {
        this.setState({
          info: '重试 (4/5)'
        })
        this.retryCount += 1
      }

      await this.getAccessToken()

      setStorage(`${namespace}|password`, password)
      this.inStore()
    } catch (ex) {
      if (this.retryCount >= AUTH_RETRY_COUNT) {
        this.loginFail(
          `[${String(
            ex
          )}] ${i18n.login()}失败，请重试或重启APP，或点击前往旧版授权${i18n.login()} →`
        )
        return
      }

      warn('login/v2/index.js', 'onLogin', ex)
      this.onLogin()
    }
  }

  /**
   * 随机生成一个UserAgent
   */
  getUA = async () => {
    const { isCommonUA } = this.state
    if (isCommonUA) {
      // 与ekibun的bangumi一样的ua
      const ua =
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Mobile Safari/537.36'
      this.userAgent = ua
      return ua
    }

    const res = Constants.getWebViewUserAgentAsync()
    const UA = await res
    this.userAgent = `${UA} ${getTimestamp()}`

    return res
  }

  /**
   * 获取表单hash
   */
  getFormHash = async () => {
    const { host } = this.state

    axios.defaults.withCredentials = false
    const { data, headers } = await axios({
      method: 'get',
      url: `${host}/login`,
      headers: {
        'User-Agent': this.userAgent
      }
    })
    this.updateCookie(headers?.['set-cookie']?.[0])

    const match = data.match(/<input type="hidden" name="formhash" value="(.+?)">/)
    if (match) this.formhash = match[1]

    return true
  }

  /**
   * 获取验证码
   */
  getCaptcha = async () => {
    this.setState({
      base64: ''
    })

    const { host } = this.state

    axios.defaults.withCredentials = false
    const { request } = await axios({
      method: 'get',
      url: `${host}/signup/captcha?${getTimestamp()}`,
      headers: {
        Cookie: this.cookieString,
        'User-Agent': this.userAgent
      },
      responseType: 'arraybuffer'
    })

    this.setState({
      base64: `data:image/gif;base64,${request._response}`,
      captcha: ''
    })

    return true
  }

  /**
   * 密码登录
   */
  login = async () => {
    this.setState({
      loading: true,
      info: `${i18n.login()}请求中...(1/5)`
    })

    const { host, email, password, captcha } = this.state

    axios.defaults.withCredentials = false
    const { data, headers } = await axios({
      method: 'post',
      url: `${host}/FollowTheRabbit`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: this.cookieString,
        'User-Agent': this.userAgent
      },
      data: urlStringify({
        formhash: this.formhash,
        referer: '',
        dreferer: '',
        email,
        password,
        captcha_challenge_field: captcha,
        loginsubmit: '登录'
      })
    })
    this.updateCookie(headers?.['set-cookie']?.[0])

    if (data.includes('分钟内您将不能登录本站')) {
      info(`累计 5 次错误尝试，15 分钟内您将不能${i18n.login()}本站。`)
    } else {
      this.updateCookie(headers?.['set-cookie']?.[0])
    }

    return true
  }

  /**
   * 获取授权表单码
   */
  oauth = async () => {
    this.setState({
      info: '获取授权表单码...(2/5)'
    })

    const { host } = this.state

    axios.defaults.withCredentials = false
    const { data } = await axios({
      method: 'get',
      url: `${host}/oauth/authorize?client_id=${APP_ID}&response_type=code&redirect_uri=${URL_OAUTH_REDIRECT}`,
      headers: {
        'User-Agent': this.userAgent,
        Cookie: this.cookieString
      }
    })

    this.formhash = cheerio.load(data)('input[name=formhash]').attr('value')

    return true
  }

  /**
   * 授权获取code
   */
  authorize = async () => {
    this.setState({
      info: '授权中...(3/5)'
    })

    const { host } = this.state

    axios.defaults.withCredentials = false
    const { request } = await axios({
      method: 'post',
      maxRedirects: 0,
      validateStatus: null,
      url: `${host}/oauth/authorize?client_id=${APP_ID}&response_type=code&redirect_uri=${URL_OAUTH_REDIRECT}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userAgent,
        Cookie: this.cookieString
      },
      data: urlStringify({
        formhash: this.formhash,
        redirect_uri: '',
        client_id: APP_ID,
        submit: '授权'
      })
    })

    this.code = request?.responseURL?.split('=').slice(1).join('=')

    return true
  }

  /**
   * code获取access_token
   */
  getAccessToken = async () => {
    this.setState({
      info: '授权成功, 获取token中...(4/5)'
    })

    const { host } = this.state

    axios.defaults.withCredentials = false
    const { status, data } = await axios({
      method: 'post',
      maxRedirects: 0,
      validateStatus: null,
      url: `${host}/oauth/access_token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userAgent
      },
      data: urlStringify({
        grant_type: 'authorization_code',
        client_id: APP_ID,
        client_secret: APP_SECRET,
        code: this.code,
        redirect_uri: URL_OAUTH_REDIRECT,
        state: getTimestamp()
      })
    })

    if (status !== 200) {
      throw new TypeError(status)
    }

    this.accessToken = data
    return true
  }

  /**
   * 更新responseHeader的set-cookie
   * @param {*} setCookie
   */
  updateCookie = (setCookie = '') => {
    const setCookieKeys = [
      '__cfduid',
      'chii_sid',
      'chii_sec_id',
      'chii_cookietime',
      'chii_auth'
    ]

    setCookieKeys.forEach(item => {
      const reg = new RegExp(`${item}=(.+?);`)
      const match = setCookie.match(reg)
      if (match) {
        this.cookie[item] = match[1]
      }
    })
  }

  /**
   * 入库
   */
  inStore = async () => {
    this.setState({
      info: `${i18n.login()}成功, 正在请求个人信息...(5/5)`
    })

    const { navigation } = this.props
    userStore.updateUserCookie({
      cookie: this.cookieString,
      userAgent: this.userAgent,
      v: 0
    })
    userStore.updateAccessToken(this.accessToken)

    feedback()
    navigation.popToTop()
    t('登录.成功')

    queue(
      [
        () => userStore.fetchUserInfo(),
        () => userStore.fetchUsersInfo(),
        () => usersStore.fetchFriends(),
        () => rakuenStore.downloadFavorTopic()
      ],
      1
    )
  }

  /**
   *
   */
  reset = async () => {
    this.cookie = {}
    this.setState({
      base64: ''
    })

    this.retryCount = 0
    await this.getUA()
    await this.getFormHash()
    await this.getCaptcha()
  }

  onFocus = () =>
    this.setState({
      focus: true
    })

  onBlur = () =>
    this.setState({
      // focus: false
    })

  /**
   * 输入框变化
   */
  onChange = (evt, type) => {
    const { nativeEvent } = evt
    const { text } = nativeEvent
    this.setState({
      [type]: text,
      info: ''
    })
  }

  /**
   * 切换登录域名
   */
  onSelect = host => {
    setStorage(`${namespace}|host`, host)
    this.setState(
      {
        host
      },
      () => {
        t('登录.切换域名', {
          host
        })

        this.reset()
      }
    )
  }

  /**
   * 切换是否使用固定UA登录
   */
  onUAChange = () => {
    const { isCommonUA } = this.state
    const next = !isCommonUA

    setStorage(`${namespace}|isCommonUA`, next)
    this.setState({
      isCommonUA: next
    })

    this.reset()
  }

  get cookieString() {
    return Object.keys(this.cookie)
      .map(item => `${item}=${this.cookie[item]}`)
      .join('; ')
  }

  renderPreview() {
    return (
      <Preview
        onLogin={this.onPreviewLogin}
        onTour={() =>
          confirm(
            `将使用开发者的测试账号, 提供大部分功能预览, 确定${i18n.login()}? (可以在设置里面退出${i18n.login()})`,
            this.onTour,
            '提示'
          )
        }
      />
    )
  }

  renderForm() {
    const { navigation } = this.props
    const { host, email, password, captcha, base64, isCommonUA, loading, info } =
      this.state
    return (
      <Form
        forwardRef={ref => (this.codeRef = ref)}
        navigation={navigation}
        email={email}
        password={password}
        captcha={captcha}
        base64={base64}
        isCommonUA={isCommonUA}
        loading={loading}
        info={info}
        host={host}
        onGetCaptcha={this.getCaptcha}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onChange={this.onChange}
        onSelect={this.onSelect}
        onUAChange={this.onUAChange}
        onLogin={this.onLogin}
      />
    )
  }

  renderContent() {
    const { clicked, focus } = this.state
    return (
      <>
        <View style={_.container.flex}>
          {clicked ? this.renderForm() : this.renderPreview()}
        </View>
        {clicked ? (
          !focus && (
            <View style={this.styles.ps}>
              <Text size={12} lineHeight={14} type='sub'>
                隐私策略: 我们十分尊重您的隐私, 我们不会收集上述信息. (多次
                {i18n.login()}失败后可能一段时间内不能再次{i18n.login()})
              </Text>
            </View>
          )
        ) : (
          <Flex style={this.styles.old} justify='around'>
            <Touchable
              onPress={() => {
                t('登录.跳转', {
                  to: 'Signup'
                })

                confirm(
                  // eslint-disable-next-line max-len
                  '声明: 本APP的性质为第三方，只提供显示数据和简单的操作，没有修复和改变源站业务的能力。 \n\n在移动端浏览器注册会经常遇到验证码错误，碰到错误建议在浏览器里使用 [电脑版UA]，再不行推荐使用电脑Chrome注册。 \n\n注册后会有 [激活码] 发到邮箱，测试过只会发送一次，请务必在激活有效时间内激活，否则这个注册账号就废了。输入激活码前，看见下方的文字改变了再填入，提示服务不可用的请务必等到浏览器加载条完成，不然永远都会说激活码错误。\n\n作者只能帮大家到这里了。',
                  () => open('https://bgm.tv/signup'),
                  '提示',
                  () => {},
                  '前往注册'
                )
              }}
            >
              <Flex justify='center'>
                <Text size={11} type='sub' bold>
                  注册
                </Text>
                <Iconfont
                  style={_.ml.xxs}
                  name='md-open-in-new'
                  color={_.colorSub}
                  size={12}
                />
              </Flex>
              <Heatmap id='登录.跳转' to='Signup' alias='注册' />
            </Touchable>
            <Touchable
              onPress={() => {
                t('登录.跳转', {
                  to: 'Privacy'
                })

                open(URL_PRIVACY)
              }}
            >
              <Flex justify='center'>
                <Text size={11} type='sub' bold>
                  隐私保护政策
                </Text>
                <Iconfont
                  style={_.ml.xxs}
                  name='md-open-in-new'
                  color={_.colorSub}
                  size={12}
                />
              </Flex>
              <Heatmap id='登录.跳转' to='Privacy' alias='隐私保护政策' />
            </Touchable>
            <Text
              size={11}
              bold
              type='sub'
              onPress={() => {
                t('登录.跳转', {
                  to: 'Login'
                })

                const { navigation } = this.props
                navigation.push('Login')
              }}
            >
              旧版{i18n.login()}
              <Heatmap id='登录.跳转' to='Login' alias='旧版登录' />
            </Text>
            <Text
              size={11}
              bold
              type='sub'
              onPress={() => {
                t('登录.跳转', {
                  to: 'LoginAssist'
                })

                const { navigation } = this.props
                navigation.push('LoginAssist')
              }}
            >
              辅助{i18n.login()}
              <Heatmap id='登录.跳转' to='LoginAssist' alias='辅助登录' />
            </Text>
          </Flex>
        )}
      </>
    )
  }

  render() {
    return (
      <View style={_.container.plain}>
        <UM screen={title} />
        <StatusBarEvents backgroundColor='transparent' />
        <StatusBarPlaceholder />
        {this.renderContent()}
        <KeyboardSpacer topSpacing={_.ios(-120, 0)} />
        <Heatmap id='登录.登录' right={_.wind} bottom={_.bottom + 120} transparent />
        <Heatmap id='登录.成功' right={_.wind} bottom={_.bottom + 86} transparent />
        <Heatmap id='登录.错误' right={_.wind} bottom={_.bottom + 52} transparent />
        <Heatmap id='登录' screen='Login' />
      </View>
    )
  }

  get styles() {
    return memoStyles()
  }
}

export default ob(LoginV2)

const memoStyles = _.memoStyles(() => ({
  old: {
    position: 'absolute',
    zIndex: 1,
    bottom: _.bottom,
    left: _.wind,
    right: _.wind,
    padding: _.sm
  },
  ps: {
    position: 'absolute',
    right: _.wind * 2,
    bottom: _.bottom,
    left: _.wind * 2
  },
  border: {
    borderLeftWidth: 1,
    borderColor: _.colorBorder
  }
}))
