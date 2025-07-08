/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./src/block/flexible-breadcrumb/index.js ***!
  \************************************************/
var _window$wp, _window$wp2, _window$wp3, _window$wp4, _window$wp5;
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Safe WordPress imports with fallbacks
var _ref = ((_window$wp = window.wp) === null || _window$wp === void 0 ? void 0 : _window$wp.blocks) || {},
  registerBlockType = _ref.registerBlockType;
var _ref2 = ((_window$wp2 = window.wp) === null || _window$wp2 === void 0 ? void 0 : _window$wp2.i18n) || {},
  __ = _ref2.__;
var _ref3 = ((_window$wp3 = window.wp) === null || _window$wp3 === void 0 ? void 0 : _window$wp3.blockEditor) || {},
  useBlockProps = _ref3.useBlockProps,
  InspectorControls = _ref3.InspectorControls,
  RichText = _ref3.RichText;
var _ref4 = ((_window$wp4 = window.wp) === null || _window$wp4 === void 0 ? void 0 : _window$wp4.components) || {},
  PanelBody = _ref4.PanelBody,
  SelectControl = _ref4.SelectControl,
  TextControl = _ref4.TextControl,
  ColorPicker = _ref4.ColorPicker,
  RangeControl = _ref4.RangeControl,
  ToggleControl = _ref4.ToggleControl,
  Button = _ref4.Button;
var _ref5 = ((_window$wp5 = window.wp) === null || _window$wp5 === void 0 ? void 0 : _window$wp5.element) || {},
  useState = _ref5.useState,
  useEffect = _ref5.useEffect,
  Fragment = _ref5.Fragment;
