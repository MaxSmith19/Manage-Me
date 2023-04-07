import React, { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'

const UserSettings = () => {
  const [businessName, setBusinessName] = useState('')
  const [businessLogo, setBusinessLogo] = useState(null)

  const onSubmit = (e) => {
    e.preventDefault()
    const userIDCookie = document.cookie.split('=')[1]
    const token = userIDCookie.split(';')[0]

    const formData = new FormData()
    formData.append('businessName', businessName)
    formData.append('businessLogo', businessLogo)

    axios
      .put('http://localhost:5000/api/Users/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data)
        localStorage.setItem('businessName', response.data.businessName)
        localStorage.setItem('businessLogo', response.data.businessLogo)
        toast.success("User updated successfully")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-lg mt-12 form-width form-length">
        <h1 className="block text-gray-700 font-bold text-center text-5xl mb-10">
          Your Account
        </h1>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full p-20"
          onSubmit={onSubmit}
        >
          <div className="mb-6">
            <label className="block text-gray-700 text-xl font-bold mb-2">
              Name of business
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="text"
              onChange={(e) => setBusinessName(e.target.value)}
              value={businessName}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-xl font-bold mb-2">
              Business Logo
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3"
              type="file"
              onChange={(e) => setBusinessLogo(e.target.files[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              type="submit"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>)
}
export default UserSettings