import React, { useState, useContext, useEffect } from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'
import AddProduct from './pages/AddProduct'
import Calculation from './pages/Calculation'
import Login from './pages/Login'
import NoMatch from './pages/NoMatch'
import Nav from './components/Nav'
import AuthContext from './components/AuthContext'
import API from './utils/API'
import { Layout } from 'antd'
import { GithubOutlined } from '@ant-design/icons'

function App () {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const value = { isAuthenticated, setIsAuthenticated }

  // We check if user is already logged in, and if they are then we set isAuthenticated to true
  useEffect(() => {
    API.userLoggedIn().then(response => {
      // setIsAuthenticated(response.data.isAuthenticated)
      setIsAuthenticated(response.data.isAuthenticated)
    })
  }, [])

  const { Footer } = Layout
  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Layout>
          <Nav />
          <Switch>
            <Route exact path={['/']}>
              {isAuthenticated
                ? <Calculation /> : <Login />}
            </Route>
            <Route exact path={['/login']}>
              <Login />
            </Route>
            <Route exact path={['/addproduct']}>
              {isAuthenticated
                ? <AddProduct /> : <Login />}
            </Route>
            <Route exact path={['/logout']}>
              <AddProduct />
            </Route>
            <Route>
              <NoMatch />
            </Route>
          </Switch>
        </Layout>
      </BrowserRouter>
      <Footer style={{ textAlign: 'center', fontSize: '1.5em' }}>Created by <GithubOutlined /><a href='https://github.com/klin4994'> klin4994</a></Footer>
    </AuthContext.Provider>
  )
}

export default App
