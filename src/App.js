import React from 'react'
import GraphiQL from 'graphiql'
import fetch from 'isomorphic-fetch'
import { isUri } from 'valid-url'

const options = { method: 'post', headers: { 'Content-Type': 'application/json' } }
const endpoint = 'https://countries.trevorblades.com/' // Initial

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
  countries {
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
          <GraphiQL.Logo>
            <a href='https://github.com/lucasconstantino/graphiql-online' title='See GraphiQL Online on GitHub'>
              <svg aria-hidden='true' className='octicon octicon-mark-github' height='32' version='1.1' viewBox='0 0 16 16' width='32'><path fillRule='evenodd' d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z' /></svg>
            </a>
          </GraphiQL.Logo>

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
