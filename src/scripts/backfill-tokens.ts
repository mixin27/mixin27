import prisma from '@/lib/prisma'
import { v7 as uuidv7 } from 'uuid'

async function main() {
    console.log('Backfilling tokens...')

    const invoices = await prisma.invoice.findMany({ where: { token: null } })
    for (const invoice of invoices) {
        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { token: uuidv7() },
        })
    }
    console.log(`Updated ${invoices.length} invoices`)

    const quotations = await prisma.quotation.findMany({ where: { token: null } })
    for (const quotation of quotations) {
        await prisma.quotation.update({
            where: { id: quotation.id },
            data: { token: uuidv7() },
        })
    }
    console.log(`Updated ${quotations.length} quotations`)

    const receipts = await prisma.receipt.findMany({ where: { token: null } })
    for (const receipt of receipts) {
        await prisma.receipt.update({
            where: { id: receipt.id },
            data: { token: uuidv7() },
        })
    }
    console.log(`Updated ${receipts.length} receipts`)

    const contracts = await prisma.contract.findMany({ where: { token: null } })
    for (const contract of contracts) {
        await prisma.contract.update({
            where: { id: contract.id },
            data: { token: uuidv7() },
        })
    }
    console.log(`Updated ${contracts.length} contracts`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
