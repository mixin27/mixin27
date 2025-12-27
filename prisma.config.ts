import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
    schema: 'src/lib/prisma/schema.prisma',
    migrations: {
        path: 'src/lib/prisma/migrations',
        seed: 'tsx src/lib/prisma/seed.ts',
    },
    datasource: {
        url: env('PRISMA_DATABASE_URL'),
    },
})
