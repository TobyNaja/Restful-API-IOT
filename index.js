import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

let students = [
  {
    id: 1,
    firstName: 'พรพิพัฒน์',
    lastName: 'ลลิตวิภาส',
    studentId: '67070109',
    birthDate: '2006-02-01',
    gender: 'ชาย'
  }
]
let nextId = 2

app.get('/', (c) => c.text('Student API is running'))

app.get('/students', (c) => {
  return c.json(students)
})

app.get('/students/:id', (c) => {
  const id = Number(c.req.param('id'))
  const student = students.find((s) => s.id === id)
  if (!student) return c.json({ message: 'ไม่พบนักศึกษา' }, 404)
  return c.json(student)
})

app.post('/students', async (c) => {
  const body = await c.req.json()
  const { firstName, lastName, studentId, birthDate, gender } = body
  if (!firstName || !lastName || !studentId || !birthDate || !gender) {
    return c.json({ message: 'กรุณากรอกข้อมูลให้ครบ' }, 400)
  }

  const student = { id: nextId++, firstName, lastName, studentId, birthDate, gender }
  students.push(student)
  return c.json(student, 201)
})

app.put('/students/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const index = students.findIndex((s) => s.id === id)
  if (index === -1) return c.json({ message: 'ไม่พบนักศึกษา' }, 404)

  const body = await c.req.json()
  students[index] = { ...students[index], ...body, id }
  return c.json(students[index])
})

app.delete('/students/:id', (c) => {
  const id = Number(c.req.param('id'))
  const student = students.find((s) => s.id === id)
  if (!student) return c.json({ message: 'ไม่พบนักศึกษา' }, 404)

  students = students.filter((s) => s.id !== id)
  return c.json({ message: 'ลบข้อมูลเรียบร้อย', student })
})

const port = Number(process.env.PORT) || 3001
serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0'
})
console.log(`Server running on port ${port}`)
