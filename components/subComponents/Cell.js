
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    PixelRatio,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

export default class Cell extends Component {
    static defaultProps = {
        rowData: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            rowData: this.props.rowData
        };
        this._subtraction = this._subtraction.bind(this);
        this._addition = this._addition.bind(this);
    }
    

    render() {
        const rowData = this.state.rowData;
        return (
            <View style={styles.box}>
                {/*左边*/}
                <View style={styles.left}>
                    <Image source={{uri: rowData.image}} style={styles.img} />
                    <View style={styles.leftInnerText}>
                        <Text numberOfLines={2}>{rowData.name}</Text>
                        <Text>¥{rowData.money}</Text>
                    </View>
                </View>

                {/*右边*/}
                <View style={styles.right}>
                    <TouchableOpacity onPress={this._subtraction}>
                        <Text style={[styles.rightText, styles.circle]}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.rightText}>{rowData.buyCount}</Text>
                    <TouchableOpacity onPress={this._addition}>
                        <Text style={[styles.rightText, styles.circle]}>+</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }

    componentWillUpdate() {
        this.notice = DeviceEventEmitter.addListener("updateView", () => {
            let rowData = this.state.rowData;
            rowData.buyCount = 0;
            this.setState({
                rowData: rowData
            })
        })
    }

    componentWillUnmount() {
        this.notice.remove();
    }


    _subtraction() {
        let rowData = this.state.rowData;
        if(rowData.buyCount <= 0){
            alert("不能再减了!");
            return;
        }
        rowData.buyCount --;
        this.setState({
            rowData: rowData
        });
        
        this._pushNotice()


    }

    _addition() {
        let rowData = this.state.rowData;
        rowData.buyCount ++;
        this._pushNotice();
        this.setState({
            rowData: rowData
        });
        



    }

    _pushNotice() {
        DeviceEventEmitter.emit("changeRowData", this.state.rowData);
    }

}

const styles = StyleSheet.create({
    box: {
        flexDirection: "row",
        padding: 15,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: "#ccc"
    },
    left: {
        flex: 7,
        flexDirection: "row",
        // backgroundColor: "green"
    },
    leftInnerText: {
        flex: 1,
        justifyContent: "space-around",
        marginLeft: 10
    },
    right: {
        flex: 3,
        // backgroundColor: "red",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    img: {
        width: 70,
        height: 70,
        resizeMode: "contain"
    },
    rightText: {
        fontSize: 20,
        color: "blue"
    },
    circle: {
        width: 20,
        height: 20,
        lineHeight: 20,
        borderWidth: 1,
        borderColor: "blue",
        borderRadius: 10,
        textAlign: "center"
    }
});