(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

require("./shims");

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Model = require("./model");
var View = require("./view");
var Intent = require("./intent");

// APP =============================================================================================
var DOM = Cycle.createDOMUser("main");

DOM.inject(View).inject(Model).inject(Intent).inject(DOM);

},{"./intent":3,"./model":5,"./shims":6,"./view":7,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("footer", function (User) {
  var View = Cycle.createView(function () {
    return {
      vtree$: Rx.Observable["return"](h("div", null, ["=== footer ==="]))
    };
  });

  User.inject(View);
});

},{"cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Intent = Cycle.createIntent(function (DOM) {
  return {
    add$: DOM.event$(".add", "click").map(function (event) {
      return 1;
    }),
    remove$: DOM.event$(".item", "remove").map(function (event) {
      return event.data;
    }),
    changeWidth$: DOM.event$(".item", "changeWidth").map(function (event) {
      return event.data;
    }),
    changeColor$: DOM.event$(".item", "changeColor").map(function (event) {
      return event.data;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],4:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", function (DOM, Props) {
  var View = Cycle.createView(function (Model) {
    var id$ = Model.get("id$");
    var width$ = Model.get("width$");
    var color$ = Model.get("color$");
    return {
      vtree$: Rx.Observable.combineLatest(id$, width$, color$, function (id, width, color) {
        return h("div", { className: "item", style: { width: width + "px", backgroundColor: color } }, [h("div", null, [h("input", { className: "width-slider", type: "range", min: "200", max: "1000", value: width })]), h("div", null, [h("input", { className: "color-input", type: "text", value: color })]), h("button", { className: "remove" }, ["Remove"])]);
      }) };
  });

  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      id$: Props.get("id$").shareReplay(1),
      width$: Props.get("width$"),
      color$: Props.get("color$") };
  });

  var Intent = Cycle.createIntent(function (DOM) {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(function (event) {
        return parseInt(event.target.value);
      }),
      changeColor$: DOM.event$(".color-input", "input").map(function (event) {
        return event.target.value;
      }),
      remove$: DOM.event$(".remove", "click").map(function (event) {
        return true;
      }) };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$").withLatestFrom(Model.get("id$"), function (width, id) {
      return { id: id, width: width };
    }),

    changeColor$: Intent.get("changeColor$").withLatestFrom(Model.get("id$"), function (color, id) {
      return { id: id, color: color };
    }),

    remove$: Intent.get("remove$").withLatestFrom(Model.get("id$"), function (_, id) {
      return id;
    }) };
});

},{"cyclejs":"cyclejs"}],5:[function(require,module,exports){
"use strict";

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

// IMPORTS =========================================================================================
var uuid = require("node-uuid");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Model = Cycle.createModel(function (Intent) {
  var add$ = Intent.get("add$").map(function () {
    return function transform(state) {
      var model = createRandom();
      var state = Object.assign({}, state);
      state[model.id] = model;
      return state;
    };
  });

  var remove$ = Intent.get("remove$").map(function (id) {
    return function transform(state) {
      var state = Object.assign({}, state);
      delete state[id];
      return state;
    };
  });

  var changeWidth$ = Intent.get("changeWidth$").map(function (model) {
    return function transform(state) {
      state[model.id].width = model.width;
      return state;
    };
  });

  var changeColor$ = Intent.get("changeColor$").map(function (model) {
    return function (state) {
      state[model.id].color = model.color;
      return state;
    };
  });

  var transforms = Rx.Observable.merge(add$, remove$, changeColor$, changeWidth$);

  return {
    state$: transforms.startWith(seedState()).scan(function (state, transform) {
      return transform(state);
    })
  };
});

function createRandom(withData) {
  return Object.assign({
    id: uuid.v4(),
    width: Math.floor(Math.random() * 800 + 200),
    color: "#" + Math.random().toString(16).substr(-6) }, withData);
}

function seedState() {
  var model = createRandom();
  var state = _defineProperty({}, model.id, model);
  return state;
}

module.exports = Model;

},{"cyclejs":"cyclejs","node-uuid":"node-uuid"}],6:[function(require,module,exports){
"use strict";

require("object.assign").shim();

console.error = console.log;

},{"object.assign":"object.assign"}],7:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var sortBy = require("lodash.sortby");
var values = require("lodash.values");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Footer = require("./footer");
var Item = require("./item");

