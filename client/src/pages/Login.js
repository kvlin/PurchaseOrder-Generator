import React, { useContext } from 'react'
import ReactDOM, { useLocation } from 'react-dom'
import { useHistory } from 'react-router-dom'
import 'antd/dist/antd.css'
import './index.css'
import API from '../utils/API'
import LoginFormContainer from '../components/LoginForm'
import { Layout } from 'antd'

export default function Login () {
  const { Content } = Layout
  // initialize history to store the visited link
  const history = useHistory()
  async function onFinish (loginData) {
    API.login(loginData)
      .then(response => {
        // Upon successful login, return to the the page that triggered the login
        history.go(history.location.pathname)
      }).catch(err => {
        console.log(err)
      }
      )
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div style={{ minHeight: '93vh', maxWidth: '100vh', margin:"0 auto"}}>
      <Content style={{
        padding: 24,
        margin: 0,
        minHeight: 280
      }}
      >
        <LoginFormContainer onFinish={onFinish} onFinishFailed={onFinishFailed} />
      </Content>
    </div>
  )
}
