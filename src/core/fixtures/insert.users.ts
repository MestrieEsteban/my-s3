import { mlog } from '@/core/libs/utils'
import User from '../models/User'

const users = [
  {
    nickname: 'Esteban',
    email: 'esteban94.em@gmail.com',
    password: 'test',
  },

  {
    nickname: 'Test',
    email: 'test@test.com',
    password: 'test',
  },
]

export async function addUser(): Promise<never | void> {
  //   for (const u of users) {
  //     const user = new User()

  //     user.nickname = u.nickname
  //     user.email = u.email
  //     user.password = u.password

  //     await user.save().then(() => {
  //       mlog(`${u.nickname} inserted on database`, 'success')
  //     })
  //   }
  return
}
