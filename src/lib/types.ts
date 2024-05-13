import {
  Prisma,
  Role,
} from '@prisma/client'
import {
  getMedia,
} from './queries'

export type NotificationWithUser =
  | ({
    User: {
      id: string
      name: string
      avatarUrl: string
      email: string
      createdAt: Date
      updatedAt: Date
      role: Role
      agencyId: string | null
    }
  } & Notification)[]
  | undefined

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput

export type Address = {
  city: string
  country: string
  line1: string
  postal_code: string
  state: string
}
