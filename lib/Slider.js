'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactNative = require('react-native');
var PropTypes = React.PropTypes;
var StyleSheet = ReactNative.StyleSheet,
    PanResponder = ReactNative.PanResponder,
    View = ReactNative.View,
    TouchableHighlight = ReactNative.TouchableHighlight;


var converter = require('./converter.js');
var mockProps = require('./mockProps.js');

var sliderProps = {
  values: PropTypes.arrayOf(PropTypes.number),

  onValuesChangeStart: PropTypes.func,
  onValuesChange: PropTypes.func,
  onValuesChangeFinish: PropTypes.func,

  sliderLength: PropTypes.number,
  sliderOrientation: PropTypes.string,
  touchDimensions: PropTypes.object,

  customMarker: PropTypes.func,

  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,

  optionsArray: PropTypes.array,

  containerStyle: View.propTypes.style,
  trackStyle: View.propTypes.style,
  selectedStyle: View.propTypes.style,
  unselectedStyle: View.propTypes.style,
  markerStyle: View.propTypes.style,
  pressedMarkerStyle: View.propTypes.style
};

var Slider = React.createClass({
  displayName: 'Slider',


  propTypes: sliderProps,

  getDefaultProps: function getDefaultProps() {
    return mockProps;
  },

  getInitialState: function getInitialState() {
    var _this = this;

    this.optionsArray = this.props.optionsArray || converter.createArray(this.props.min, this.props.max, this.props.step);
    this.stepLength = this.props.sliderLength / this.optionsArray.length;

    var initialValues = this.props.values.map(function (value) {
      return converter.valueToPosition(value, _this.optionsArray, _this.props.sliderLength);
    });

    return {
      pressedOne: true,
      valueOne: this.props.values[0],
      valueTwo: this.props.values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1]
    };
  },
  componentWillMount: function componentWillMount() {
    var customPanResponder = function customPanResponder(start, move, end) {
      return PanResponder.create({
        onStartShouldSetPanResponder: function onStartShouldSetPanResponder(evt, gestureState) {
          return true;
        },
        onStartShouldSetPanResponderCapture: function onStartShouldSetPanResponderCapture(evt, gestureState) {
          return true;
        },
        onMoveShouldSetPanResponder: function onMoveShouldSetPanResponder(evt, gestureState) {
          return true;
        },
        onMoveShouldSetPanResponderCapture: function onMoveShouldSetPanResponderCapture(evt, gestureState) {
          return true;
        },
        onPanResponderGrant: function onPanResponderGrant(evt, gestureState) {
          return start();
        },
        onPanResponderMove: function onPanResponderMove(evt, gestureState) {
          return move(gestureState);
        },
        onPanResponderTerminationRequest: function onPanResponderTerminationRequest(evt, gestureState) {
          return false;
        },
        onPanResponderRelease: function onPanResponderRelease(evt, gestureState) {
          return end(gestureState);
        },
        onPanResponderTerminate: function onPanResponderTerminate(evt, gestureState) {
          return end(gestureState);
        },
        onShouldBlockNativeResponder: function onShouldBlockNativeResponder(evt, gestureState) {
          return true;
        }
      });
    };

    this._panResponderOne = customPanResponder(this.startOne, this.moveOne, this.endOne);
    this._panResponderTwo = customPanResponder(this.startTwo, this.moveTwo, this.endTwo);
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    var values = this.props.values;

    if (nextProps.values.join() !== values.join()) {
      this.set(nextProps);
    }
  },
  set: function set(config) {
    var _this2 = this;

    var _ref = config || this.props,
        max = _ref.max,
        min = _ref.min,
        optionsArray = _ref.optionsArray,
        step = _ref.step,
        values = _ref.values;

    this.optionsArray = optionsArray || converter.createArray(min, max, step);
    this.stepLength = this.props.sliderLength / this.optionsArray.length;

    var initialValues = values.map(function (value) {
      return converter.valueToPosition(value, _this2.optionsArray, _this2.props.sliderLength);
    });

    this.setState({
      pressedOne: true,
      valueOne: values[0],
      valueTwo: values[1],
      pastOne: initialValues[0],
      pastTwo: initialValues[1],
      positionOne: initialValues[0],
      positionTwo: initialValues[1]
    });
  },
  startOne: function startOne() {
    this.props.onValuesChangeStart();
    this.setState({
      onePressed: !this.state.onePressed
    });
  },
  startTwo: function startTwo() {
    this.props.onValuesChangeStart();
    this.setState({
      twoPressed: !this.state.twoPressed
    });
  },
  moveOne: function moveOne(gestureState) {
    var unconfined = gestureState.dx + this.state.pastOne;
    var bottom = 0;
    var trueTop = this.state.positionTwo - this.stepLength;
    var top = trueTop === 0 ? 0 : trueTop || this.props.sliderLength;
    var confined = unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    var value = converter.positionToValue(this.state.positionOne, this.optionsArray, this.props.sliderLength);

    var slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      this.setState({
        positionOne: confined
      });
    }
    if (value !== this.state.valueOne) {
      this.setState({
        valueOne: value
      }, function () {
        var change = [this.state.valueOne];
        if (this.state.valueTwo) {
          change.push(this.state.valueTwo);
        }
        this.props.onValuesChange(change);
      });
    }
  },
  moveTwo: function moveTwo(gestureState) {
    var unconfined = gestureState.dx + this.state.pastTwo;
    var bottom = this.state.positionOne + this.stepLength;
    var top = this.props.sliderLength;
    var confined = unconfined < bottom ? bottom : unconfined > top ? top : unconfined;
    var value = converter.positionToValue(this.state.positionTwo, this.optionsArray, this.props.sliderLength);
    var slipDisplacement = this.props.touchDimensions.slipDisplacement;

    if (Math.abs(gestureState.dy) < slipDisplacement || !slipDisplacement) {
      this.setState({
        positionTwo: confined
      });
    }
    if (value !== this.state.valueTwo) {
      this.setState({
        valueTwo: value
      }, function () {
        this.props.onValuesChange([this.state.valueOne, this.state.valueTwo]);
      });
    }
  },
  endOne: function endOne(gestureState) {
    this.setState({
      pastOne: this.state.positionOne,
      onePressed: !this.state.onePressed
    }, function () {
      var change = [this.state.valueOne];
      if (this.state.valueTwo) {
        change.push(this.state.valueTwo);
      }
      this.props.onValuesChangeFinish(change);
    });
  },
  endTwo: function endTwo(gestureState) {
    this.setState({
      twoPressed: !this.state.twoPressed,
      pastTwo: this.state.positionTwo
    }, function () {
      this.props.onValuesChangeFinish([this.state.valueOne, this.state.valueTwo]);
    });
  },
  render: function render() {
    var _this3 = this;

    var _state = this.state,
        positionOne = _state.positionOne,
        positionTwo = _state.positionTwo;
    var _props = this.props,
        selectedStyle = _props.selectedStyle,
        unselectedStyle = _props.unselectedStyle,
        sliderLength = _props.sliderLength;

    var twoMarkers = positionTwo;

    var fixedPositionOne = Math.floor(positionOne / this.stepLength) * this.stepLength;
    var fixedPositionTwo = Math.floor(positionTwo / this.stepLength) * this.stepLength;

    var trackOneLength = fixedPositionOne;
    var trackOneStyle = twoMarkers ? unselectedStyle : selectedStyle;
    var trackThreeLength = twoMarkers ? sliderLength - fixedPositionTwo : 0;
    var trackThreeStyle = unselectedStyle;
    var trackTwoLength = sliderLength - trackOneLength - trackThreeLength;
    var trackTwoStyle = twoMarkers ? selectedStyle : unselectedStyle;
    var Marker = this.props.customMarker;
    var _props$touchDimension = this.props.touchDimensions,
        top = _props$touchDimension.top,
        slipDisplacement = _props$touchDimension.slipDisplacement,
        height = _props$touchDimension.height,
        width = _props$touchDimension.width,
        borderRadius = _props$touchDimension.borderRadius;

    var touchStyle = {
      top: top || -10,
      height: height,
      width: width,
      borderRadius: borderRadius || 0
    };

    return React.createElement(
      View,
      { style: [styles.container, this.props.containerStyle] },
      React.createElement(
        View,
        { style: [styles.fullTrack, { width: sliderLength }] },
        React.createElement(View, { style: [this.props.trackStyle, styles.track, trackOneStyle, { width: trackOneLength }] }),
        React.createElement(View, { style: [this.props.trackStyle, styles.track, trackTwoStyle, { width: trackTwoLength }] }),
        twoMarkers && React.createElement(View, { style: [this.props.trackStyle, styles.track, trackThreeStyle, { width: trackThreeLength }] }),
        React.createElement(
          View,
          _extends({
            style: [styles.touch, touchStyle, { left: -(trackTwoLength + trackThreeLength + width / 2) }],
            ref: function ref(component) {
              return _this3._markerOne = component;
            }
          }, this._panResponderOne.panHandlers),
          React.createElement(Marker, {
            pressed: this.state.onePressed,
            value: this.state.valueOne,
            markerStyle: this.props.markerStyle,
            pressedMarkerStyle: this.props.pressedMarkerStyle
          })
        ),
        twoMarkers && positionOne !== this.props.sliderLength && React.createElement(
          View,
          _extends({
            style: [styles.touch, touchStyle, { left: -(trackThreeLength + width * 1.5) }],
            ref: function ref(component) {
              return _this3._markerTwo = component;
            }
          }, this._panResponderTwo.panHandlers),
          React.createElement(Marker, {
            pressed: this.state.twoPressed,
            value: this.state.valueTwo,
            markerStyle: this.props.markerStyle,
            pressedMarkerStyle: this.props.pressedMarkerStyle
          })
        )
      )
    );
  }
});

module.exports = Slider;

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  fullTrack: {
    flexDirection: 'row'
  },
  track: {
    justifyContent: 'center'
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  }
});