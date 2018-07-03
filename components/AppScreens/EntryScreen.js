import React, {Component} from 'react';
import {Platform} from 'react-native';

import { connect } from 'react-redux'

import EntryScreen from './EntryScreenBase';

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        appLoaded: state.reduxData.rehydrated
    }
}

export default connect(mapStateToProps)(EntryScreen)
