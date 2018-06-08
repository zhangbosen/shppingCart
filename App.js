/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    ListView,
    View
} from 'react-native';

import Cell from './components/subComponents/Cell';
import Bottom from './components/subComponents/Bottom';

const cartData = require("./LocalData/data.json");


export default class App extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        
        this.state = {
            dataSource: ds
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {/*上边*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                />
                {/*下边*/}
                <Bottom />
            </View>



        );
    }
    
    componentDidMount() {
        cartData.forEach((val, idx) => {
            val.buyCount = 0;
        });

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(cartData)
        })
    }
    
    _renderRow(rowData, sectionId, rowId) {
        return (
            <Cell rowData={rowData}/>
        )
    }
}

const styles = StyleSheet.create({
   container: {
       flex: 1
   }
});
