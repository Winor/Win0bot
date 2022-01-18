import { Prisma, PrismaClient, Store, User } from '@prisma/client'
import config from './config'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.dbUrl
    }
  }
})

export const action = prisma

export function createUser(user: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({data: user})
}

export function findUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return prisma.user.findUnique({
        where: where
      })
}

export function deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return prisma.user.delete({
        where: where
      })
}

export function createStore(UserId: number, name: string, data: Prisma.InputJsonValue ):  Promise<Store> {
    return prisma.store.create({
        data: {
            botUserId: UserId,
            name: name,
            data: data
        }
      })
    }

    
export function updateStore(id: number, name: string, data: Prisma.InputJsonValue ):  Promise<Store> {
    return prisma.store.update({
      where: {
        id: id,
      },
      data: {
        data: data
      }
    })
  }

export function findStore(botUserId: number, name: string,): Promise<Store | null> {
    return prisma.store.findFirst({
      where: {
        name: name,
        user: {
            id: botUserId
          }
        },
      })
}

interface StoreWithUser extends Store {
  user: User
}

export function getAllStore(name: string): Promise<StoreWithUser[] | null> {
  return prisma.store.findMany({
    where: {
      name: name
    },
    include: {
      user: true
    }
  })
}
