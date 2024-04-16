import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

/* problem: Logout user when press (Logout button)
1. call appwrite logout function 
2. if its success (update contenxt: logout info)
3. if not throw error
*/

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = async () => {
        await authService.logout()
        .then(() => dispatch(logout()))
        .catch((error) => console.log("componenet :: LogoutBtn :: error ", error))
    }
  return (
    <button className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full" 
    onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn