let {assoc, assocPath, identity, prop} = require("ramda")
let {Observable: $} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

let {scanFn} = require("../../rx.utils")

let {User} = require("./models")
let seeds = require("./seeds")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // INTENTS
  let intents = {
    changeUsername: src.DOM.select("#username")
      .events("input")
      .map((event) => event.target.value)
      .share(),

    changeEmail: src.DOM.select("#email")
      .events("input")
      .map((event) => event.target.value)
      .share(),

    createUser: src.DOM.select("#submit")
      .events("click")
      .map((event) => true)
      .debounce(100)
      .share(),
  }

  // STATE
  let state = $
    .merge(
      // Track fields
      intents.changeUsername.map((v) => assocPath(["form", "username"], v)),
      intents.changeEmail.map((v) => assocPath(["form", "email"], v)),
  
      // Updates
      src.update
    )
    .startWith(seeds)
    .scan(scanFn)
    .distinctUntilChanged()
    .shareReplay(1)

  // ACTIONS
  let actions = {
    createUser: state.map(prop("form"))
      .sample(intents.createUser)
      .map((input) => User(input))
      .share(),
  }

  // SINKS
  return {
    DOM: state.map((state) => {
      let {form} = state
      return div([
        h1("Registration"),
        div(".form-element", [
          label({htmlFor: "username"}, "Username:"),
          br(),
          input("#username", {type: "text", value: form.username, autocomplete: "off"}),
        ]),
        div(".form-element", [
          label({htmlFor: "email"}, "Email:"),
          br(),
          input("#email", {type: "text", value: form.email, autocomplete: "off"}),
        ]),
        button("#submit.form-element", {type: "submit"}, "Register"),
        hr(),
        h2("State SPY"),
        pre(JSON.stringify(state, null, 2)),
      ])
    }),
    
    update: $.merge(
      // Track fields
      intents.changeUsername.map((v) => assocPath(["form", "username"], v)),
      intents.changeEmail.map((v) => assocPath(["form", "email"], v)),
      
      // Create user
      actions.createUser.map((u) => (s) => assocPath(["users", u.id], u, s)),
  
      // Reset form after valid submit
      actions.createUser.delay(1).map((_) => assoc("form", seeds.form))
    ),
  }
}

Cycle.run(main, {
  update: identity,

  DOM: makeDOMDriver("#app"),
})