import React, {PureComponent} from 'react';
import { View, Text, Image } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import HTML from 'react-native-render-html';

export default class ReportDataView extends PureComponent {
    renderGraph(graphData) {
        return null;
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
