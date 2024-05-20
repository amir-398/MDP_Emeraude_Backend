import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        firstname: 'Amir',
        lastname: 'Meberbeche',
        email: 'amir.398@hotmail.fr',
        password: 'Hicsof30@',
        birthdate: new Date('1998-03-30'),
        profilImageName: 't9go7vzyt4x5i4nnogee6kje.jpg',
      },
      {
        firstname: 'John',
        lastname: 'Doe',
        email: 'amir.399@hotmail.fr',
        password: 'Hicsof30@',
        birthdate: new Date('1995-06-26'),
        profilImageName: 't9go7vzyt4x5i4nnogee6kje.jpg',
      },
      {
        firstname: 'Fouad',
        lastname: 'Meb',
        email: 'amir.397@hotmail.fr',
        password: 'Hicsof30@',
        birthdate: new Date('2001-09-10'),
        profilImageName: 't9go7vzyt4x5i4nnogee6kje.jpg',
      },
      {
        firstname: 'Hichem',
        lastname: 'Mebus',
        email: 'amir.396@hotmail.fr',
        password: 'Hicsof30@',
        birthdate: new Date('1952-12-25'),
        profilImageName: 't9go7vzyt4x5i4nnogee6kje.jpg',
      },
    ])
  }
}
