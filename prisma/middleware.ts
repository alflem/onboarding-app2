import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$extends({
  query: {
    async $allOperations({ model, operation, args, query }: { model: string; operation: string; args: any; query: (args: any) => Promise<any> }) {
      if (model === 'Organization') {
        if (operation === 'create') {
          const result = await query(args);
          await prisma.checklist.create({
            data: {
              name: 'Default Checklist',
              items: [],
              organizationId: result.id,
            },
          });
          return result;
        }

        if (operation === 'delete') {
          const organizationId = args.where.id;
          await prisma.checklist.deleteMany({
            where: { organizationId },
          });
          return query(args);
        }
      }
      return query(args);
    },
  },
});

export default prisma;