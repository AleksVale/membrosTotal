import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const profiles = [
    { label: 'Administrador', name: 'admin' },
    { label: 'Colaborador', name: 'employee' },
    { label: 'Expert', name: 'expert' },
  ];

  for (const profile of profiles) {
    const existingProfile = await prisma.profile.findFirst({
      where: { name: profile.name },
    });

    if (!existingProfile) {
      await prisma.profile.create({ data: profile });
    }
  }

  const user = await prisma.user.findFirst({
    where: { email: 'alexalexx3@gmail.com' },
  });
  if (!user) {
    const password = await bcrypt.hash('Alexalexx0', 10);
    await prisma.user.create({
      data: {
        email: 'alexalexx3@gmail.com',
        password,
        birthDate: new Date(),
        firstName: 'Aleks',
        lastName: 'Vale',
        Profile: {
          connect: { name: 'admin' },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
