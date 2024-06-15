import vine from '@vinejs/vine'

export const postValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(5).maxLength(255).trim().escape(),
    categoryId: vine.number().positive(),
    SubCategoryId: vine.number().positive().optional(),
    price: vine.number().positive(),
    description: vine.string().minLength(10).maxLength(1000).trim().escape(),
    location: vine.string().minLength(5).maxLength(255).trim().escape(),
    geoloc: vine.string().minLength(5).maxLength(255).trim().escape(),
    images: vine.array(vine.file({ extnames: ['jpg', 'jpeg', 'png', 'webp'], size: '5mb' })),
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(5).maxLength(255).trim().escape().optional(),
    categoryId: vine.number().positive().optional(),
    SubCategoryId: vine.number().positive().optional(),
    price: vine.number().positive().optional(),
    description: vine.string().minLength(10).maxLength(1000).trim().escape().optional(),
    location: vine.string().minLength(5).maxLength(255).trim().escape().optional(),
    geoloc: vine.string().minLength(5).maxLength(255).trim().escape().optional(),
  })
)
