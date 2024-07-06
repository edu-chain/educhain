import React from 'react'
import { css } from 'styled-system/css'
import { hstack, vstack } from 'styled-system/patterns'
import FullLogo from './fullLogo'
import UserMenu from './userMenu'

function Navbar() {
  
  return (
    <nav className={css({ bg: "white", _dark: { bg: "gray.900" } })}>
      <div className={hstack({ maxWidth: "", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", mx: "auto", p: 4 })}>
        <FullLogo />
        <div className={hstack({ alignItems: "center", justifyContent: "space-between", w: "full", md: { flex: 1, w: "auto" } })} id="navbar-user">
          <ul className={hstack({ flexDir: { base: "column", md: "row" }, fontWeight: "medium", p: { base: 4, md: 0 }, mt: { base: 4, md: 0 }, roundedLeft: "g", bg: { base: "gray.50", md: "transparent" }, _dark: { bg: { base: "gray.800", md: "transparent" } } })}>
            <li>
              <a href="#" className={css({ py: 2, px: 3, color: "white", bg: "blue.700", rounded: "0.25rem", md: { bg: "transparent", color: "blue.700", p: 0 } })} aria-current="page">Home</a>
            </li>
            <li>
              <a href="#" className={css({ py: 2, px: 3, color: "gray.900", rounded: "0.25rem", _hover: { bg: "gray.100" }, md: { p: 0 }, _dark: { color: "white" } })}>About</a>
            </li>
            <li>
              <a href="#" className={css({ py: 2, px: 3, color: "gray.900", rounded: "0.25rem", _hover: { bg: "gray.100" }, md: { p: 0 }, _dark: { color: "white" } })}>Services</a>
            </li>
            <li>
              <a href="#" className={css({ py: 2, px: 3, color: "gray.900", rounded: "0.25rem", _hover: { bg: "gray.100" }, md: { p: 0 }, _dark: { color: "white" } })}>Pricing</a>
            </li>
            <li>
              <a href="#" className={css({ py: 2, px: 3, color: "gray.900", rounded: "0.25rem", _hover: { bg: "gray.100" }, md: { p: 0 }, _dark: { color: "white" } })}>Contact</a>
            </li>
          </ul>
          <UserMenu />
        </div>
      </div>
    </nav>
  )
}

export default Navbar