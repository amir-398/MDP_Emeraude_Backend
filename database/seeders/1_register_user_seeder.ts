import Profile from '#models/profile'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        id: 1,
        email: 'amir.398@hotmail.fr',
        password: 'Hicsof30@',
      },
      {
        id: 2,
        email: 'amir.399@hotmail.fr',
        password: 'Hicsof30@',
      },
      {
        id: 3,
        email: 'amir.397@hotmail.fr',
        password: 'Hicsof30@',
      },
      {
        id: 4,
        email: 'amir.396@hotmail.fr',
        password: 'Hicsof30@',
      },
    ])

    await Profile.createMany([
      {
        id: 1,
        userId: 1,
        firstname: 'amir',
        lastname: 'Meberbeche',
        profilImage: 'e969c50242fa5c161a9973ffb2494bad.jpg',
        birthDate: new Date('1996-03-30'),
      },
      {
        id: 2,
        userId: 2,
        firstname: 'Hichem',
        lastname: 'Bennacer',
        profilImage: 'e969c50242fa5c161a9973ffb2494bad.jpg',
        birthDate: new Date('1965-10-26'),
      },
      {
        id: 3,
        userId: 3,
        firstname: 'Victoria',
        lastname: 'Manceau',
        profilImage: 'e969c50242fa5c161a9973ffb2494bad.jpg',
        birthDate: new Date('2001-10-05'),
      },
      {
        id: 4,
        userId: 4,
        firstname: 'Fouad',
        lastname: 'Qurai',
        profilImage: 'e969c50242fa5c161a9973ffb2494bad.jpg',
        birthDate: new Date('1952-12-30'),
      },
    ])
  }
}
