import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css'
import { RecoilRoot } from 'recoil';
import Login from './components/authenticationPages/Login/LoginPage.jsx';
import Signup from './components/authenticationPages/Signup/SignupPage.jsx';
import Layout from './components/Layout/Layout.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element:<Login/>
  },
  {
    path: '/SignupPage',
    element:<Signup/>
  },
  {
    path: '/Home',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <App />,
      }
       
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
     
          <RouterProvider router={router} />
      
    </RecoilRoot>
  </React.StrictMode>
)
