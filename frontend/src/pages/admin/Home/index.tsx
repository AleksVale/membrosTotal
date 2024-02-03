import React from 'react'
import { Link } from 'react-router-dom'

export function Home() {
  return <Link to={'/admin/user'}>Usuario</Link>
}
