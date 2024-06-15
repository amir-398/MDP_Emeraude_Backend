import vine from '@vinejs/vine'
export const postCommentValidator = vine.compile(
  vine.object({
    content: vine.string().minLength(1).maxLength(1000),
  })
)

export const postIdParamValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
  })
)
