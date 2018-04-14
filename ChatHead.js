import React, { Component } from 'react'
import { presets, spring, StaggeredMotion } from 'react-motion'
import _ from 'lodash'
import { Dimensions, PanResponder, View } from 'react-native'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
const colors = ['#F44336', '#9C27B0', '#2196F3', '#009688', '#FF9800', '#607D8B']
// https://blog.reactnativecoach.com/creating-facebook-chat-head-bubbles-in-react-native-bdbbe338bb99
export class ChatHead extends Component {
    state = {
        x: 100,
        y: 100
    }
    panResponder = PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: (event) => {
            this.setState({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
        }
    })
    render() {
        return (
            <View {...this.panResponder.panHandlers} styles={{ width: screenWidth, height: screenHeight }}>
                <StaggeredMotion defaultStyles={_.range(6).map(() => ({ x: 0, y: 0 }))}
                    styles={(prevInterpolatedStyles) => prevInterpolatedStyles.map((a, i) => {
                        return i == 0 ? this.state : {
                            x: spring(prevInterpolatedStyles[i - 1].x, presets.gentle),
                            y: spring(prevInterpolatedStyles[i - 1].y, presets.gentle)
                        }
                    })}>

                    {interpolatingStyles =>
                        <View>
                            {interpolatingStyles.slice().reverse().map(({ x, y }, i) => {
                                const index = interpolatingStyles.length - i - 1
                                return <View
                                    key={index}
                                    style={{
                                        width: 70,
                                        borderRadius: 35,
                                        height: 70,
                                        position: 'absolute',
                                        left: x + 3 * index,
                                        top: y + 3 * index,
                                        backgroundColor: colors[index],
                                    }}
                                />
                            })
                            }
                        </View>
                    }

                </StaggeredMotion>
            </View>
        )
    }
}

export default ChatHead;
