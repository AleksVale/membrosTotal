import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const profiles = [
    { label: 'Administrador', name: 'admin' },
    { label: 'Colaborador', name: 'employee' },
    { label: 'Expert', name: 'expert' },
  ];

  const defaultRefundTypes = [
    { label: 'Transporte' },
    { label: 'Alimentação' },
    { label: 'Outros' },
  ];

  const defaultPaymentRequest = [
    { label: 'Ferramentas' },
    { label: 'Mobília' },
    { label: 'Utensílios' },
    { label: 'Outros' },
  ];

  const defaultPaymentTypes = [
    { label: 'Recorrência mensal fixa' },
    { label: 'Recorrência mensal variável' },
    { label: 'Prestação de serviço pontual' },
    { label: 'Prestação de serviço variável' },
    { label: 'Outros' },
  ];
  for (const profile of profiles) {
    const existingProfile = await prisma.profile.findFirst({
      where: { name: profile.name },
    });

    if (!existingProfile) {
      await prisma.profile.create({ data: profile });
    }
  }

  for (const payment of defaultPaymentTypes) {
    const existingProfile = await prisma.paymentType.findFirst({
      where: { label: payment.label },
    });

    if (!existingProfile) {
      await prisma.paymentType.create({
        data: payment,
      });
    }
  }

  for (const refund of defaultRefundTypes) {
    const existingProfile = await prisma.refundType.findFirst({
      where: { label: refund.label },
    });

    if (!existingProfile) {
      await prisma.refundType.create({
        data: refund,
      });
    }
  }

  for (const request of defaultPaymentRequest) {
    const existingProfile = await prisma.paymentRequestType.findFirst({
      where: { label: request.label },
    });

    if (!existingProfile) {
      await prisma.paymentRequestType.create({
        data: request,
      });
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
