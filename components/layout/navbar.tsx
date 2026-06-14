import React from 'react'

export default function Navbar() {
  return (
    <nav>
      <ul className="flex flex-row gap-4">
        <li>Hero</li>
        <li>About</li>
        <li>Skills</li>
        <li>Technologies</li>
        {/* <li>Experience</li> */}
        <li>Projects</li>
        <li>Hire Me</li>
        <li>Contact</li>
      </ul>
    </nav>
  )
}
