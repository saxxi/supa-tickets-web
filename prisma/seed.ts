import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      id: '1',
      name: 'John Doe',
      avatarUrl: 'https://gravatar.com/avatar/441e456eb8f2042235924103124678c4?s=400&d=robohash&r=x',
      email: 'johndoe@example.com',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
