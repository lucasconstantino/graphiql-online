import React from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

import App from './App.js'

const mount = document.createElement('div')
document.body.appendChild(mount)

ReactDOM.render(<App />, mount)
