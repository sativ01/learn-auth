import React from 'react';
import io from 'socket.io-client'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'

import AuthButton from './components/AuthButton'
import config from './config'
import './styles/main.css'

const socket = io(config.API_URL)

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      disabled: false
    }

    this.popup = null
  }

  componentDidMount() {
    socket.on('user', user => {
      this.popup.close()
      this.setState({ user })
    })
  }

  checkPopup = () => {
    const check = setInterval(() => {
      const { popup } = this
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check)
        this.setState({ disabled: false })
      }
    }, 1000)
  }

  openPopup = () => {
    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2)
    const top = (window.innerHeight / 2) - (height / 2)

    const url = `${config.API_URL}/auth/github?socketId=${socket.id}`

    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    )
  }

  startAuth = () => {
    if (!this.state.disabled) {
      this.popup = this.openPopup()
      this.checkPopup()
      this.setState({ disabled: true })
    }
  }


  closeCard = () => {
    this.setState({ user: {} })
  }

  render() {
    const { user, disabled } = this.state

    return (
      <div className="App">
        {/* <AuthButton
          user={user}
          disabled={disabled}
          icon={faTwitter}
          onAuth={this.startAuth}
          onClose={this.closeCard}
          authName="twitter"
        /> */}
        <AuthButton
          user={user}
          disabled={disabled}
          icon={faGithub}
          onAuth={this.startAuth}
          onClose={this.closeCard}
          authName="github"
        />
      </div>
    );
  }

}

export default App;
