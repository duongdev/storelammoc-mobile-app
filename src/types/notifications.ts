export interface DeviceUserData {
  /** MongoDB `user.id`. */
  id: string
  /** Username (`user.username`). */
  username: string
  /** User's full name (`user.name`). */
  name?: string
  /** User's phone number (`user.phone`). */
  phone?: string
}
