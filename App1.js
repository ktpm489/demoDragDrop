import React, { Component } from "react";
import { StyleSheet, View, Text, PanResponder, Animated, } from "react-native";
// https://mindthecode.com/getting-started-with-the-panresponder-in-react-native/
// https://blog.reactnativecoach.com/creating-draggable-component-with-react-native-132d30c27cb0
// https://snack.expo.io/@yoobidev/draggable-component
class Draggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDraggable: true,
            dropAreaValues: null,
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1)
        };
    }

    componentWillMount() {
        this._val = { x: 0, y: 0 }
        this.state.pan.addListener((value) => this._val = value);

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
           onPanResponderGrant: (e, gesture) => {
               // set initial current position state
                this.state.pan.setOffset({
                    x: this._val.x,
                    y: this._val.y
                })
                this.state.pan.setValue({ x: 0, y: 0 })
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                if (this.isDropArea(gesture)) {
                    Animated.timing(this.state.opacity, {
                        toValue: 0,
                        duration: 100
                    }).start(() =>
                        this.setState({
                            showDraggable: false
                        })
                    );
                } else {
                    Animated.spring(this.state.pan,
                        { toValue: { x: 0, y: 0, friction: 5 } }).start()
                }
                // flatten the offset to avoid erratic behavior
                this.state.pan.flattenOffset()
            }
        });
    }

    isDropArea(gesture) {
       //return 0 < gesture.moveY && gesture.moveY < 200;
        let dz = this.props.dropZoneValues
        console.log('dz', JSON.stringify(dz), 'moveY', gesture.moveY)
       return gesture.moveY > dz.y && gesture.moveY < dz.y + dz.height
    }

    render() {
        return (
            <View style={{ width: "20%", alignItems: "center" }}>
                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        }
        if (this.state.showDraggable) {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.View
                        {...this.panResponder.panHandlers}
                        style={[panStyle, styles.circle, { opacity: this.state.opacity }]}
                    />
                </View>
            );
        }
    }
}


export default class App extends Component {
    state = {
    showDraggable: true,
    dropZoneValues: null,
    pan: new Animated.ValueXY()
    }
    
    setDropZoneValues(event) {
        this.setState({ dropZoneValues: event.nativeEvent.layout })
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.dropZone} onLayout={this.setDropZoneValues.bind(this)}>
                    <Text style={styles.text}>Drop them here!</Text>
                </View>
                <View style={styles.ballContainer} />
                <View style={styles.row}>
                    <Draggable   dropZoneValues = {this.state.dropZoneValues }/>
                    <Draggable dropZoneValues={this.state.dropZoneValues}/>
                    <Draggable dropZoneValues={this.state.dropZoneValues}/>
                    <Draggable dropZoneValues={this.state.dropZoneValues}/>
                    <Draggable dropZoneValues={this.state.dropZoneValues}/>
                </View>
            </View>
        );
    }
}

let CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    ballContainer: {
        height: 200
    },
    circle: {
        backgroundColor: "skyblue",
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS
    },
    row: {
        flexDirection: "row"
    },
    dropZone: {
        height: 200,
        backgroundColor: "#00334d"
    },
    text: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        textAlign: "center",
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold"
    }
});