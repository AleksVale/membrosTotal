import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div>
      <Link to={'/admin/user'}>
        <p>Teste do Vitor</p>
      </Link>
    </div>
  )
}
