'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserForm } from '@/components/users/user-form'
import http from '@/lib/http'
import { toast } from 'react-toastify'

export default function EditUserPage() {
  const params = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await http.get(`/user/${params.id}`)
        setUser(response.data)
      } catch {
        toast.error('Não foi possível carregar os dados do usuário')
      } finally {
        setLoading(false)   
      }
    }

    fetchUser()
  }, [params.id, toast])

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
        <p className="text-muted-foreground">
          Edite as informações do usuário
        </p>
      </div>

      <Card>
        <CardHeader>    
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm initialData={user || undefined} userId={Number(params.id)} />
        </CardContent>
      </Card>
    </div>
  )
} 