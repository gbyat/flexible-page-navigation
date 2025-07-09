(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@wordpress/api-fetch"), require("@wordpress/block-editor"), require("@wordpress/blocks"), require("@wordpress/components"), require("@wordpress/data"), require("@wordpress/element"), require("@wordpress/i18n"));
	else if(typeof define === 'function' && define.amd)
		define(["@wordpress/api-fetch", "@wordpress/block-editor", "@wordpress/blocks", "@wordpress/components", "@wordpress/data", "@wordpress/element", "@wordpress/i18n"], factory);
	else if(typeof exports === 'object')
		exports["FlexiblePageNavigation"] = factory(require("@wordpress/api-fetch"), require("@wordpress/block-editor"), require("@wordpress/blocks"), require("@wordpress/components"), require("@wordpress/data"), require("@wordpress/element"), require("@wordpress/i18n"));
	else
		root["FlexiblePageNavigation"] = factory(root["wp"]["apiFetch"], root["wp"]["blockEditor"], root["wp"]["blocks"], root["wp"]["components"], root["wp"]["data"], root["wp"]["element"], root["wp"]["i18n"]);
})(this, (__WEBPACK_EXTERNAL_MODULE__wordpress_api_fetch__, __WEBPACK_EXTERNAL_MODULE__wordpress_block_editor__, __WEBPACK_EXTERNAL_MODULE__wordpress_blocks__, __WEBPACK_EXTERNAL_MODULE__wordpress_components__, __WEBPACK_EXTERNAL_MODULE__wordpress_data__, __WEBPACK_EXTERNAL_MODULE__wordpress_element__, __WEBPACK_EXTERNAL_MODULE__wordpress_i18n__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/api-fetch":
/*!*********************************************************************************************************************************************!*\
  !*** external {"root":["wp","apiFetch"],"commonjs":"@wordpress/api-fetch","commonjs2":"@wordpress/api-fetch","amd":"@wordpress/api-fetch"} ***!
  \*********************************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_api_fetch__;

/***/ }),

/***/ "@wordpress/block-editor":
/*!*********************************************************************************************************************************************************!*\
  !*** external {"root":["wp","blockEditor"],"commonjs":"@wordpress/block-editor","commonjs2":"@wordpress/block-editor","amd":"@wordpress/block-editor"} ***!
  \*********************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_block_editor__;

/***/ }),

/***/ "@wordpress/blocks":
/*!**********************************************************************************************************************************!*\
  !*** external {"root":["wp","blocks"],"commonjs":"@wordpress/blocks","commonjs2":"@wordpress/blocks","amd":"@wordpress/blocks"} ***!
  \**********************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_blocks__;

/***/ }),

/***/ "@wordpress/components":
/*!**************************************************************************************************************************************************!*\
  !*** external {"root":["wp","components"],"commonjs":"@wordpress/components","commonjs2":"@wordpress/components","amd":"@wordpress/components"} ***!
  \**************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_components__;

/***/ }),

/***/ "@wordpress/data":
/*!**************************************************************************************************************************!*\
  !*** external {"root":["wp","data"],"commonjs":"@wordpress/data","commonjs2":"@wordpress/data","amd":"@wordpress/data"} ***!
  \**************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_data__;

/***/ }),

/***/ "@wordpress/element":
/*!**************************************************************************************************************************************!*\
  !*** external {"root":["wp","element"],"commonjs":"@wordpress/element","commonjs2":"@wordpress/element","amd":"@wordpress/element"} ***!
  \**************************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_element__;

/***/ }),

