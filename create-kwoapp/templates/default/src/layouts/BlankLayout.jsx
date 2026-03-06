import { Outlet } from 'react-router-dom'
import styles from './BlankLayout.module.css'

function BlankLayout() {
  return (
    <div className={styles.wrap}>
      <Outlet />
    </div>
  )
}

export default BlankLayout