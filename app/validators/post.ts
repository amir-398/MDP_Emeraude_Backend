import vine from '@vinejs/vine'

export const postValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
    title: vine.string().minLength(5).maxLength(255).trim().escape(),
    categoryId: vine.number().positive(),
    SubCategoryId: vine.number().positive().nullable(),
    price: vine.number().positive(),
    description: vine.string().minLength(10).maxLength(1000).trim().escape(),
    location: vine.string().minLength(5).maxLength(255).trim().escape(),
    geolocation: vine.string().minLength(5).maxLength(255).trim().escape(),
  })
)
