/**
 * Created by kobe on 2018/6/7.
 */


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

const {width, height } = require("Dimensions").get("window");

export default class Bottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //商品总价
            totalPrice: 0,

            //购物车
            rowsList: []
        };
        this._buy = this._buy.bind(this);
        this._clear = this._clear.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                {/*左边*/}
                <View style={styles.left}>
                    <Text>   总价:   </Text>
                    <Text>¥{this.state.totalPrice}</Text>
                </View>
                {/*右边*/}
                <View style={styles.right}>
                    <TouchableOpacity onPress={this._buy}>
                        <Text>购买   </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clear}>
                        <Text>清空购物车   </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    componentDidMount() {
        //赋值给this.notice, 方便在这个组件注销时,销毁这个监听事件(具体在componentWillUnmount中销毁)
        this.notice = DeviceEventEmitter.addListener("changeRowData", rowData => {
            //拿到这个数据, 要做一个深拷贝
            let cloneRowData = JSON.parse(JSON.stringify(rowData));

            let rowsList = this.state.rowsList;
            rowsList.forEach((val, idx) => {
                if(val.id == cloneRowData.id) {
                    rowsList.splice(idx, 1);
                }
            });
            rowsList.push(cloneRowData);

            let totalPrice = 0;
            rowsList.forEach((val, idx) => {
                totalPrice += val.buyCount * val.money;
            });

            this.setState({
                totalPrice: totalPrice,
                rowsList: rowsList
            })

        })
    }

    componentWillUnmount() {
        //在组件销毁时移除监听事件
        this.notice.remove();
    }

    _buy() {
        if(this.state.rowsList.length == 0 || this.state.totalPrice == 0) {
            alert("购物车空空如也~");
            return;
        }
        let buyString = "购物车清单:\n";
        const rowsList = this.state.rowsList;
        rowsList.forEach((val, idx) => {
            buyString += "商品Id: " + val.id + " 商品价格: ¥" + val.money + " 商品数量: " + val.buyCount + "\n";
        });

        buyString += "商品总价: " + this.state.totalPrice;

        alert(buyString);
    }

    _clear() {
        // 第一步: 更新本组件
        const rowsList = this.state.rowsList;
        rowsList.splice(0, rowsList.length);

        this.setState({
            rowsList: rowsList,
            totalPrice: 0
        });

        // 第二步: 更新兄弟组件视图
        DeviceEventEmitter.emit("updateView")

    }

}

const styles = StyleSheet.create({
   container: {
       width: width,
       height: height * 0.05,
       backgroundColor: "#ccc",
       flexDirection: "row",
       justifyContent: "space-between"
   },
    left: {
        flexDirection: "row",
        alignItems: "center"
    },
    right: {
        flexDirection: "row",
        alignItems: "center"
    }
});
