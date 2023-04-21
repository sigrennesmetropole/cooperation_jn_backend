import { type SessionData } from 'express-session'

export interface MySessionData extends SessionData {
  state?: string
  prm?: string
}
