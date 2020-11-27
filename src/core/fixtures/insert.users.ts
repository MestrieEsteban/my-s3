import User from '../models/User'

const users = [
  {
    firstname: 'Esteban',
    lastname: 'Mestrie',
    email: 'esteban94.em@gmail.com',
    password: 'test',
  },

  {
    firstname: 'Test',
    lastname: 'Test',
    email: 'test@test.com',
    password: 'test',
  },
]

export async function addUser(): Promise<never | void> {
  for (const u of users) {
    const user = new User()

    user.firstname = u.firstname
    user.lastname = u.lastname
    user.email = u.email
    user.password = u.password

    await user.save()
  }
}
