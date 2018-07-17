import React, {PureComponent} from 'react';
import { View, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { Grid as GraphGrid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import HTML from 'react-native-render-html';

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

    renderTable(tableData) {
        if ( this.props.invertedAxis && tableData ) {
            return this.renderTableInverted(tableData);
        }
        else {
            if ( tableData.length > 0 ) {
                return this.renderTableNormal(tableData);
            }
        }

        return null;
    }

    renderTableInverted(tableData) {
        return (
            <Grid>
                {
                    Object.keys(tableData).map((tableKey, itemIndex) => {
                        return (
                            <Row key={`table-item-${itemIndex}`}>
                                <Col key={`table-item-${itemIndex}-key`}>
                                    <HTML html={`<b>${tableKey}</b>`}/>
                                </Col>
                                <Col key={`table-item-${itemIndex}-value`}>
                                    <HTML html={tableData[tableKey]}/>
                                </Col>
                            </Row>
                        );
                    })
                }
            </Grid>
        )
    }

    renderTableNormal(tableData) {
        let tableHeaders = Object.keys(tableData[0]);

        return (
            <Grid>
                <Row>
                    {
                        tableHeaders.map((tableHeader) => {
                            return (
                                <Col key={tableHeader}><Text style={{fontWeight: 'bold'}}>{tableHeader}</Text></Col>
                            );
                        })
                    }
                </Row>

                {
                    tableData.map((tableItem, itemIndex) => {
                        return (
                            <Row key={`table-item-${itemIndex}`} style={{marginBottom: 1, borderBottomWidth: 1, borderBottomColor: 'black'}}>
                                {
                                    Object.values(tableItem).map((tableColData, colDataIndex) => {
                                        return (
                                            <Col key={`table-item-${itemIndex}-${colDataIndex}`}><HTML html={tableColData}/></Col>
                                        );
                                    })
                                }
                            </Row>
                        )
                    })
                }
            </Grid>
        )
    }

    render() {
        return (
            <View>
                {this.props.data.graph ? this.renderGraph(this.props.data.graph) : null}

                {this.props.data.graph ?
                    (this.props.data.table ? this.renderTable(this.props.data.table) : null) :
                    (this.props.data ? this.renderTable(this.props.data) : null)
                }
            </View>
        )
    }
}
