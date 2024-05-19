import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
//http://localhost:1337/api/login
  async function loginUser(event) {
    event.preventDefault();
    try {
      const response = await fetch("https://chatbotserver-a0wu.onrender.com/api/login", {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to home page on successful login
        localStorage.setItem('token', data.token); // Store the token in local storage
        window.location.href = "/Home";
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError("Internal server error. Please try again later.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-5xl font-bold text-orange-600 mb-8">GovAssist</div>
      <div className="bg-white p-8 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg shadow-xl transition duration-300 transform hover:shadow-2xl">
        <h1 className="text-2xl mb-4">Login</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={loginUser}>
          <input
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-3 focus:outline-none focus:border-indigo-500"
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded-md py-2 px-3 mb-3 focus:outline-none focus:border-indigo-500"
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
            type="submit"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don't have an account? <Link to="/SignupPage" className="text-indigo-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
