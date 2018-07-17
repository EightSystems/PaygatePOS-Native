import React, {PureComponent} from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import {listReportsAction, getReportDataAction} from '../../Utils/Redux/Actions/report';

import ReportTypesList from './ReportTypesList';
import ReportDataView from './ReportDataView';
import Card from '../../GeneralUI/Card';

class ReportTabletView extends PureComponent {
    renderReportData() {
        let invertedAxis = false;
        if ( this.props.reportTypes && this.props.reportTypes[this.props.reportSelected[1]].types ) {
            invertedAxis = this.props.reportTypes[this.props.reportSelected[1]].types[this.props.reportSelected[2]][this.props.reportSelected[0]].invertedAxis;
        }

        return (
            <ReportDataView data={this.props.reportData} invertedAxis={invertedAxis}/>
        );
    }

    render() {
        return (
            <Grid>
                <Col size={25}>
                    <ScrollView>
                        <ReportTypesList reportTypes={this.props.reportTypes} onItemPress={(reportName, sectionId, reportType) => {
                            this.props.getReportDataAction(reportName, sectionId, reportType);
                        }}/>
                    </ScrollView>
                </Col>
                <Col size={75}>
                    <ScrollView>
                        <Card icon={"list-alt"} title={"Dados do relatório"}>
                            {
                                this.props.reportSelected ? (
                                    this.props.reportSelectedLoaded && this.props.reportData ? this.renderReportData() : (
                                        this.props.reportSelectedError || ( this.props.reportSelectedLoaded && ! this.props.reportData ) ? (
                                            <Text>Oops... Parece que tivemos um erro ao carregar esse relatório, tente novamente!</Text>
                                        ) : (
                                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                <ActivityIndicator size={40}/>
                                                <Text>Carregando os dados do relatório...</Text>
                                            </View>
                                        )
                                    )
                                ) : (
                                    <Text>Selecione um relatório ao lado...</Text>
                                )
                            }
                        </Card>
                    </ScrollView>
                </Col>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        reportTypes: state.report.types,
        reportLoaded: state.report.loaded,
        reportError: state.report.error,

        reportSelected: state.report.selected,
        reportData: state.report.data,
        reportSelectedLoaded: state.report.selectedLoaded,
        reportSelectedError: state.report.selectedError,

        isTablet: state.windowReducer.isTablet,
        width: state.windowReducer.window.width
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        listReportsAction: () => dispatch(listReportsAction()),
        getReportDataAction: (reportName, sectionId, reportType) => dispatch(getReportDataAction({reportName, sectionId, reportType})),
    }
}

export {ReportTabletView};
export default connect(mapStateToProps, mapDispatchToProps)(ReportTabletView);
