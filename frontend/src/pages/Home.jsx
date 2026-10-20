import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { authApi } from '../services/authApi'
import { menuApi } from '../services/menuApi'
import { typeApi } from '../services/typeApi'
import FoodForm from './foods/FoodForm'

function Home() {
  const [loginUser, setLoginUser] = useState(null)   // null = guest
  const [foodList, setFoodList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [userList, setUserList] = useState([])
  const [adminView, setAdminView] = useState('menu') // 'menu' | 'user'
  const navigate = useNavigate()

  // check token -> user mode / admin mode, otherwise guest mode
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.home()
        if (response.status === 200) {
          setLoginUser(response.data.user[0])
        }
      } catch (err) {
        setLoginUser(null)
      }
    }
    fetchUser()
  }, [])

  // menu with real-time data update (polling)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFoodList(await menuApi.getAll())
      } catch (err) {
        console.error("Failed to fetch menus:", err)
      }
    }
    fetchData()

    // Set up polling interval (every 5 seconds)
    const intervalId = setInterval(fetchData, 5000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  const isAdmin = loginUser && loginUser.role === 'admin'
  const isUser = loginUser && loginUser.role === 'user'

  // admin: load types for the form, users for the role page
  useEffect(() => {
    if (!isAdmin) return
    typeApi.getAll().then(setTypeList).catch(console.error)
    authApi.getUsers().then(setUserList).catch(console.error)
  }, [isAdmin])

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('token')
    setLoginUser(null)
    setAdminView('menu')
    // Redirect to the login page
    navigate('/login')
  }

  const refreshFoods = async () => setFoodList(await menuApi.getAll())

  const deleteFood = async (id) => {
    try {
      await menuApi.delete(id)
      setFoodList((list) => list.filter((food) => food.menuId !== id))
    } catch (error) {
      console.error("Failed to delete menu:", error)
    }
  }

  const addFood = async (newFood) => {
    try {
      await menuApi.create(newFood)
      await refreshFoods()
    } catch (error) {
      console.error("Failed to add menu:", error)
    }
  }

  const rateFood = async (menuId, score) => {
    try {
      await menuApi.rate(menuId, score)
      await refreshFoods()
    } catch (error) {
      console.error("Failed to rate menu:", error)
    }
  }

  const changeRole = async (id, role) => {
    try {
      await authApi.setRole(id, role)
      setUserList(await authApi.getUsers())
    } catch (error) {
      console.error("Failed to change role:", error)
    }
  }

  return (
    <div>
      {/* top bar */}
      <div style={{ background: '#f8e8d4', padding: '10px', textAlign: 'right' }}>
        {loginUser
          ? <>{loginUser.userName} <button onClick={handleLogout}>Logout</button></>
          : <button onClick={() => navigate('/login')}>Login</button>}
      </div>

      {/* admin: switch between menu and user pages */}
      {isAdmin && (
        <div style={{ textAlign: 'right', padding: '10px' }}>
          <button onClick={() => setAdminView(adminView === 'menu' ? 'user' : 'menu')}>
            {adminView === 'menu' ? 'user' : 'menu'}
          </button>
        </div>
      )}

      {/* admin: user page (change user role) */}
      {isAdmin && adminView === 'user' ? (
        <div>
          <h1>User</h1>
          <ul>
            {userList.map((u) => (
              <li key={u.userId}>
                {u.userName} {u.email}{' '}
                <select value={u.role} onChange={(e) => changeRole(u.userId, e.target.value)}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1>{isAdmin ? 'Our Menu' : 'Our menu'}</h1>
          <ul>
            {foodList.map((item) => (
              <li key={item.menuId}>
                {item.name}
                {!isAdmin && (
                  <> (⭐{item.avgRating ? Number(item.avgRating).toFixed(1) : '-'})</>
                )}
                {' '}- {item.price} baht {item.isBestSeller ? "🏅" : ""}
                {isUser && (
                  <>
                    {' '}Choose rating:{' '}
                    <select defaultValue="5" onChange={(e) => rateFood(item.menuId, e.target.value)}>
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </>
                )}
                {isAdmin && <button onClick={() => deleteFood(item.menuId)}>Del</button>}
              </li>
            ))}
          </ul>

          {/* admin: add product */}
          {isAdmin && <FoodForm addFood={addFood} typeList={typeList} />}
        </div>
      )}
    </div>
  )
}

export default Home
