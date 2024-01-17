import { PrismaClient } from '@prisma/client';
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
