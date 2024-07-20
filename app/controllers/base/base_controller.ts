export default class BaseController {
  // This method is used to handle the authorization logic
  handleAuthorization(response, bouncer, policy, action) {
    if (bouncer.with(policy).denies(action)) {
      return response.badRequest({ message: "You don't have the rights to perform this action" })
    }
  }
}
