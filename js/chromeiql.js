
/**
 * This GraphiQL example illustrates how to use some of GraphiQL's props
 * in order to enable reading and updating the URL parameters, making
 * link sharing of queries a little bit easier.
 *
 * This is only one example of this kind of feature, GraphiQL exposes
 * various React params to enable interesting integrations.
 */

// Shortcut for React.createElement...
var rc = _.partial(React.createElement);

// Parse the search string to get url parameters.
var search = window.location.search;
var parameters = {};
search.substr(1).split('&').forEach(function (entry) {
  var eq = entry.indexOf('=');
  if (eq >= 0) {
    parameters[decodeURIComponent(entry.slice(0, eq))] =
      decodeURIComponent(entry.slice(eq + 1));
  }
});

// if variables was provided, try to format it.
if (parameters.variables) {
  try {
    parameters.variables =
      JSON.stringify(JSON.parse(parameters.variables), null, 2);
  } catch (e) {
    // Do nothing, we want to display the invalid JSON as a string, rather
    // than present an error.
  }
}

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared
function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}

function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}

function updateURL() {
  var newSearch = '?' + Object.keys(parameters).map(function (key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(parameters[key]);
  }).join('&');
  history.replaceState(null, null, newSearch);
}

// Defines a GraphQL fetcher using the fetch API.
function graphQLFetcher(endpoint) {
  return function(graphQLParams) {
    return fetch(endpoint, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
      credentials: 'include',
    }).then(function (response) {
      return response.json()
    });
  }
}

var ChromeiQL = React.createClass({
  getInitialState: function() {
    return {
      currentEndpoint: this.props.endpoint
    };
  },

  render: function() {
    var graphqlConsole = null;
    if (this.state.currentEndpoint) {
      graphqlConsole = rc(GraphiQL, {
        id: "graphiql",
        fetcher: graphQLFetcher(this.state.currentEndpoint),
        query: parameters.query,
        variables: parameters.variables,
        onEditQuery: onEditQuery,
        onEditVariables: onEditVariables
      });
    }

    return (
      rc('div', {id: "application"},
        rc('div', {id: "url-bar"},
          rc('input', {type: "text", id: "url-box", onChange: this.updateEndpoint}),
          rc('button', {id: "url-save-button", onClick: this.setEndpoint}, "Set endpoint")
        ),
        graphqlConsole
      )
    );
  },

  setEndpoint: function() {
    this.setState({ currentEndpoint: window.chromeiqlEndpoint });
  },

  updateEndpoint: function(e) {
    window.chromeiqlEndpoint = e.target.value;
  }
});

chrome.storage.local.get("chromeiqlEndpoint", function(storage) {
  // Render <GraphiQL /> into the body.
  ReactDOM.render(
    rc(ChromeiQL, { endpoint: storage.chromeiqlEndpoint }),
    document.body
  );
});
