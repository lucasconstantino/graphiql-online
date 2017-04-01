import React from 'react'
import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'
import { isUri } from 'valid-url'

const options = { method: 'post', headers: { 'Content-Type': 'application/json' } }
const endpoint = 'https://api.graph.cool/simple/v1/ciyz901en4j590185wkmexyex' // Initial

const defaultQuery = `
# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Default endpoint is an instance of https://www.graph.cool/
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

query {
  allUsers {
    id
    name
  }
}
`

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      defaultQuery,
      endpoint,
      fetcher: this.createFetcher(endpoint)
    }
  }

  /**
  * GraphiQL fetcher factory.
  */
  createFetcher = endpoint => param => fetch(endpoint, { ...options, body: JSON.stringify(param) })
    .then(response => response.json())

  /**
   * Change endpoint and fetcher.
   */
  changeEndpoint = endpoint => this.setState({
    endpoint,
    fetcher: this.createFetcher(endpoint)
  })

  /**
   * validate end change endpoint, but only when new one is valid url.
   */
  validateAndChangeEndpoint = endpoint => isUri(endpoint)
    ? this.changeEndpoint(endpoint)
    : (window.alert('Invalid url'), this.chooseEndpoint())

  /**
   * Promp user for new endpoint.
   */
  chooseEndpoint = () => this.validateAndChangeEndpoint(
    window.prompt('Choose the new endpoint', this.state.endpoint)
  )

  setRef = c => (this.graphiql = c)

  render () {
    return (
      <div id='container'>
        <GraphiQL
          ref={ this.setRef }
          fetcher={ this.state.fetcher }
          defaultQuery={ this.state.defaultQuery }
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              label='Change endpoint'
              title='Change endpoint'
              onClick={ this.chooseEndpoint }
            />
            <span>Endpoint: <strong>{ this.state.endpoint }</strong></span>
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    )
  }
}
