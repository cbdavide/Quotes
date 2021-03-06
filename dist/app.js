(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Main = require('./main');
ReactDOM.render(React.createElement(Main, null), document.getElementById('continer'));

},{"./main":2}],2:[function(require,module,exports){
'use strict';

var QuoteModel = require('./model'),
    QuoteView = require('./quote');

var model = QuoteModel();

var Main = React.createClass({
  displayName: 'Main',


  getInitialState: function getInitialState() {

    var le_quotes = model.getQuotes();

    le_quotes.forEach(function (element) {
      element.isSaved = true;
    });

    return {
      quotes: le_quotes
    };
  },

  callQuote: function callQuote() {
    var _this = this;

    $.ajax({
      url: 'http://api.forismatic.com/api/1.0/',
      jsonp: 'jsonp',
      dataType: 'jsonp',
      data: {
        method: 'getQuote',
        lang: 'en',
        format: 'jsonp'
      }
    }).done(function (data) {
      _this.setState(function (old) {
        old.quotes.unshift({
          id: data.quoteLink,
          isSaved: false,
          quoteText: data.quoteText,
          quoteAuthor: data.quoteAuthor
        });
        return {
          quotes: old.quotes
        };
      });
    }).fail(function (err) {
      console.log('Err -> Quote did not arrive :c');
    });
  },

  saveQuote: function saveQuote(text, author, id) {

    if (!model.isSaved(id)) {

      model.saveQuote({
        id: id,
        quoteText: text,
        quoteAuthor: author
      });
    } else {
      model.removeQuote(id);
    }

    this.setState(function (old) {

      var le_quotes = old.quotes;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = le_quotes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var quote = _step.value;

          if (id == quote.id) {
            quote.isSaved = !quote.isSaved;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return {
        quotes: le_quotes
      };
    });
  },

  toggleThanks: function toggleThanks() {},

  render: function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'header',
        { className: 'header' },
        React.createElement('img', { className: 'header__logo ', src: 'dist/img/logo.svg', width: '40px', onClick: this.toggleThanks }),
        React.createElement(
          'div',
          { className: 'header__title' },
          'Quote it'
        ),
        React.createElement('span', { className: 'header__add icon-add', onClick: this.callQuote })
      ),
      React.createElement(
        'section',
        { className: 'quotes' },
        this.state.quotes.map(function (val) {
          return React.createElement(QuoteView, {
            key: val.id,
            isSaved: val.isSaved,
            text: val.quoteText,
            author: val.quoteAuthor,
            id: val.id,
            save: _this2.saveQuote
          });
        })
      )
    );
  }
});

module.exports = Main;

},{"./model":3,"./quote":4}],3:[function(require,module,exports){
'use strict';

var QuoteModel = function QuoteModel() {

  return {

    updateModel: function updateModel(quotes) {
      localStorage.quotes = JSON.stringify(quotes);
    },

    quoteIndex: function quoteIndex(id) {
      var model = JSON.parse(localStorage.quotes);

      for (var i = 0; i < model.length; i++) {
        if (model[i].id == id) return i;
      }
      return -1;
    },

    getQuotes: function getQuotes() {
      var quotes = localStorage.quotes || '[]';
      return JSON.parse(quotes);
    },

    isSaved: function isSaved(id) {
      var model = this.getQuotes();

      for (var i = 0; i < model.length; i++) {
        if (model[i].id === id) {
          return true;
        }
      }
      return false;
    },

    saveQuote: function saveQuote(quote) {
      var model = this.getQuotes();
      model.unshift(quote);
      this.updateModel(model);
    },

    removeQuote: function removeQuote(id) {
      var model = this.getQuotes();
      model.splice(this.quoteIndex(id), 1);
      this.updateModel(model);
    }
  };
};

module.exports = QuoteModel;

},{}],4:[function(require,module,exports){
'use strict';

var className = require('classnames');
var Quote = React.createClass({
  displayName: 'Quote',


  render: function render() {
    var _props = this.props;
    var save = _props.save;
    var text = _props.text;
    var author = _props.author;
    var id = _props.id;


    var classes = className({
      'options__fav': true,
      'icon-fav': !this.props.isSaved,
      'icon-fav-saved': this.props.isSaved
    });

    return React.createElement(
      'article',
      { className: 'quote', onClick: save.bind(null, text, author, id) },
      React.createElement(
        'div',
        { className: 'quote__options' },
        React.createElement('span', { className: classes })
      ),
      React.createElement(
        'div',
        { className: 'quote__content' },
        React.createElement(
          'div',
          { className: 'content__text' },
          text
        ),
        React.createElement(
          'div',
          { className: 'content__author' },
          author
        )
      )
    );
  }
});

module.exports = Quote;

},{"classnames":5}],5:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}]},{},[1]);
