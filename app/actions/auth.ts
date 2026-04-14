'use server'

import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/auth-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function login(prevState: string | null, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return 'メールアドレスとパスワードを入力してください'

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return 'メールアドレスまたはパスワードが違います'

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return 'メールアドレスまたはパスワードが違います'

  await createSession({ userId: user.id, name: user.name, role: user.role })
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!name || !email || !password) return

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { name, email, password: hashed, role } })
  revalidatePath('/users')
}

export async function deleteUser(id: number) {
  await prisma.user.delete({ where: { id } })
  revalidatePath('/users')
}