// EXPORTS =========================================================================================
var View = Cycle.createView(function (Model) {
  var state$ = Model.get("state$");
  return {
    vtree$: state$.map(function (models) {
      return h("div", { className: "everything" }, [h("div", { className: "topButtons" }, [h("button", { className: "add" }, ["Add Random"])]), h("div", null, [sortBy(values(models), function (model) {
        return model.id;
      }).map(function (model) {
        return h("Item.item", { id: model.id, width: model.width, color: model.color, key: model.id });
      })]), h("Footer")]);
    }) };
});

module.exports = View;

},{"./footer":2,"./item":4,"cyclejs":"cyclejs","lodash.sortby":"lodash.sortby","lodash.values":"lodash.values"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkLzMuNC1zbGlkZXItY29sb3JzL2FwcC5qcyIsImJ1aWxkLzMuNC1zbGlkZXItY29sb3JzL2Zvb3Rlci5qcyIsImJ1aWxkLzMuNC1zbGlkZXItY29sb3JzL2ludGVudC5qcyIsImJ1aWxkLzMuNC1zbGlkZXItY29sb3JzL2l0ZW0uanMiLCJidWlsZC8zLjQtc2xpZGVyLWNvbG9ycy9tb2RlbC5qcyIsImJ1aWxkLzMuNC1zbGlkZXItY29sb3JzL3NoaW1zLmpzIiwiYnVpbGQvMy40LXNsaWRlci1jb2xvcnMvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHbkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHakMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FDVjFELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQU8sS0FBSyxDQUFkLEVBQUU7SUFBRSxDQUFDLEdBQUksS0FBSyxDQUFWLENBQUM7OztBQUdWLEtB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LEtBQUssRUFBSTtBQUNyRCxlQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7T0FDOUYsQ0FBQyxDQUNILENBQUMsRUFDRixDQUFDLENBQUMsUUFBUSxDQUFDLENBQ1osQ0FBQyxDQUNGO0tBQ0gsQ0FBQyxFQUNILENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5sZXQgSW50ZW50ID0gcmVxdWlyZShcIi4vaW50ZW50XCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRE9NID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cbkRPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoRE9NKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIEVMRU1FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkN5Y2xlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudChcImZvb3RlclwiLCBmdW5jdGlvbihVc2VyKSB7XG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdnRyZWUkOiBSeC5PYnNlcnZhYmxlLnJldHVybihcbiAgICAgICAgaCgnZGl2JywgbnVsbCwgW1wiPT09IGZvb3RlciA9PT1cIl0pXG4gICAgICApXG4gICAgfTtcbiAgfSk7XG5cbiAgVXNlci5pbmplY3QoVmlldyk7XG59KTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoRE9NID0+IHtcbiAgcmV0dXJuIHtcbiAgICBhZGQkOiBET00uZXZlbnQkKFwiLmFkZFwiLCBcImNsaWNrXCIpLm1hcChldmVudCA9PiAxKSxcbiAgICByZW1vdmUkOiBET00uZXZlbnQkKFwiLml0ZW1cIiwgXCJyZW1vdmVcIikubWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpLFxuICAgIGNoYW5nZVdpZHRoJDogRE9NLmV2ZW50JChcIi5pdGVtXCIsIFwiY2hhbmdlV2lkdGhcIikubWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpLFxuICAgIGNoYW5nZUNvbG9yJDogRE9NLmV2ZW50JChcIi5pdGVtXCIsIFwiY2hhbmdlQ29sb3JcIikubWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZW50OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gRUxFTUVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiaXRlbVwiLCAoRE9NLCBQcm9wcykgPT4ge1xuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIGxldCBpZCQgPSBNb2RlbC5nZXQoXCJpZCRcIik7XG4gICAgbGV0IHdpZHRoJCA9IE1vZGVsLmdldChcIndpZHRoJFwiKTtcbiAgICBsZXQgY29sb3IkID0gTW9kZWwuZ2V0KFwiY29sb3IkXCIpO1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdChpZCQsIHdpZHRoJCwgY29sb3IkLCAoaWQsIHdpZHRoLCBjb2xvcikgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcIml0ZW1cIiwgc3R5bGU6IHt3aWR0aDogd2lkdGggKyBcInB4XCIsIGJhY2tncm91bmRDb2xvcjogY29sb3J9fSwgW1xuICAgICAgICAgICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgICAgICAgICAgaCgnaW5wdXQnLCB7Y2xhc3NOYW1lOiBcIndpZHRoLXNsaWRlclwiLCB0eXBlOiBcInJhbmdlXCIsIG1pbjogXCIyMDBcIiwgbWF4OiBcIjEwMDBcIiwgdmFsdWU6IHdpZHRofSlcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgICAgICBoKCdpbnB1dCcsIHtjbGFzc05hbWU6IFwiY29sb3ItaW5wdXRcIiwgdHlwZTogXCJ0ZXh0XCIsIHZhbHVlOiBjb2xvcn0pXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICBoKCdidXR0b24nLCB7Y2xhc3NOYW1lOiBcInJlbW92ZVwifSwgW1wiUmVtb3ZlXCJdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKChJbnRlbnQsIFByb3BzKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkJDogUHJvcHMuZ2V0KFwiaWQkXCIpLnNoYXJlUmVwbGF5KDEpLFxuICAgICAgd2lkdGgkOiBQcm9wcy5nZXQoXCJ3aWR0aCRcIiksXG4gICAgICBjb2xvciQ6IFByb3BzLmdldChcImNvbG9yJFwiKSxcbiAgICB9O1xuICB9KTtcblxuICBsZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KERPTSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYW5nZVdpZHRoJDogRE9NLmV2ZW50JChcIi53aWR0aC1zbGlkZXJcIiwgXCJpbnB1dFwiKS5tYXAoZXZlbnQgPT4gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LnZhbHVlKSksXG4gICAgICBjaGFuZ2VDb2xvciQ6IERPTS5ldmVudCQoXCIuY29sb3ItaW5wdXRcIiwgXCJpbnB1dFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQudGFyZ2V0LnZhbHVlKSxcbiAgICAgIHJlbW92ZSQ6IERPTS5ldmVudCQoXCIucmVtb3ZlXCIsIFwiY2xpY2tcIikubWFwKGV2ZW50ID0+IHRydWUpLFxuICAgIH07XG4gIH0pO1xuXG4gIERPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50LCBQcm9wcylbMF0uaW5qZWN0KERPTSk7XG5cbiAgcmV0dXJuIHtcbiAgICBjaGFuZ2VXaWR0aCQ6IEludGVudC5nZXQoXCJjaGFuZ2VXaWR0aCRcIilcbiAgICAgIC53aXRoTGF0ZXN0RnJvbShNb2RlbC5nZXQoXCJpZCRcIiksICh3aWR0aCwgaWQpID0+ICh7aWQsIHdpZHRofSkpLFxuXG4gICAgY2hhbmdlQ29sb3IkOiBJbnRlbnQuZ2V0KFwiY2hhbmdlQ29sb3IkXCIpXG4gICAgICAud2l0aExhdGVzdEZyb20oTW9kZWwuZ2V0KFwiaWQkXCIpLCAoY29sb3IsIGlkKSA9PiAoe2lkLCBjb2xvcn0pKSxcblxuICAgIHJlbW92ZSQ6IEludGVudC5nZXQoXCJyZW1vdmUkXCIpXG4gICAgICAud2l0aExhdGVzdEZyb20oTW9kZWwuZ2V0KFwiaWQkXCIpLCAoXywgaWQpID0+IGlkKSxcbiAgfTtcbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHV1aWQgPSByZXF1aXJlKFwibm9kZS11dWlkXCIpO1xubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4fSA9IEN5Y2xlO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbChJbnRlbnQgPT4ge1xuICBsZXQgYWRkJCA9IEludGVudC5nZXQoXCJhZGQkXCIpLm1hcCgoKSA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRyYW5zZm9ybShzdGF0ZSkge1xuICAgICAgbGV0IG1vZGVsID0gY3JlYXRlUmFuZG9tKCk7XG4gICAgICBsZXQgc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSk7XG4gICAgICBzdGF0ZVttb2RlbC5pZF0gPSBtb2RlbDtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICB9KTtcblxuICBsZXQgcmVtb3ZlJCA9IEludGVudC5nZXQoXCJyZW1vdmUkXCIpLm1hcChpZCA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRyYW5zZm9ybShzdGF0ZSkge1xuICAgICAgbGV0IHN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUpO1xuICAgICAgZGVsZXRlIHN0YXRlW2lkXTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICB9KTtcblxuICBsZXQgY2hhbmdlV2lkdGgkID0gSW50ZW50LmdldChcImNoYW5nZVdpZHRoJFwiKS5tYXAobW9kZWwgPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm0oc3RhdGUpIHtcbiAgICAgIHN0YXRlW21vZGVsLmlkXS53aWR0aCA9IG1vZGVsLndpZHRoO1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG4gIH0pO1xuXG4gIGxldCBjaGFuZ2VDb2xvciQgPSBJbnRlbnQuZ2V0KFwiY2hhbmdlQ29sb3IkXCIpLm1hcChtb2RlbCA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBzdGF0ZVttb2RlbC5pZF0uY29sb3IgPSBtb2RlbC5jb2xvcjtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICB9KTtcblxuICBsZXQgdHJhbnNmb3JtcyA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoXG4gICAgYWRkJCxcbiAgICByZW1vdmUkLFxuICAgIGNoYW5nZUNvbG9yJCxcbiAgICBjaGFuZ2VXaWR0aCRcbiAgKTtcblxuICByZXR1cm4ge1xuICAgIHN0YXRlJDogdHJhbnNmb3Jtc1xuICAgICAgLnN0YXJ0V2l0aChzZWVkU3RhdGUoKSlcbiAgICAgIC5zY2FuKGZ1bmN0aW9uKHN0YXRlLCB0cmFuc2Zvcm0pIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybShzdGF0ZSk7XG4gICAgICB9KVxuICB9O1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJhbmRvbSh3aXRoRGF0YSkge1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgaWQ6IHV1aWQudjQoKSxcbiAgICB3aWR0aDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogODAwICsgMjAwKSxcbiAgICBjb2xvcjogJyMnICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc3Vic3RyKC02KSxcbiAgfSwgd2l0aERhdGEpO1xufVxuXG5mdW5jdGlvbiBzZWVkU3RhdGUoKSB7XG4gIGxldCBtb2RlbCA9IGNyZWF0ZVJhbmRvbSgpO1xuICBsZXQgc3RhdGUgPSB7XG4gICAgW21vZGVsLmlkXTogbW9kZWwsXG4gIH07XG4gIHJldHVybiBzdGF0ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDsiLCJyZXF1aXJlKFwib2JqZWN0LmFzc2lnblwiKS5zaGltKCk7XG5cbmNvbnNvbGUuZXJyb3IgPSBjb25zb2xlLmxvZzsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgc29ydEJ5ID0gcmVxdWlyZShcImxvZGFzaC5zb3J0YnlcIik7XG5sZXQgdmFsdWVzID0gcmVxdWlyZShcImxvZGFzaC52YWx1ZXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgRm9vdGVyID0gcmVxdWlyZShcIi4vZm9vdGVyXCIpO1xubGV0IEl0ZW0gPSByZXF1aXJlKFwiLi9pdGVtXCIpO1xuXG4vLyBFWFBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICBsZXQgc3RhdGUkID0gTW9kZWwuZ2V0KFwic3RhdGUkXCIpO1xuICByZXR1cm4ge1xuICAgIHZ0cmVlJDogc3RhdGUkLm1hcChtb2RlbHMgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJldmVyeXRoaW5nXCJ9LCBbXG4gICAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJ0b3BCdXR0b25zXCJ9LCBbXG4gICAgICAgICAgICBoKCdidXR0b24nLCB7Y2xhc3NOYW1lOiBcImFkZFwifSwgW1wiQWRkIFJhbmRvbVwiXSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgICAgICBzb3J0QnkodmFsdWVzKG1vZGVscyksIG1vZGVsID0+IG1vZGVsLmlkKS5tYXAobW9kZWwgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gaChcIkl0ZW0uaXRlbVwiLCB7aWQ6IG1vZGVsLmlkLCB3aWR0aDogbW9kZWwud2lkdGgsIGNvbG9yOiBtb2RlbC5jb2xvciwga2V5OiBtb2RlbC5pZH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBoKFwiRm9vdGVyXCIpXG4gICAgICAgIF0pXG4gICAgICApO1xuICAgIH0pLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldzsiXX0=
