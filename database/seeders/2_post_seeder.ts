import Post from '#models/post'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    await Post.createMany([
      {
        id: 1,
        userId: 1,
        title: 'Restaurant Le Jules Verne',
        categoryId: 1,
        price: 120,
        description:
          "Dînez dans ce restaurant gastronomique avec une vue imprenable sur Paris, situé au deuxième étage de la Tour Eiffel. Profitez d'une cuisine raffinée et innovante, créée par des chefs de renom, tout en admirant la ville lumière.",
        location: 'Tour Eiffel, 2nd floor, Avenue Gustave Eiffel, 75007 Paris, France',
        geoloc: db.raw("ST_SetSRID(ST_GeomFromText('POINT(2.294844 48.857739)'), 4326)"),
        latitude: 48.857739,
        longitude: 2.294844,
      },
      {
        id: 2,
        userId: 1,
        title: 'Le Meilleur Bistrot',
        categoryId: 1,
        price: 30,
        description:
          'Un bistrot parisien traditionnel offrant une expérience culinaire authentique avec des plats préparés à partir des ingrédients les plus frais. Dégustez nos spécialités telles que le coq au vin et la bouillabaisse, le tout dans une ambiance chaleureuse et conviviale.',
        location: '12 Rue de Rivoli, 75001 Paris, France',
        geoloc: db.raw(
          "ST_SetSRID(ST_GeomFromText('POINT(2.355010986328125 48.856712341308594)'), 4326)"
        ),
        latitude: 48.856712341308594,
        longitude: 2.355010986328125,
      },
      {
        id: 3,
        userId: 1,
        title: 'Musée du Louvre',
        categoryId: 2,
        price: 17,
        description:
          "Explorez l'un des plus grands et célèbres musées du monde. Abritant des milliers d'œuvres d'art, dont la Mona Lisa et la Vénus de Milo, le Louvre offre une plongée fascinante dans l'histoire de l'art à travers les âges. Idéal pour les amateurs d'art et les curieux.",
        location: 'Rue de Rivoli, 75001 Paris, France',
        geoloc: db.raw("ST_SetSRID(ST_GeomFromText('POINT(2.3324752 48.8636282)'), 4326)"),
        latitude: 48.8636282,
        longitude: 2.3324752,
      },
      {
        id: 4,
        userId: 1,
        title: 'La Boutique de Chocolat',
        categoryId: 3,
        price: 15,
        description:
          'Dégustez des chocolats artisanaux dans cette boutique renommée, connue pour ses créations uniques et ses saveurs exquises. Parfait pour les gourmands et ceux qui souhaitent offrir un cadeau délicieux à leurs proches.',
        location: '25 Rue Saint-Honoré, 75001 Paris, France',
        geoloc: db.raw(
          "ST_SetSRID(ST_GeomFromText('POINT(2.3345255851745605 48.86369323730469)'), 4326)"
        ),
        latitude: 48.86369323730469,
        longitude: 2.3345255851745605,
      },
      {
        id: 5,
        userId: 1,
        title: 'Pâtisserie Pierre Hermé',
        categoryId: 2,
        price: 17,
        description:
          "Découvrez les macarons et pâtisseries raffinées de Pierre Hermé, célèbre pour ses créations innovantes et ses saveurs délicates. Un incontournable pour les amateurs de pâtisserie fine à la recherche de l'excellence culinaire.",
        location: '72 Rue Bonaparte, 75006 Paris, France',
        geoloc: db.raw("ST_SetSRID(ST_GeomFromText('POINT(2.332814 48.851543)'), 4326)"),
        latitude: 48.851543,
        longitude: 2.332814,
      },
      {
        id: 6,
        userId: 1,
        title: 'Palais Garnier',
        categoryId: 1,
        price: 14,
        description:
          "Visitez l'opéra historique de Paris avec son architecture magnifique, ses plafonds peints par Chagall, et ses escaliers majestueux. Assistez à une représentation ou profitez d'une visite guidée pour découvrir ce chef-d'œuvre architectural.",
        location: '8 Rue Scribe, 75009 Paris, France',
        geoloc: db.raw("ST_SetSRID(ST_GeomFromText('POINT(2.331232 48.872666)'), 4326)"),
        latitude: 48.872666,
        longitude: 2.331232,
      },
      {
        id: 7,
        userId: 1,
        title: 'Carnaval de Nice',
        categoryId: 2,
        price: 0,
        description:
          'Un des plus grands carnavals de France avec des défilés spectaculaires, des chars magnifiquement décorés, et des batailles de fleurs. Une expérience inoubliable pour tous les âges, célébrant la joie et la culture locale.',
        location: 'Place Masséna, 06000 Nice, France',
        geoloc: db.raw("ST_SetSRID(ST_GeomFromText('POINT(7.2703241 43.6969486)'), 4326)"),
        latitude: 43.6969486,
        longitude: 7.2703241,
      },
      {
        id: 8,
        userId: 1,
        title: 'Soirée Électro au Rex Club',
        description:
          'Dansez toute la nuit au son de la musique électro dans ce club iconique de Paris, accueillant des DJ de renommée mondiale. Une destination prisée par les amateurs de musique électronique et les fêtards.',
        categoryId: 3,
        price: 20,
        location: '5 Boulevard Poissonnière, 75002 Paris, France',
        geoloc: db.raw(
          "ST_SetSRID(ST_GeomFromText('POINT(2.3455817699432373 48.871070861816406)'), 4326)"
        ),
        longitude: 2.3455817699432373,
        latitude: 48.871070861816406,
      },
      {
        id: 9,
        userId: 1,
        title: 'Boulangerie Poilâne',
        description:
          'Savourez le pain traditionnel et les viennoiseries de cette boulangerie renommée, connue pour son pain au levain et ses délicieux sablés. Un lieu incontournable pour les amateurs de boulangerie artisanale.',
        categoryId: 2,
        price: 10,
        location: '8 Rue du Cherche-Midi, 75006 Paris, France',
        geoloc: db.raw("ST_SetSRID(ST_GeomFromText('POINT(2.32898 48.851286)'), 4326)"),
        longitude: 2.32898,
        latitude: 48.851286,
      },
    ])
  }
}
