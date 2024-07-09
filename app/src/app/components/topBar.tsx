import React from 'react'
import { css } from 'styled-system/css'
import { hstack, vstack } from 'styled-system/patterns'
import FullLogo from './fullLogo'
import UserMenu from './userMenu'

function Navbar() {
  
  return (
    <nav className={css({ bg: "ui.background" })}>
      <div className={hstack({ maxWidth: "", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", mx: "auto", p: 4 })}>
        <FullLogo />
        <div className={hstack({ alignItems: "center", justifyContent: "flex-end", w: "full", md: { flex: 1, w: "auto" } })} id="navbar-user">
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}

export default Navbar