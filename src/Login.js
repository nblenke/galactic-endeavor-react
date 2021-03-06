import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GoogleButton from 'react-google-button'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  pathToJS
} from 'react-redux-firebase'

class Login extends Component {
  static propTypes = {
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired
    })
  }

  state = {
    isLoading: false
  }

  googleLogin = loginData => {
    this.setState({ isLoading: true })
    return this.props.firebase
      .login({ provider: 'google' })
      .then(() => {
        this.setState({ isLoading: false })
        // this is where you can redirect to another route
      })
      .catch((error) => {
        this.setState({ isLoading: false })
        console.log('there was an error', error)
        console.log('error prop:', this.props.authError) // thanks to connect
      })
  }

  googleLogout = () => {
      this.props.firebase
        .logout({ provider: 'google' })
  }

  render () {
    const { auth } = this.props

    if (!isLoaded(auth)) {
      return (
        <div>
          <span>Loading</span>
        </div>
      )
    }

    if (isEmpty(auth)) {
      return (
        <div>
          <span>Log in to continue</span>
          <GoogleButton onClick={this.googleLogin} />
        </div>
      )
    }

    return (
      <p>Welcome {auth.displayName}({auth.email}) <span onClick={this.googleLogout}>Log Out</span></p>
    )

  }
}


export default compose(
  firebaseConnect(),
  connect(
    ({ firebase }) => ({
      authError: pathToJS(firebase, 'authError'),
      auth: pathToJS(firebase, 'auth'),
      profile: pathToJS(firebase, 'profile')
    })
  )
)(Login)
