/*
 * @Author: czy0729
 * @Date: 2023-01-22 06:05:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-24 01:19:12
 */
import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { Touchable } from '@components'
import { systemStore } from '@stores'
import { useIsFocused, useObserver } from '@utils/hooks'
import { t } from '@utils/fetch'
import { HOST, TEXT_ONLY } from '@constants'
import { Navigation } from '@types'
import { memoStyles } from './styles'

function Award2022({
  navigation,
  width,
  height
}: {
  navigation: Navigation
  width?: number
  height?: number
}) {
  const show = useIsFocused()

  return useObserver(() => {
    const styles = memoStyles()
    const { coverRadius } = systemStore.setting
    return (
      <View
        style={[
          styles.container,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            height: height || styles.container.height,
            marginRight: height ? 0 : styles.container.marginRight,
            borderRadius: coverRadius
          }
        ]}
      >
        <Touchable
          style={[
            styles.item2022,
            {
              width: width || styles.item2022.width,
              height: height || styles.item2022.height
            }
          ]}
          animate
          onPress={() => {
            t('发现.跳转', {
              to: 'Award',
              year: 2022
            })

            navigation.push('Award', {
              uri: `${HOST}/award/2022`
            })
          }}
        >
          {!TEXT_ONLY && (
            <View
              style={[
                styles.body,
                {
                  width: width || styles.body.width,
                  height: height || styles.body.height
                }
              ]}
              pointerEvents='none'
            >
              {show && (
                <WebView
                  style={[
                    styles.body,
                    {
                      width: width || styles.body.width,
                      height: height || styles.body.height
                    }
                  ]}
                  source={{
                    html: `<!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                      <meta name="viewport" content="width=device-width,initial-scale=1" />
                      <title>Bangumi Award 2022</title>
                      <style>
                        * {
                          padding: 0;
                          margin: 0;
                        }
                        ::-webkit-scrollbar {
                          display: none;
                        }
                        body {
                          background: #fff;
                        }
                        a {
                          font-size: 13px;
                          text-decoration: none;
                        }
                        .award2022 .header {
                          margin: 30px auto;
                          text-indent: -9999px;
                          font-size: 0;
                          line-height: 100%;
                          background: url(https://bgm.tv/img/event/2022/title.png);
                          width: 80%;
                          max-width: 860px;
                          max-height: 120px;
                          aspect-ratio: 860 / 120;
                          background-size: 100% auto;
                          background-repeat: no-repeat;
                          z-index: 3;
                          position: relative;
                        }
                        .award2022 .heroes {
                          position: absolute;
                          width: 168px;
                          height: 85px;
                          background-image: url(https://bgm.tv/img/event/2022/heroes_s.png);
                          background-size: 100% 100%;
                          background-repeat: no-repeat;
                          bottom: 0;
                          z-index: 2;
                        }
                        .oceanCanvas {
                          position: absolute;
                          overflow: hidden;
                          width: 100%;
                          height: 100%;
                          z-index: 1;
                        }
                        .oceanCanvas div {
                          position: absolute;
                          overflow: hidden;
                        }
                        .oceanCanvas .sea {
                          height: 30%;
                          width: 200%;
                          left: -50%;
                          top: 40%;
                          border-radius: 0 0 50% 50%;
                          background: linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 1) 0%,
                            rgba(255, 255, 255, 1) 75%,
                            rgba(235, 233, 234, 1) 100%
                          );
                          animation: waveanim ease-in-out 10s;
                          animation-iteration-count: infinite;
                          transform-origin: 50% 0%;
                          overflow: hidden;
                        }
                        .oceanCanvas .sand {
                          height: 35%;
                          width: 100%;
                          background: rgb(248, 247, 245);
                          top: 65%;
                          border-radius: 0 0 15px 15px;
                        }
                        .oceanCanvas .sand-front {
                          height: 10%;
                          width: 100%;
                          background: rgb(248, 247, 245);
                          top: 90%;
                          border-radius: 0 0 15px 15px;
                        }
                        .oceanCanvas .wet-sand {
                          height: 37.5%;
                          width: 200%;
                          left: -50%;
                          top: 40%;
                          border-radius: 0 0 50% 50%;
                          background: rgb(237, 233, 227);
                          box-shadow: 0 10px 10px 0 rgb(241, 238, 234);
                          animation: wetsandanim ease-in-out 10s;
                          animation-iteration-count: infinite;
                        }
                        @keyframes waveanim {
                          0% {
                            transform: scaleY(1);
                          }
                          35% {
                            transform: scaleY(1.3);
                          }
                          69% {
                            transform: scaleY(1);
                          }
                          100% {
                            transform: scaleY(1);
                          }
                        }
                        @keyframes wetsandanim {
                          0% {
                            opacity: 0.2;
                          }
                          34% {
                            opacity: 0.2;
                          }
                          35% {
                            opacity: 0.7;
                          }
                          100% {
                            opacity: 0.2;
                          }
                        }
                        @keyframes seafoamanim {
                          0% {
                            opacity: 0;
                          }
                          30% {
                            opacity: 1;
                          }
                          50% {
                            opacity: 0;
                          }
                          100% {
                            opacity: 0;
                          }
                        }
                      </style>
                    </head>
                    <body>
                      <div
                        class="award2022"
                        style="
                          position: relative;
                          box-sizing: border-box;
                          border: none;
                          padding: 0;
                          margin: 0 0 10px 0;
                          background-color: transparent;
                          width: ${width || styles.body.width}px;
                          height: ${height || styles.body.height}px;
                          line-height: 100%;
                        "
                      >
                        <div
                          style="
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            z-index: 1;
                            color: #fff;
                            background-color: transparent;
                          "
                        >
                          <div class="oceanCanvas">
                            <div class="sand"></div>
                            <div class="wet-sand"></div>
                            <div class="sea">
                              <div class="seafoam"></div>
                            </div>
                            <div class="seafoam"></div>
                            <div class="sea">
                              <div class="seafoam"></div>
                            </div>
                            <div class="sand-front"></div>
                          </div>
                          <div class="heroes"></div>
                          <div class="header"></div>
                        </div>
                      </div>
                    </body>
                  </html>`
                  }}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  androidHardwareAccelerationDisabled
                  androidLayerType='software'
                />
              )}
            </View>
          )}
        </Touchable>
      </View>
    )
  })
}

export default Award2022
