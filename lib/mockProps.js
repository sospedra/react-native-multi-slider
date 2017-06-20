'use strict';

var React = require('react');
var ReactNative = require('react-native');
var PropTypes = React.PropTypes;
var View = ReactNative.View;


var BasicMarker = React.createClass({
  displayName: 'BasicMarker',


  propTypes: {
    pressed: PropTypes.bool,
    pressedMarkerStyle: View.propTypes.style,
    markerStyle: View.propTypes.style
  },

  render: function render() {
    return React.createElement(View, {
      style: [this.props.markerStyle, this.props.pressed && this.props.pressedMarkerStyle]
    });
  }
});

var mockProps = {
  values: [0],
  onValuesChangeStart: function onValuesChangeStart() {},
  onValuesChange: function onValuesChange(values) {},
  onValuesChangeFinish: function onValuesChangeFinish(values) {},
  step: 1,
  min: 0,
  max: 10,
  selectedStyle: {
    backgroundColor: 'blue'
  },
  unselectedStyle: {
    backgroundColor: 'grey'
  },
  containerStyle: {
    height: 30
  },
  trackStyle: {
    height: 7,
    borderRadius: 3.5
  },
  touchDimensions: {
    height: 30,
    width: 30,
    borderRadius: 15,
    slipDisplacement: 30
  },
  markerStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#E8E8E8',
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  customMarker: BasicMarker,
  pressedMarkerStyle: {
    backgroundColor: '#D3D3D3'
  },
  sliderLength: 280
};

module.exports = mockProps;