/***/ "@wordpress/i18n":
/*!**************************************************************************************************************************!*\
  !*** external {"root":["wp","i18n"],"commonjs":"@wordpress/i18n","commonjs2":"@wordpress/i18n","amd":"@wordpress/i18n"} ***!
  \**************************************************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_i18n__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************!*\
  !*** ./src/block/flexible-breadcrumb/index.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
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







(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('flexible-page-navigation/flexible-breadcrumb', {
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
  edit: function Edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
    var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      pages = _useState2[0],
      setPages = _useState2[1];

    // Fetch pages for start page selection
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default()({
        path: '/wp/v2/pages?per_page=100&orderby=title&order=asc'
      }).then(function (response) {
        setPages(response);
      })["catch"](function (error) {
        console.error('Error fetching pages:', error);
      });
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

    // Hole die Theme/Standardfarben aus dem Editor-Kontext
    var themeColors = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(function (select) {
      return select('core/block-editor').getSettings().colors;
    }, []);
    return /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Breadcrumb Settings', 'flexible-page-navigation'),
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start Page Text', 'flexible-page-navigation'),
      value: startPageText,
      onChange: function onChange(value) {
        return setAttributes({
          startPageText: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start Page', 'flexible-page-navigation'),
      value: startPageId,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Home', 'flexible-page-navigation'),
        value: 0
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom URL', 'flexible-page-navigation'),
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
    }), startPageId === -1 && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Start URL', 'flexible-page-navigation'),
      value: startPageUrl,
      onChange: function onChange(value) {
        return setAttributes({
          startPageUrl: value
        });
      },
      placeholder: "https://example.com/start",
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the full URL for your custom start page', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Separator', 'flexible-page-navigation'),
      value: separator,
      onChange: function onChange(value) {
        return setAttributes({
          separator: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Separator Margin', 'flexible-page-navigation'),
      value: separatorMargin,
      onChange: function onChange(value) {
        return setAttributes({
          separatorMargin: value
        });
      },
      min: 0,
      max: 20
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Size', 'flexible-page-navigation'),
      value: fontSize,
      onChange: function onChange(value) {
        return setAttributes({
          fontSize: value
        });
      },
      min: 10,
      max: 24
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Weight', 'flexible-page-navigation'),
      value: fontWeight,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Normal', 'flexible-page-navigation'),
        value: '400'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bold', 'flexible-page-navigation'),
        value: '700'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Light', 'flexible-page-navigation'),
        value: '300'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          fontWeight: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Padding', 'flexible-page-navigation'),
      value: padding,
      onChange: function onChange(value) {
        return setAttributes({
          padding: value
        });
      },
      min: 0,
      max: 30
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border Radius', 'flexible-page-navigation'),
      value: borderRadius,
      onChange: function onChange(value) {
        return setAttributes({
          borderRadius: value
        });
      },
      min: 0,
      max: 20
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Start Link', 'flexible-page-navigation'),
      checked: showStartLink,
      onChange: function onChange(value) {
        return setAttributes({
          showStartLink: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Current Page', 'flexible-page-navigation'),
      checked: showCurrentPage,
      onChange: function onChange(value) {
        return setAttributes({
          showCurrentPage: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Max Depth', 'flexible-page-navigation'),
      value: maxDepth,
      onChange: function onChange(value) {
        return setAttributes({
          maxDepth: value
        });
      },
      min: 1,
      max: 10
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Farben', 'flexible-page-navigation'),
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        marginBottom: 4
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Textfarbe', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
      renderToggle: function renderToggle(_ref2) {
        var isOpen = _ref2.isOpen,
          onToggle = _ref2.onToggle;
        return /*#__PURE__*/React.createElement("button", {
          onClick: onToggle,
          "aria-expanded": isOpen,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Textfarbe wählen', 'flexible-page-navigation'),
          style: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ccc',
            background: textColor || '#fff',
            display: 'inline-block',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none'
          }
        });
      },
      renderContent: function renderContent() {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPalette, {
          value: textColor,
          onChange: function onChange(color) {
            return setAttributes({
              textColor: color
            });
          },
          colors: themeColors,
          enableAlpha: false,
          clearable: true
        }));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        marginBottom: 4
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Linkfarbe', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
      renderToggle: function renderToggle(_ref3) {
        var isOpen = _ref3.isOpen,
          onToggle = _ref3.onToggle;
        return /*#__PURE__*/React.createElement("button", {
          onClick: onToggle,
          "aria-expanded": isOpen,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Linkfarbe wählen', 'flexible-page-navigation'),
          style: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ccc',
            background: linkColor || '#fff',
            display: 'inline-block',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none'
          }
        });
      },
      renderContent: function renderContent() {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPalette, {
          value: linkColor,
          onChange: function onChange(color) {
            return setAttributes({
              linkColor: color
            });
          },
          colors: themeColors,
          enableAlpha: false,
          clearable: true
        }));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        marginBottom: 4
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Aktive Farbe', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
      renderToggle: function renderToggle(_ref4) {
        var isOpen = _ref4.isOpen,
          onToggle = _ref4.onToggle;
        return /*#__PURE__*/React.createElement("button", {
          onClick: onToggle,
          "aria-expanded": isOpen,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Aktive Farbe wählen', 'flexible-page-navigation'),
          style: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ccc',
            background: activeColor || '#fff',
            display: 'inline-block',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none'
          }
        });
      },
      renderContent: function renderContent() {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPalette, {
          value: activeColor,
          onChange: function onChange(color) {
            return setAttributes({
              activeColor: color
            });
          },
          colors: themeColors,
          enableAlpha: false,
          clearable: true
        }));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        marginBottom: 4
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trennzeichen-Farbe', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
      renderToggle: function renderToggle(_ref5) {
        var isOpen = _ref5.isOpen,
          onToggle = _ref5.onToggle;
        return /*#__PURE__*/React.createElement("button", {
          onClick: onToggle,
          "aria-expanded": isOpen,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Trennzeichen-Farbe wählen', 'flexible-page-navigation'),
          style: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ccc',
            background: separatorColor || '#fff',
            display: 'inline-block',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none'
          }
        });
      },
      renderContent: function renderContent() {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPalette, {
          value: separatorColor,
          onChange: function onChange(color) {
            return setAttributes({
              separatorColor: color
            });
          },
          colors: themeColors,
          enableAlpha: false,
          clearable: true
        }));
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '1em'
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        display: 'block',
        marginBottom: 4
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hintergrundfarbe', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
      renderToggle: function renderToggle(_ref6) {
        var isOpen = _ref6.isOpen,
          onToggle = _ref6.onToggle;
        return /*#__PURE__*/React.createElement("button", {
          onClick: onToggle,
          "aria-expanded": isOpen,
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hintergrundfarbe wählen', 'flexible-page-navigation'),
          style: {
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid #ccc',
            background: backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : '#fff',
            display: 'inline-block',
            cursor: 'pointer',
            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none'
          }
        });
      },
      renderContent: function renderContent() {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 8
          }
        }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ColorPalette, {
          value: backgroundColor === 'transparent' ? '' : backgroundColor,
          onChange: function onChange(color) {
            return setAttributes({
              backgroundColor: color || 'transparent'
            });
          },
          colors: themeColors,
          enableAlpha: false,
          clearable: true
        }));
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: breadcrumbStyle
    }, showStartLink && /*#__PURE__*/React.createElement(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, /*#__PURE__*/React.createElement("span", {
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
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Parent Page', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("span", {
      style: {
        color: separatorColor,
        margin: "0 ".concat(separatorMargin, "px")
      }
    }, separator), /*#__PURE__*/React.createElement("span", {
      style: {
        color: activeColor
      }
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Current Page', 'flexible-page-navigation'))));
  },
  save: function Save() {
    return null; // Server-side rendering
  }
});
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map