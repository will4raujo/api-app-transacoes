import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {name: 'Alimentação', type: 'predefined' },
  {name: 'Transporte', type: 'predefined' },
  {name: 'Moradia', type: 'predefined' },
  {name: 'Saúde', type: 'predefined' },
  {name: 'Educação', type: 'predefined' },
  {name: 'Lazer e Entretenimento', type: 'predefined' },
  {name: 'Roupas e Acessórios', type: 'predefined' },
  {name: 'Beleza e Cuidados Pessoais', type: 'predefined' },
  {name: 'Seguros', type: 'predefined' },
  {name: 'Dívidas e Empréstimos', type: 'predefined' },
  {name: 'Impostos e Taxas', type: 'predefined' },
  {name: 'Presentes e Doações', type: 'predefined' },
  {name: 'Emergência e Fundo de Reserva', type: 'predefined' },
  {name: 'Outros', type: 'predefined' },
];

async function main() {
  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        type: category.type,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });