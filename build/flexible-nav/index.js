/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/api-fetch":
/*!*********************************************************************************************************************************************!*\
  !*** external {"root":["wp","apiFetch"],"commonjs":"@wordpress/api-fetch","commonjs2":"@wordpress/api-fetch","amd":"@wordpress/api-fetch"} ***!
  \*********************************************************************************************************************************************/
/***/ ((module) => {

module.exports = undefined;

/***/ }),

/***/ "@wordpress/block-editor":
/*!*********************************************************************************************************************************************************!*\
  !*** external {"root":["wp","blockEditor"],"commonjs":"@wordpress/block-editor","commonjs2":"@wordpress/block-editor","amd":"@wordpress/block-editor"} ***!
  \*********************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = undefined;

/***/ }),

/***/ "@wordpress/blocks":
/*!**********************************************************************************************************************************!*\
  !*** external {"root":["wp","blocks"],"commonjs":"@wordpress/blocks","commonjs2":"@wordpress/blocks","amd":"@wordpress/blocks"} ***!
  \**********************************************************************************************************************************/
/***/ ((module) => {

module.exports = undefined;

/***/ }),

/***/ "@wordpress/components":
/*!**************************************************************************************************************************************************!*\
  !*** external {"root":["wp","components"],"commonjs":"@wordpress/components","commonjs2":"@wordpress/components","amd":"@wordpress/components"} ***!
  \**************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = undefined;

/***/ }),

/***/ "@wordpress/element":
/*!**************************************************************************************************************************************!*\
  !*** external {"root":["wp","element"],"commonjs":"@wordpress/element","commonjs2":"@wordpress/element","amd":"@wordpress/element"} ***!
  \**************************************************************************************************************************************/
/***/ ((module) => {

module.exports = undefined;

/***/ }),

/***/ "@wordpress/i18n":
/*!**************************************************************************************************************************!*\
  !*** external {"root":["wp","i18n"],"commonjs":"@wordpress/i18n","commonjs2":"@wordpress/i18n","amd":"@wordpress/i18n"} ***!
  \**************************************************************************************************************************/