registerBlockType('flexible-page-navigation/flexible-breadcrumb', {
  title: __('Flexible Breadcrumb', 'flexible-page-navigation'),
  description: __('A flexible breadcrumb block with configurable content types and styling.', 'flexible-page-navigation'),
  category: 'widgets',
  icon: 'arrow-right-alt',
  supports: {
    html: false,
    align: ['wide', 'full']
  },
  attributes: {
    contentType: {
      type: 'string',
      "default": 'page'
    },
    startPageId: {
      type: 'number',
      "default": 0
    },
    startPageText: {
      type: 'string',
      "default": 'Home'
    },
    startPageUrl: {
      type: 'string',
      "default": ''
    },
    showStartLink: {
      type: 'boolean',
      "default": true
    },
    separator: {
      type: 'string',
      "default": '>'
    },
    separatorColor: {
      type: 'string',
      "default": '#666666'
    },
    separatorMargin: {
      type: 'number',
      "default": 8
    },
    textColor: {
      type: 'string',
      "default": '#333333'
    },
    linkColor: {
      type: 'string',
      "default": '#007cba'
    },
    activeColor: {
      type: 'string',
      "default": '#666666'
    },
    fontSize: {
      type: 'number',
      "default": 14
    },
    fontWeight: {
      type: 'string',
      "default": '400'
    },
    padding: {
      type: 'number',
      "default": 10
    },
    backgroundColor: {
      type: 'string',
      "default": 'transparent'
    },
    borderRadius: {
      type: 'number',
      "default": 0
    },
    showCurrentPage: {
      type: 'boolean',
      "default": true
    },
    maxDepth: {
      type: 'number',
      "default": 5
    }
  },
  edit: function Edit(_ref6) {
    var attributes = _ref6.attributes,
      setAttributes = _ref6.setAttributes;
    var blockProps = useBlockProps();
    var _useState = useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      pages = _useState2[0],
      setPages = _useState2[1];

    // Fetch pages for start page selection
    useEffect(function () {
      // Use wp.apiFetch if available, otherwise skip
      if (window.wp && window.wp.apiFetch) {
        window.wp.apiFetch({
          path: '/wp/v2/pages?per_page=100&orderby=title&order=asc'
        }).then(function (response) {
          setPages(response);
        })["catch"](function (error) {
          console.error('Error fetching pages:', error);
        });
      }
    }, []);
    var contentType = attributes.contentType,
      startPageId = attributes.startPageId,
      startPageText = attributes.startPageText,
      startPageUrl = attributes.startPageUrl,
      showStartLink = attributes.showStartLink,
      separator = attributes.separator,
      separatorColor = attributes.separatorColor,
      separatorMargin = attributes.separatorMargin,
      textColor = attributes.textColor,
      linkColor = attributes.linkColor,
      activeColor = attributes.activeColor,
      fontSize = attributes.fontSize,
      fontWeight = attributes.fontWeight,
      padding = attributes.padding,
      backgroundColor = attributes.backgroundColor,
      borderRadius = attributes.borderRadius,
      showCurrentPage = attributes.showCurrentPage,
      maxDepth = attributes.maxDepth;
    var breadcrumbStyle = {
      fontSize: fontSize + 'px',
      fontWeight: fontWeight,
      padding: padding + 'px',
      backgroundColor: backgroundColor,
      borderRadius: borderRadius + 'px',
      color: textColor
    };
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
      title: __('Breadcrumb Settings', 'flexible-page-navigation'),
      initialOpen: true
    }, /*#__PURE__*/React.createElement(TextControl, {
      label: __('Start Page Text', 'flexible-page-navigation'),
      value: startPageText,
      onChange: function onChange(value) {
        return setAttributes({
          startPageText: value
        });
      }
    }), /*#__PURE__*/React.createElement(SelectControl, {
      label: __('Start Page', 'flexible-page-navigation'),
      value: startPageId,
      options: [{
        label: __('Home', 'flexible-page-navigation'),
        value: 0
      }, {
        label: __('Custom URL', 'flexible-page-navigation'),
        value: -1
      }].concat(_toConsumableArray(pages.map(function (page) {
        return {
          label: page.title.rendered,
          value: page.id
        };
      }))),
      onChange: function onChange(value) {
        return setAttributes({
          startPageId: parseInt(value)
        });
      }
    }), startPageId === -1 && /*#__PURE__*/React.createElement(TextControl, {
      label: __('Custom Start URL', 'flexible-page-navigation'),
      value: startPageUrl,
      onChange: function onChange(value) {
        return setAttributes({
          startPageUrl: value
        });
      },
      placeholder: "https://example.com/start",
      help: __('Enter the full URL for your custom start page', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(TextControl, {
      label: __('Separator', 'flexible-page-navigation'),
      value: separator,
      onChange: function onChange(value) {
        return setAttributes({
          separator: value
        });
      }
    }), /*#__PURE__*/React.createElement(RangeControl, {
      label: __('Separator Margin', 'flexible-page-navigation'),
      value: separatorMargin,
      onChange: function onChange(value) {
        return setAttributes({
          separatorMargin: value
        });
      },
      min: 0,
      max: 20
    }), /*#__PURE__*/React.createElement(RangeControl, {
      label: __('Font Size', 'flexible-page-navigation'),
      value: fontSize,
      onChange: function onChange(value) {
        return setAttributes({
          fontSize: value
        });
      },
      min: 10,
      max: 24
    }), /*#__PURE__*/React.createElement(SelectControl, {
      label: __('Font Weight', 'flexible-page-navigation'),
      value: fontWeight,
      options: [{
        label: __('Normal', 'flexible-page-navigation'),
        value: '400'
      }, {
        label: __('Bold', 'flexible-page-navigation'),
        value: '700'
      }, {
        label: __('Light', 'flexible-page-navigation'),
        value: '300'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          fontWeight: value
        });
      }
    }), /*#__PURE__*/React.createElement(RangeControl, {
      label: __('Padding', 'flexible-page-navigation'),
      value: padding,
      onChange: function onChange(value) {
        return setAttributes({
          padding: value
        });
      },
      min: 0,
      max: 30
    }), /*#__PURE__*/React.createElement(RangeControl, {
      label: __('Border Radius', 'flexible-page-navigation'),
      value: borderRadius,
      onChange: function onChange(value) {
        return setAttributes({
          borderRadius: value
        });
      },
      min: 0,
      max: 20
    }), /*#__PURE__*/React.createElement(ToggleControl, {
      label: __('Show Start Link', 'flexible-page-navigation'),
      checked: showStartLink,
      onChange: function onChange(value) {
        return setAttributes({
          showStartLink: value
        });
      }
    }), /*#__PURE__*/React.createElement(ToggleControl, {
      label: __('Show Current Page', 'flexible-page-navigation'),
      checked: showCurrentPage,
      onChange: function onChange(value) {
        return setAttributes({
          showCurrentPage: value
        });
      }
    }), /*#__PURE__*/React.createElement(RangeControl, {
      label: __('Max Depth', 'flexible-page-navigation'),
      value: maxDepth,
      onChange: function onChange(value) {
        return setAttributes({
          maxDepth: value
        });
      },
      min: 1,
      max: 10
    })), /*#__PURE__*/React.createElement(PanelBody, {
      title: __('Colors', 'flexible-page-navigation'),
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: textColor,
      onChange: function onChange(e) {
        return setAttributes({
          textColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, /*#__PURE__*/React.createElement("label", null, __('Link Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: linkColor,
      onChange: function onChange(e) {
        return setAttributes({
          linkColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, /*#__PURE__*/React.createElement("label", null, __('Active Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: activeColor,
      onChange: function onChange(e) {
        return setAttributes({
          activeColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, /*#__PURE__*/React.createElement("label", null, __('Separator Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: separatorColor,
      onChange: function onChange(e) {
        return setAttributes({
          separatorColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '10px'
      }
    }, /*#__PURE__*/React.createElement("label", null, __('Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("input", {
      type: "color",
      value: backgroundColor === 'transparent' ? '#ffffff' : backgroundColor,
      onChange: function onChange(e) {
        return setAttributes({
          backgroundColor: e.target.value
        });
      },
      style: {
        width: '100%',
        height: '40px'
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: breadcrumbStyle
    }, showStartLink && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: linkColor
      }
    }, startPageText), /*#__PURE__*/React.createElement("span", {
      style: {
        color: separatorColor,
        margin: "0 ".concat(separatorMargin, "px")
      }
    }, separator)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: linkColor
      }
    }, __('Parent Page', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("span", {
      style: {
        color: separatorColor,
        margin: "0 ".concat(separatorMargin, "px")
      }
    }, separator), /*#__PURE__*/React.createElement("span", {
      style: {
        color: activeColor
      }
    }, __('Current Page', 'flexible-page-navigation'))));
  },
  save: function Save() {
    return null; // Server-side rendering
  }
});
/******/ })()
;
//# sourceMappingURL=index.js.map