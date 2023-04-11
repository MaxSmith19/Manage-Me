import React, { useState } from 'react'
import axios from "axios"
import { Link } from 'react-router-dom';
import * as qs from 'qs'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
const ChangePassword = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            setErrorMessage("Passwords do not match")
            return;
        }
    
        const data =  qs.stringify({
            'email': email,
            'oldPassword': oldPassword,
            'password': password
            })

        var config = {
          method: 'post',
          url: 'http://localhost:5000/api/Users/changePassword',
          headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data : data
        };
        
        axios(config)
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        });
    
      }

  return (
    <div class="flex justify-center">
      <div class="max-w-lg mt-12 form-width form-length">
        <h1 class="block text-gray-700 font-bold text-center text-5xl mb-10">Forgot your password</h1>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
          <div class="mb-6">
            <label class="block text-gray-700 text-xl font-bold mb-2" for="password">
              Email address
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3" type="text" onChange={(e)=>setEmail(e.target.value)} value={email}/>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-xl font-bold mb-2" for="password">
              Old Password
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="password" onChange={(e)=>setOldPassword(e.target.value)} value={oldPassword}/>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-xl font-bold mb-2" for="password">
              Password
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-xl font-bold mb-2" for="password">
              Confirm password
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3" type="password" onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword}/>
          </div>
          <div>
            <h1 className="mb-5">{errorMessage}</h1>
          </div>
          <div>
            <h1 className="mb-5">Already have an account? Login <Link className="text-blue-600"to="/Login">here</Link></h1>
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded " type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>

    )
}
export default ChangePassword