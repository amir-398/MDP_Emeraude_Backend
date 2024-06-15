import vine from '@vinejs/vine'
export const postGradeController = vine.compile(
  vine.object({
    grade: vine.number().positive().max(5).min(0),
  })
)

export const postIdParamValidator = vine.compile(
  vine.object({
    postId: vine.number().positive(),
  })
)
