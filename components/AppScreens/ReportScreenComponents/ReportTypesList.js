import React, {PureComponent} from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Icon, ListItem } from 'react-native-elements';

import Card from '../../GeneralUI/Card';

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
                            <Card style={this.props.cardStyle} key={sectionId}
                                title={this.props.reportTypes[sectionId].title}
                                icon={this.props.reportTypes[sectionId].icon}
                            >
                                {
                                    Object.keys(this.props.reportTypes[sectionId].types).map((reportType) => {
                                        return (
                                            <View key={`${sectionId}-${reportType}`}>
                                                <Text style={{fontWeight: 'bold', marginTop: 10}}>{reportType == "multi" ? "Relatórios Duplos:" : "Relatórios em Tabela:"}</Text>

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
