(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(
      require('react'),
      require('react-dom'),
      require('swipe-js-iso'),
      require('object-assign')
    );
  } else {
    root.ReactSwipe = factory(
      root.React,
      root.ReactDOM,
      root.Swipe,
      root.objectAssign
    );
  }
})(this, function (React, ReactDOM, Swipe, objectAssign) {
  var styles = {
    container: {
      overflow: 'hidden',
      visibility: 'hidden',
      position: 'relative',
      width: '100%' // display issues in IE when missing
    },

    wrapper: {
      overflow: 'hidden',
      position: 'relative'
    },

    child: {
      float: 'left',
      width: '100%',
      position: 'relative',
      transitionProperty: 'transform'
    }
  };

  var ReactSwipe = React.createClass({
    // https://github.com/thebird/Swipe#config-options
    propTypes: {
      startSlide      : React.PropTypes.number,
      slideToIndex    : React.PropTypes.number,
      shouldUpdate    : React.PropTypes.func,
      speed           : React.PropTypes.number,
      auto            : React.PropTypes.number,
      continuous      : React.PropTypes.bool,
      disableScroll   : React.PropTypes.bool,
      stopPropagation : React.PropTypes.bool,
      callback        : React.PropTypes.func,
      transitionEnd   : React.PropTypes.func
    },

    componentDidMount: function () {
      this.swipe = Swipe(ReactDOM.findDOMNode(this), objectAssign({}, this.props));
    },

    componentDidUpdate: function () {
      if (this.props.slideToIndex || this.props.slideToIndex === 0) {
        this.swipe.slide(this.props.slideToIndex);
      }
    },

    componentWillUnmount: function () {
      this.swipe.kill();
      delete this.swipe;
    },

    shouldComponentUpdate: function (nextProps) {
      // Update if children have changed 
      if (this.props.children !== nextProps.children) {
        this.swipe = Swipe(React.findDOMNode(this), this.props);
      }
      return (
        // Check if children have changed
        (this.props.slideToIndex !== nextProps.slideToIndex) || this.props.children !== nextProps.children ||
        (typeof this.props.shouldUpdate !== 'undefined') && this.props.shouldUpdate(nextProps)
      );
    },

    render: function() {
      return React.createElement('div', React.__spread({}, {style: styles.container}, this.props),
        React.createElement('div', {style: styles.wrapper},
          React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
              ref: child.props.ref,
              key: child.props.key,
              style: child.props.style ? objectAssign(child.props.style, styles.child) : styles.child
            });
          })
        )
      );
    }
  });

  return ReactSwipe;
});
