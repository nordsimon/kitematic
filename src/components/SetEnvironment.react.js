import React from 'react/addons';
import Router from 'react-router';
import Radial from './Radial.react.js';
import RetinaImage from 'react-retina-image';
import Header from './Header.react';
import metrics from '../utils/MetricsUtil';
import setupStore from '../stores/SetupStore';
import setupActions from '../actions/SetupActions';
import shell from 'shell';

var Setup = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function () {
    return setupStore.getState();
  },

  componentDidMount: function () {
    setupStore.listen(this.update);
  },

  componentDidUnmount: function () {
    setupStore.unlisten(this.update);
  },

  update: function () {
    this.setState(setupStore.getState());
  },

  handleErrorRetry: function () {
    setupActions.retry(false);
  },

  handleErrorRemoveRetry: function () {
    console.log('Deleting VM and trying again.' );
    setupActions.retry(true);
  },

  setEnv: function(e) {
    var env = this.refs.environment.getDOMNode().value
    setupActions.setEnvironment(env);
  },

  render: function () {
    return (
      <div className="setup">
        <Header hideLogin={true}/>
        <div className="setup-content">
          <div className="image">
            hello
          </div>
          <div className="desc">
            <div className="content">
              <h1>Select environment</h1>
              <select ref="environment" onChange={this.setEnv}>
                <option value="production">-------------</option>
                <option value="default">Default</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Setup;