/***/ ((module) => {

module.exports = undefined;

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
/*!*****************************************!*\
  !*** ./src/block/flexible-nav/index.js ***!
  \*****************************************/
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






(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)('flexible-page-navigation/flexible-nav', {
  edit: function Edit(_ref) {
    var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
    var contentType = attributes.contentType,
      sortBy = attributes.sortBy,
      sortOrder = attributes.sortOrder,
      depth = attributes.depth,
      childSelection = attributes.childSelection,
      menuDisplayMode = attributes.menuDisplayMode,
      parentPageId = attributes.parentPageId,
      accordionEnabled = attributes.accordionEnabled,
      columnLayout = attributes.columnLayout,
      showActiveIndicator = attributes.showActiveIndicator,
      separator = attributes.separator,
      hoverEffect = attributes.hoverEffect,
      backgroundColor = attributes.backgroundColor,
      textColor = attributes.textColor,
      activeBackgroundColor = attributes.activeBackgroundColor,
      activeTextColor = attributes.activeTextColor,
      activePadding = attributes.activePadding,
      childActiveBackgroundColor = attributes.childActiveBackgroundColor,
      childActiveTextColor = attributes.childActiveTextColor,
      separatorEnabled = attributes.separatorEnabled,
      separatorWidth = attributes.separatorWidth,
      separatorColor = attributes.separatorColor,
      separatorPadding = attributes.separatorPadding,
      hoverBackgroundColor = attributes.hoverBackgroundColor,
      mainItemFontWeight = attributes.mainItemFontWeight,
      mainItemFontSize = attributes.mainItemFontSize,
      mainItemTextColor = attributes.mainItemTextColor;
    var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      postTypes = _useState2[0],
      setPostTypes = _useState2[1];
    var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(true),
      _useState4 = _slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

    // Fetch available post types
    (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {
      var builtInTypes = [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pages', 'flexible-page-navigation'),
        value: 'page'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posts', 'flexible-page-navigation'),
        value: 'post'
      }];

      // Try to fetch custom post types
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default()({
        path: '/wp/v2/types'
      }).then(function (types) {
        var customTypes = Object.keys(types).filter(function (type) {
          return !['page', 'post'].includes(type);
        }).map(function (type) {
          return {
            label: types[type].name,
            value: type
          };
        });

        // Check if each type is queryable
        var checkTypePromises = customTypes.map(function (type) {
          return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default()({
            path: "/wp/v2/".concat(type.value, "?per_page=1")
          }).then(function () {
            return type;
          })["catch"](function () {
            return null;
          });
        });
        Promise.all(checkTypePromises).then(function (results) {
          var validTypes = results.filter(function (result) {
            return result !== null;
          });
          console.log('Discovered custom types:', validTypes);
          var allTypes = [].concat(builtInTypes, _toConsumableArray(validTypes));
          console.log('Final all types:', allTypes);
          setPostTypes(allTypes);
          setLoading(false);
        })["catch"](function () {
          console.log('Using fallback types');
          setPostTypes(builtInTypes);
          setLoading(false);
        });
      })["catch"](function () {
        // Fallback to default types if API fails
        setPostTypes([{
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pages', 'flexible-page-navigation'),
          value: 'page'
        }, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Posts', 'flexible-page-navigation'),
          value: 'post'
        }]);
        setLoading(false);
      });
    }, []);
    var blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
      className: 'fpn-navigation-editor',
      style: {
        backgroundColor: backgroundColor,
        color: textColor,
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }
    });
    var sortOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Menu Order', 'flexible-page-navigation'),
      value: 'menu_order'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'flexible-page-navigation'),
      value: 'title'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Date', 'flexible-page-navigation'),
      value: 'date'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('ID', 'flexible-page-navigation'),
      value: 'ID'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Author', 'flexible-page-navigation'),
      value: 'author'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Modified Date', 'flexible-page-navigation'),
      value: 'modified'
    }];
    var orderOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Ascending', 'flexible-page-navigation'),
      value: 'ASC'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Descending', 'flexible-page-navigation'),
      value: 'DESC'
    }];
    var childSelectionOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Current Page Children', 'flexible-page-navigation'),
      value: 'current'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Items', 'flexible-page-navigation'),
      value: 'all'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom Parent', 'flexible-page-navigation'),
      value: 'custom'
    }];
    var columnLayoutOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Single Column', 'flexible-page-navigation'),
      value: 'single'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Two Columns', 'flexible-page-navigation'),
      value: 'two-columns'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Three Columns', 'flexible-page-navigation'),
      value: 'three-columns'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Four Columns', 'flexible-page-navigation'),
      value: 'four-columns'
    }];
    var hoverEffectOptions = [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('None', 'flexible-page-navigation'),
      value: 'none'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Underline', 'flexible-page-navigation'),
      value: 'underline'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background', 'flexible-page-navigation'),
      value: 'background'
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Scale', 'flexible-page-navigation'),
      value: 'scale'
    }];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Content Settings', 'flexible-page-navigation'),
      initialOpen: true
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Content Type', 'flexible-page-navigation'),
      value: contentType,
      options: postTypes,
      onChange: function onChange(value) {
        return setAttributes({
          contentType: value
        });
      },
      disabled: loading
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sort By', 'flexible-page-navigation'),
      value: sortBy,
      options: sortOptions,
      onChange: function onChange(value) {
        return setAttributes({
          sortBy: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sort Order', 'flexible-page-navigation'),
      value: sortOrder,
      options: orderOptions,
      onChange: function onChange(value) {
        return setAttributes({
          sortOrder: value
        });
      }
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Depth', 'flexible-page-navigation'),
      value: depth,
      onChange: function onChange(value) {
        return setAttributes({
          depth: value
        });
      },
      min: 1,
      max: 10,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Maximum depth of navigation hierarchy', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child Selection', 'flexible-page-navigation'),
      value: childSelection,
      options: childSelectionOptions,
      onChange: function onChange(value) {
        return setAttributes({
          childSelection: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('How to select which items to display', 'flexible-page-navigation')
    }), childSelection === 'custom' && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Parent Page ID', 'flexible-page-navigation'),
      type: "number",
      value: parentPageId,
      onChange: function onChange(value) {
        return setAttributes({
          parentPageId: parseInt(value) || 0
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the ID of the parent page to show its children', 'flexible-page-navigation')
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display Settings', 'flexible-page-navigation'),
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Accordion', 'flexible-page-navigation'),
      checked: accordionEnabled,
      onChange: function onChange(value) {
        return setAttributes({
          accordionEnabled: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable collapsible accordion functionality', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Column Layout', 'flexible-page-navigation'),
      value: columnLayout,
      options: columnLayoutOptions,
      onChange: function onChange(value) {
        return setAttributes({
          columnLayout: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose the column layout for navigation items', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show Active Indicator', 'flexible-page-navigation'),
      checked: showActiveIndicator,
      onChange: function onChange(value) {
        return setAttributes({
          showActiveIndicator: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show visual indicator for active page', 'flexible-page-navigation')
    }), showActiveIndicator && /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Active Item Padding', 'flexible-page-navigation'),
      value: activePadding,
      onChange: function onChange(value) {
        return setAttributes({
          activePadding: value
        });
      },
      min: 0,
      max: 20,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Padding for active navigation items (in pixels)', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hover Effect', 'flexible-page-navigation'),
      value: hoverEffect,
      options: hoverEffectOptions,
      onChange: function onChange(value) {
        return setAttributes({
          hoverEffect: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose hover effect for navigation items', 'flexible-page-navigation')
    }), hoverEffect === 'background' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hover Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: hoverBackgroundColor,
      onChange: function onChange(value) {
        return setAttributes({
          hoverBackgroundColor: value
        });
      }
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Left Border Lines', 'flexible-page-navigation'),
      checked: separatorEnabled,
      onChange: function onChange(value) {
        return setAttributes({
          separatorEnabled: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show left border lines for submenu items to indicate hierarchy', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border Line Width', 'flexible-page-navigation'),
      value: separatorWidth,
      onChange: function onChange(value) {
        return setAttributes({
          separatorWidth: value
        });
      },
      min: 1,
      max: 10,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Width of left border lines in pixels', 'flexible-page-navigation'),
      disabled: !separatorEnabled
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border Line Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: separatorColor,
      onChange: function onChange(value) {
        return setAttributes({
          separatorColor: value
        });
      },
      disabled: !separatorEnabled
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Submenu Indentation', 'flexible-page-navigation'),
      value: separatorPadding,
      onChange: function onChange(value) {
        return setAttributes({
          separatorPadding: value
        });
      },
      min: 10,
      max: 50,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Left padding/indentation for submenu items in pixels', 'flexible-page-navigation')
    })), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Main Menu Items (Level 0)', 'flexible-page-navigation'),
      initialOpen: false
    }, /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Weight', 'flexible-page-navigation'),
      value: mainItemFontWeight,
      options: [{
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Normal', 'flexible-page-navigation'),
        value: '400'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Medium', 'flexible-page-navigation'),
        value: '500'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Semi Bold', 'flexible-page-navigation'),
        value: '600'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bold', 'flexible-page-navigation'),
        value: '700'
      }, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Extra Bold', 'flexible-page-navigation'),
        value: '800'
      }],
      onChange: function onChange(value) {
        return setAttributes({
          mainItemFontWeight: value
        });
      },
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font weight for main menu items (level 0)', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Size', 'flexible-page-navigation'),
      value: mainItemFontSize,
      onChange: function onChange(value) {
        return setAttributes({
          mainItemFontSize: value
        });
      },
      min: 12,
      max: 24,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font size for main menu items in pixels', 'flexible-page-navigation')
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: mainItemTextColor,
      onChange: function onChange(value) {
        return setAttributes({
          mainItemTextColor: value
        });
      }
    }))), /*#__PURE__*/React.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Colors', 'flexible-page-navigation'),
      initialOpen: false
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: backgroundColor,
      onChange: function onChange(value) {
        return setAttributes({
          backgroundColor: value
        });
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: textColor,
      onChange: function onChange(value) {
        return setAttributes({
          textColor: value
        });
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Active Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: activeBackgroundColor,
      onChange: function onChange(value) {
        return setAttributes({
          activeBackgroundColor: value
        });
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Active Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: activeTextColor,
      onChange: function onChange(value) {
        return setAttributes({
          activeTextColor: value
        });
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child Active Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: childActiveBackgroundColor,
      onChange: function onChange(value) {
        return setAttributes({
          childActiveBackgroundColor: value
        });
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child Active Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.ColorPalette, {
      value: childActiveTextColor,
      onChange: function onChange(value) {
        return setAttributes({
          childActiveTextColor: value
        });
      }
    })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
      className: "fpn-editor-preview"
    }, /*#__PURE__*/React.createElement("h4", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Flexible Page Navigation', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Content Type:', 'flexible-page-navigation'), " ", contentType, " |", ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sort:', 'flexible-page-navigation'), " ", sortBy, " (", sortOrder, ") |", ' ', (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Depth:', 'flexible-page-navigation'), " ", depth), /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child Selection:', 'flexible-page-navigation'), " ", childSelection, childSelection === 'custom' && parentPageId > 0 && /*#__PURE__*/React.createElement("span", null, " - ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Parent ID:', 'flexible-page-navigation'), " ", parentPageId)), /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Accordion:', 'flexible-page-navigation'), " ", accordionEnabled ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enabled', 'flexible-page-navigation') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Disabled', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Layout:', 'flexible-page-navigation'), " ", columnLayout.replace('-', ' ').replace(/\b\w/g, function (l) {
      return l.toUpperCase();
    })))));
  },
  save: function Save() {
    return null; // Dynamic block, rendered by PHP
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map