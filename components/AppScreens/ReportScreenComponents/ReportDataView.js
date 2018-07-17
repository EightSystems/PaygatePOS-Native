import React, {PureComponent} from 'react';
import { View, Text, FlatList } from 'react-native';

import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

import { Grid as GraphGrid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import HTML from 'react-native-render-html';

class InternalRow extends PureComponent {
    render() {
        return <Row {...this.props}/>
    }
}

export default class ReportDataView extends PureComponent {
    renderGraph(graphData) {
        const axesSvg = { fontSize: 10, fill: 'grey' };
        const verticalContentInset = { top: 10, bottom: 10 };
        const xAxisHeight = 30;

        const graphHeader = Object.values(graphData.data[0]);
        const hAxis = graphHeader.indexOf(graphData.hAxis);

        var labels = [];
        const data = Object.values(graphData.data.slice(1)).map((dataValue) => {
            if ( hAxis == 0 ) {
                labels.push(dataValue[0]);
                return dataValue[1];
            }

            labels.push(dataValue[1]);
            return dataValue[0];
        });

        return (
            <View style={{height: 200, padding: 20, flexDirection: 'row'}}>
                <YAxis
                    data={data}
                    style={{ marginBottom: xAxisHeight }}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={data}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <GraphGrid/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={data}
                        formatLabel={(value, index) => labels[index]}
                        contentInset={{ left: 10, right: 10 }}
                        svg={axesSvg}
                    />
                </View>
            </View>
        );
    }

    renderTable(tableData, hasGraph) {
        if ( this.props.invertedAxis && tableData ) {
            return this.renderTableInverted(tableData, hasGraph);
        }
        else {
            if ( tableData.length > 0 ) {
                return this.renderTableNormal(tableData, hasGraph);
            }
        }

        return null;
    }

    renderTableInverted(tableData, hasGraph) {
        return (
            <View>
                <FlatList horizontal={false}
                    style={{height: (hasGraph ? this.props.height - 200 : this.props.height) - 60}}
                    data={
                        Object.keys(tableData).map((tableKey, itemIndex) => {
                            return [
                                tableKey,
                                tableData[tableKey] instanceof Object ? null : tableData[tableKey]
                            ];
                        })
                    }
                    keyExtractor={(item, index) =>  `table-${index}`}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                        return (
                            <InternalRow data={item}/>
                        )
                    }}
                />
            </View>
        )
    }

    renderTableNormal(tableData, hasGraph) {
        let tableHeaders = Object.keys(tableData[0]);

        return (
            <View>
                <Row data={
                    tableHeaders.map((tableHeader) => {
                        return (
                            <Text style={{fontWeight: 'bold'}}>{tableHeader}</Text>
                        );
                    })
                }/>

                <FlatList horizontal={false}
                    style={{height: (hasGraph ? this.props.height - 200 : this.props.height) - 60}}
                    data={
                        tableData.map((tableItem, itemIndex) => {
                            return Object.values(tableItem).map((tableColData, colDataIndex) => {
                                    return tableColData;
                            })
                        })
                    }
                    keyExtractor={(item, index) =>  `table-${index}`}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => {
                        return (
                            <InternalRow data={item}/>
                        )
                    }}
                />
        </View>
        )
    }

    render() {
        return (
            <View style={{height: this.props.height}}>
                {this.props.data.graph ? this.renderGraph(this.props.data.graph) : null}

                {this.props.data.graph ?
                    (this.props.data.table ? this.renderTable(this.props.data.table, true) : null) :
                    (this.props.data ? this.renderTable(this.props.data, false) : null)
                }
            </View>
        )
    }
}
