import React, {Component} from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';
import {listReportsAction, getReportDataAction} from '../Utils/Redux/Actions/report';

import ReportTabletView from './ReportScreenComponents/ReportTabletView';

class ReportScreen extends Component {
    static navigationOptions = {
        drawerLabel: () => {
            return null;
        },
        drawerIcon: ({tintColor}) => (
            <Icon name="list-alt" type="font-awesome" size={25}/>
        )
    };

    componentDidMount() {
        this.props.listReportsAction();
    }

    renderReportTypes() {
        return this.props.isTablet ? (
            <ReportTabletView/>
        ) : null;
    }

    renderLoading() {
        return (
            this.props.reportError || this.props.reportLoaded ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Opa... Parece que tivemos um erro ao carregar os tipos de relatórios</Text>
                </View>
            ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size={40}/>
                    <Text>Carregando os relatórios disponíveis...</Text>
                </View>
            )
        )
    }

    render() {
        return (
            <View style={this.props.isTablet ? {width: this.props.width - 70} : { flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {
                    this.props.reportTypes ?
                        this.renderReportTypes() :
                        this.renderLoading()
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userReducer.user,
        reportTypes: state.report.types,
        reportLoaded: state.report.loaded,
        reportError: state.report.error,
        isTablet: state.windowReducer.isTablet,
        width: state.windowReducer.window.width
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        listReportsAction: () => dispatch(listReportsAction())
    }
}

export {ReportScreen};
export default connect(mapStateToProps, mapDispatchToProps)(ReportScreen);
