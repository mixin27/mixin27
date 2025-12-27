import { hash } from 'bcryptjs'
import { PrismaClient } from "../generated/prisma-client/client";

const prisma = new PrismaClient({
    accelerateUrl: process.env.PRISMA_DATABASE_URL!,
});

async function main() {
    const email = process.env.ADMIN_EMAIL!
    const password = process.env.TOOLS_PASSWORD!

    const hashedPassword = await hash(password, 12)

    // Create 5 users
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin',
            password: hashedPassword,
        },
    })
    console.log('Admin user created:', user.email)
    console.log("Seeding completed.");
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
