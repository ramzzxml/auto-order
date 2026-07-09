import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      storeName: process.env.STORE_NAME || "Auto Order Store"
    }
  });

  const product = await prisma.product.upsert({
    where: { slug: "netflix-premium-1-bulan" },
    update: {},
    create: {
      name: "Netflix Premium 1 Bulan",
      slug: "netflix-premium-1-bulan",
      description:
        "Akun Netflix Premium sharing 1 bulan, kualitas Ultra HD 4K, bisa dipakai di 1 profil.",
      price: 25000,
      thumbnail:
        "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
      active: true
    }
  });

  const existingStock = await prisma.productStock.count({
    where: { productId: product.id }
  });

  if (existingStock === 0) {
    await prisma.productStock.createMany({
      data: [
        { productId: product.id, content: "email: demo1@mail.com | password: demoPass1!" },
        { productId: product.id, content: "email: demo2@mail.com | password: demoPass2!" },
        { productId: product.id, content: "email: demo3@mail.com | password: demoPass3!" }
      ]
    });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
