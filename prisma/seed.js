import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultModes = [
  {
    name: "Rock Classics",
    playlistId: "37i9dQZF1DWXRqgorJj26U",
  },
  {
    name: "Hip Hop Hits",
    playlistId: "37i9dQZF1DX0XUsuxWHRQd",
  },
  {
    name: "Pop Hits",
    playlistId: "37i9dQZF1DXcBWIGoYBM5M",
  },
];

async function main() {
  for (const mode of defaultModes) {
    await prisma.mode.upsert({
      where: { name: mode.name },
      update: mode,
      create: mode,
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