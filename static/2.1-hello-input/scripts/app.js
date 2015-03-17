(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Model = require("./model");
var View = require("./view");
var Intent = require("./intent");

// APP =============================================================================================
var DOM = Cycle.createDOMUser("main");

DOM.inject(View).inject(Model).inject(Intent).inject(DOM);

},{"./intent":2,"./model":3,"./view":4,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Intent = Cycle.createIntent(function (DOM) {
  return {
    changeFirstName$: DOM.event$("#firstName", "input").map(function (event) {
      return event.target.value;
    }),
    changeLastName$: DOM.event$("#lastName", "input").map(function (event) {
      return event.target.value;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Model = Cycle.createModel(function (Intent) {
  return {
    firstName$: Intent.get("changeFirstName$").startWith(""),
    lastName$: Intent.get("changeLastName$").startWith("") };
});

module.exports = Model;

},{"cyclejs":"cyclejs"}],4:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// EXPORTS =========================================================================================
var View = Cycle.createView(function (Model) {
  var firstName$ = Model.get("firstName$");
  var lastName$ = Model.get("lastName$");
  return {
    vtree$: Rx.Observable.combineLatest(firstName$, lastName$, function (firstName, lastName) {
      return h("div", null, [h("label", null, ["First Name:"]), h("input", { type: "text", id: "firstName" }), h("label", null, ["Last Name:"]), h("input", { type: "text", id: "lastName" }), h("h1", { className: "header" }, ["Hello ", firstName + " " + lastName])]);
    })
  };
});

module.exports = View;

},{"cyclejs":"cyclejs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkLzIuMS1oZWxsby1pbnB1dC9hcHAuanMiLCJidWlsZC8yLjEtaGVsbG8taW5wdXQvaW50ZW50LmpzIiwiYnVpbGQvMi4xLWhlbGxvLWlucHV0L21vZGVsLmpzIiwiYnVpbGQvMi4xLWhlbGxvLWlucHV0L3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdqQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV0QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUNSMUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBSSxLQUFLLENBQVgsRUFBRTs7O0FBR1AsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNyQyxTQUFPO0FBQ0wsb0JBQWdCLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSzthQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztLQUFBLENBQUM7QUFDcEYsbUJBQWUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO2FBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO0tBQUEsQ0FBQyxFQUNuRixDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7Ozs7QUNYeEIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBSSxLQUFLLENBQVgsRUFBRTs7O0FBR1AsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN0QyxTQUFPO0FBQ0wsY0FBVSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQ3hELGFBQVMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUN2RCxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7Ozs7QUNYdkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7O0FBR1YsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNuQyxNQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3pDLE1BQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdkMsU0FBTztBQUNMLFVBQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBSztBQUNsRixhQUNFLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQ2IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUNqQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFDLENBQUMsRUFFM0MsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUNoQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFDLENBQUMsRUFFMUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQ3ZFLENBQUMsQ0FDRjtLQUNILENBQUM7R0FDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5sZXQgSW50ZW50ID0gcmVxdWlyZShcIi4vaW50ZW50XCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRE9NID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cbkRPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoRE9NKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoRE9NID0+IHtcbiAgcmV0dXJuIHtcbiAgICBjaGFuZ2VGaXJzdE5hbWUkOiBET00uZXZlbnQkKFwiI2ZpcnN0TmFtZVwiLCBcImlucHV0XCIpLm1hcChldmVudCA9PiBldmVudC50YXJnZXQudmFsdWUpLFxuICAgIGNoYW5nZUxhc3ROYW1lJDogRE9NLmV2ZW50JChcIiNsYXN0TmFtZVwiLCBcImlucHV0XCIpLm1hcChldmVudCA9PiBldmVudC50YXJnZXQudmFsdWUpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZW50OyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoSW50ZW50ID0+IHtcbiAgcmV0dXJuIHtcbiAgICBmaXJzdE5hbWUkOiBJbnRlbnQuZ2V0KFwiY2hhbmdlRmlyc3ROYW1lJFwiKS5zdGFydFdpdGgoXCJcIiksXG4gICAgbGFzdE5hbWUkOiBJbnRlbnQuZ2V0KFwiY2hhbmdlTGFzdE5hbWUkXCIpLnN0YXJ0V2l0aChcIlwiKSxcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgbGV0IGZpcnN0TmFtZSQgPSBNb2RlbC5nZXQoXCJmaXJzdE5hbWUkXCIpO1xuICBsZXQgbGFzdE5hbWUkID0gTW9kZWwuZ2V0KFwibGFzdE5hbWUkXCIpO1xuICByZXR1cm4ge1xuICAgIHZ0cmVlJDogUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KGZpcnN0TmFtZSQsIGxhc3ROYW1lJCwgKGZpcnN0TmFtZSwgbGFzdE5hbWUpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICBoKCdsYWJlbCcsIG51bGwsIFtcIkZpcnN0IE5hbWU6XCJdKSxcbiAgICAgICAgICBoKCdpbnB1dCcsIHt0eXBlOiBcInRleHRcIiwgaWQ6IFwiZmlyc3ROYW1lXCJ9KSxcblxuICAgICAgICAgIGgoJ2xhYmVsJywgbnVsbCwgW1wiTGFzdCBOYW1lOlwiXSksXG4gICAgICAgICAgaCgnaW5wdXQnLCB7dHlwZTogXCJ0ZXh0XCIsIGlkOiBcImxhc3ROYW1lXCJ9KSxcblxuICAgICAgICAgIGgoJ2gxJywge2NsYXNzTmFtZTogXCJoZWFkZXJcIn0sIFtcIkhlbGxvIFwiLCBmaXJzdE5hbWUgKyBcIiBcIiArIGxhc3ROYW1lXSlcbiAgICAgICAgXSlcbiAgICAgICk7XG4gICAgfSlcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XG5cbiJdfQ==