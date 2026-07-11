"use client"

import { Contract } from "@/types/invoice" // Using Contract type from invoice types for now
import { formatDate } from "@/lib/utils"

interface ContractPreviewProps {
    contract: Contract
}

export function ContractPreview({ contract }: ContractPreviewProps) {
    return (
        <div className="bg-white text-black p-8 md:p-12 rounded-lg shadow-lg print:shadow-none print:rounded-none max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-2 uppercase">
                    {contract.templateName}
                </h1>
                <p className="text-gray-600">Contract #{contract.contractNumber}</p>
            </div>

            <div className="prose max-w-none mb-12">
                <div dangerouslySetInnerHTML={{ __html: contract.generatedContent }} />
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 pt-8 border-t">
                {/* Client Signature */}
                <div>
                    <h3 className="font-bold mb-4">Client Signature</h3>
                    <div className="border-b-2 border-gray-300 min-h-[100px] mb-2 flex items-end">
                        {contract.clientSignature ? (
                            contract.clientSignatureType === 'drawn' ? (
                                <img src={contract.clientSignature} alt="Client Signature" className="max-h-24" />
                            ) : (
                                <p className="font-cursive text-2xl pb-2">{contract.clientSignature}</p>
                            )
                        ) : (
                            <p className="text-gray-400 text-sm pb-2 italic">Awaiting signature</p>
                        )}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold">{contract.client.name}</p>
                        <p className="text-gray-500">Date: {contract.signatureDate ? formatDate(contract.signatureDate) : '_________________'}</p>
                    </div>
                </div>

                {/* Business Signature */}
                <div>
                    <h3 className="font-bold mb-4">Service Provider Signature</h3>
                    <div className="border-b-2 border-gray-300 min-h-[100px] mb-2 flex items-end">
                        {contract.businessSignature ? (
                            contract.businessSignatureType === 'drawn' ? (
                                <img src={contract.businessSignature} alt="Business Signature" className="max-h-24" />
                            ) : (
                                <p className="font-cursive text-2xl pb-2">{contract.businessSignature}</p>
                            )
                        ) : (
                            <p className="text-gray-400 text-sm pb-2 italic">Awaiting signature</p>
                        )}
                    </div>
                    <div className="text-sm">
                        {/* We might need to fetch business name if not embedded, for now assume it's generic or from a context if available, but Contract model doesn't link to settings directly. */}
                        <p className="font-semibold">Authorized Representative</p>
                        <p className="text-gray-500">Date: {contract.signatureDate ? formatDate(contract.signatureDate) : '_________________'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
