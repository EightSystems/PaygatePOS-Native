import React, {PureComponent} from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Icon, Card, ListItem } from 'react-native-elements';

import { connect } from 'react-redux';

class ReportTypesList extends PureComponent {
    renderTypeList(typeObject, sectionId, reportType) {
        return Object.keys(typeObject).map((reportName) => {
            return (
                <ListItem
                    key={`${sectionId}-${reportType}-${reportName}`}
                    title={typeObject[reportName].title}
                    bottomDivider={true}
                    chevron={true}
                    containerStyle={{
                        minHeight: 30,
                        marginTop: 5
                    }}
                    onPress={() => {
                        if ( this.props.onItemPress ) {
                            this.props.onItemPress(reportName, sectionId, reportType);
                        }
                    }}
                />
            );
        });
    }

    render() {
        let reportTypes = Object.keys(this.props.reportTypes);

        return (
            <View style={this.props.containerStyle}>
                {
                    reportTypes.map((sectionId) => {
                        return (
                            <Card style={this.props.cardStyle} key={sectionId} title={
                                (
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Icon name={this.props.reportTypes[sectionId].icon} type="font-awesome"/>
                                        <Text style={{fontWeight: 'bold', marginLeft: 5}}>{this.props.reportTypes[sectionId].title}</Text>
                                    </View>
                                )
                            }>
                                {
                                    Object.keys(this.props.reportTypes[sectionId].types).map((reportType) => {
                                        return (
                                            <View key={`${sectionId}-${reportType}`}>
                                                <Text style={{fontWeight: 'bold', marginTop: 5}}>{reportType == "multi" ? "Relatórios Multiplos:" : "Relatórios em Tabela:"}</Text>

                                                {this.renderTypeList(this.props.reportTypes[sectionId].types[reportType], sectionId, reportType)}
                                            </View>
                                        )
                                    })
                                }
                            </Card>
                        )
                    })
                }
            </View>
        )
    }
}

export default ReportTypesList;
