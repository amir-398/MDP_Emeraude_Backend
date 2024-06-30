/**
 * @register
 * @summary Register a new user
 * @tag Auth
 * @description Registers a new user, uploads profile image, and creates tokens
 * @operationId register
 * @requestBody {"email": "amir.399@hotmail.fr", "password": "Azerty23@", "firstname": "Amir", "lastname": "Meberbeche", "birthDate" : "1998-03-30", "profilImage": "image.jpg"}
 * @responseBody 201 - {"token": "string", "streamToken": "string"} - Returns JWT and stream tokens
 * @responseBody 400 - {"message": "string"} - Failed to upload image or add user to stream
 * @responseBody 401 - {"message": "string"} - Validation error or transaction failure
 */
export const register = {}
