import { ContractTemplate } from '@/types/invoice'

export const contractTemplates: ContractTemplate[] = [
  {
    id: 'service_agreement',
    name: 'Service Agreement',
    description: 'General service agreement for ongoing freelance work',
    requiredFields: [
      'businessName',
      'clientName',
      'projectName',
      'projectScope',
      'deliverables',
      'startDate',
      'endDate',
      'projectFee',
      'paymentTerms',
    ],
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">SERVICE AGREEMENT</h1>

        <p style="margin-bottom: 20px;">This Service Agreement ("Agreement") is entered into as of <strong>{{signatureDate}}</strong> by and between:</p>

        <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd;">
          <p><strong>SERVICE PROVIDER:</strong><br/>
          {{businessName}}<br/>
          {{businessAddress}}<br/>
          {{businessEmail}}<br/>
          {{businessPhone}}</p>
        </div>

        <p style="margin-bottom: 10px;">AND</p>

        <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd;">
          <p><strong>CLIENT:</strong><br/>
          {{clientName}}<br/>
          {{clientAddress}}<br/>
          {{clientEmail}}<br/>
          {{clientPhone}}</p>
        </div>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">1. PROJECT DESCRIPTION</h2>
        <p><strong>Project Name:</strong> {{projectName}}</p>
        <p><strong>Scope of Work:</strong></p>
        <p style="white-space: pre-wrap; margin-left: 20px;">{{projectScope}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">2. DELIVERABLES</h2>
        <p style="white-space: pre-wrap; margin-left: 20px;">{{deliverables}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">3. TERM</h2>
        <p>This Agreement shall commence on <strong>{{startDate}}</strong> and continue until <strong>{{endDate}}</strong>, unless terminated earlier in accordance with the provisions of this Agreement.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">4. COMPENSATION</h2>
        <p>Client agrees to pay Service Provider a total fee of <strong>{{currency}} {{projectFee}}</strong> for the services described herein.</p>
        <p><strong>Payment Terms:</strong> {{paymentTerms}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">5. INTELLECTUAL PROPERTY</h2>
        <p>Upon receipt of full payment, all intellectual property rights in the deliverables shall transfer to the Client. Service Provider retains the right to use the work in their portfolio.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">6. CONFIDENTIALITY</h2>
        <p>Both parties agree to maintain confidentiality of any proprietary or sensitive information shared during the course of this engagement.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">7. TERMINATION</h2>
        <p>Either party may terminate this Agreement with 14 days written notice. In the event of termination, Client shall pay for all work completed up to the date of termination.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">8. INDEPENDENT CONTRACTOR</h2>
        <p>Service Provider is an independent contractor and not an employee of Client. Service Provider is responsible for all taxes and insurance.</p>

        <div style="margin-top: 60px;">
          <div style="margin-bottom: 60px;">
            <p><strong>SERVICE PROVIDER:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{businessSignature}}
            </div>
            <p>{{businessName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>

          <div>
            <p><strong>CLIENT:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{clientSignature}}
            </div>
            <p>{{clientName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'project_contract',
    name: 'Fixed-Price Project Contract',
    description:
      'Contract for one-time fixed-price projects with specific deliverables',
    requiredFields: [
      'businessName',
      'clientName',
      'projectName',
      'projectScope',
      'deliverables',
      'endDate',
      'projectFee',
      'paymentTerms',
    ],
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">PROJECT CONTRACT</h1>

        <p style="margin-bottom: 20px;">This Project Contract ("Contract") is made on <strong>{{signatureDate}}</strong> between:</p>

        <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd;">
          <p><strong>CONTRACTOR:</strong><br/>
          {{businessName}}<br/>
          {{businessAddress}}<br/>
          {{businessEmail}}</p>
        </div>

        <p style="margin-bottom: 10px;">AND</p>

        <div style="margin: 30px 0; padding: 20px; border: 1px solid #ddd;">
          <p><strong>CLIENT:</strong><br/>
          {{clientName}}<br/>
          {{clientAddress}}<br/>
          {{clientEmail}}</p>
        </div>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">PROJECT DETAILS</h2>
        <p><strong>Project:</strong> {{projectName}}</p>
        <p><strong>Description:</strong></p>
        <p style="white-space: pre-wrap; margin-left: 20px;">{{projectScope}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">DELIVERABLES</h2>
        <p style="white-space: pre-wrap; margin-left: 20px;">{{deliverables}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">TIMELINE</h2>
        <p>Project completion date: <strong>{{endDate}}</strong></p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">PAYMENT</h2>
        <p>Total Project Fee: <strong>{{currency}} {{projectFee}}</strong></p>
        <p>Payment Schedule: {{paymentTerms}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">REVISIONS</h2>
        <p>The project fee includes up to 2 rounds of revisions. Additional revisions will be billed separately.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">OWNERSHIP</h2>
        <p>Upon final payment, all rights to the deliverables transfer to the Client.</p>

        <div style="margin-top: 60px;">
          <div style="margin-bottom: 60px;">
            <p><strong>CONTRACTOR:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{businessSignature}}
            </div>
            <p>{{businessName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>

          <div>
            <p><strong>CLIENT:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{clientSignature}}
            </div>
            <p>{{clientName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'freelance_agreement',
    name: 'Freelance Agreement',
    description: 'Comprehensive freelance work agreement',
    requiredFields: [
      'businessName',
      'clientName',
      'projectName',
      'projectScope',
      'deliverables',
      'startDate',
      'projectFee',
      'paymentTerms',
    ],
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">FREELANCE AGREEMENT</h1>

        <p>This Freelance Agreement is entered into on <strong>{{signatureDate}}</strong> between <strong>{{businessName}}</strong> ("Freelancer") and <strong>{{clientName}}</strong> ("Client").</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">1. SERVICES</h2>
        <p><strong>Project:</strong> {{projectName}}</p>
        <p style="white-space: pre-wrap;">{{projectScope}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">2. DELIVERABLES</h2>
        <p style="white-space: pre-wrap;">{{deliverables}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">3. TERM</h2>
        <p>Start Date: <strong>{{startDate}}</strong></p>
        <p>The agreement continues until project completion or termination by either party with 7 days notice.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">4. COMPENSATION</h2>
        <p>Fee: <strong>{{currency}} {{projectFee}}</strong></p>
        <p>Payment Terms: {{paymentTerms}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">5. EXPENSES</h2>
        <p>Any expenses must be pre-approved by Client in writing.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">6. INTELLECTUAL PROPERTY</h2>
        <p>Upon full payment, Client owns all IP rights. Freelancer may showcase work in portfolio.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">7. CONFIDENTIALITY</h2>
        <p>Freelancer agrees to keep all Client information confidential.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">8. WARRANTIES</h2>
        <p>Freelancer warrants that work is original and does not infringe on third-party rights.</p>

        <div style="margin-top: 60px;">
          <div style="margin-bottom: 60px;">
            <p><strong>FREELANCER:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{businessSignature}}
            </div>
            <p>{{businessName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>

          <div>
            <p><strong>CLIENT:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{clientSignature}}
            </div>
            <p>{{clientName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'consulting_agreement',
    name: 'Consulting Agreement',
    description: 'Professional consulting services agreement',
    requiredFields: [
      'businessName',
      'clientName',
      'projectName',
      'projectScope',
      'deliverables',
      'startDate',
      'endDate',
      'projectFee',
      'paymentTerms',
    ],
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">CONSULTING AGREEMENT</h1>

        <p>This Consulting Agreement is made on <strong>{{signatureDate}}</strong> between:</p>

        <p><strong>CONSULTANT:</strong> {{businessName}}</p>
        <p><strong>CLIENT:</strong> {{clientName}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">1. CONSULTING SERVICES</h2>
        <p><strong>Engagement:</strong> {{projectName}}</p>
        <p style="white-space: pre-wrap;">{{projectScope}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">2. DELIVERABLES</h2>
        <p style="white-space: pre-wrap;">{{deliverables}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">3. TERM</h2>
        <p>From: <strong>{{startDate}}</strong> to <strong>{{endDate}}</strong></p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">4. COMPENSATION</h2>
        <p>Consulting Fee: <strong>{{currency}} {{projectFee}}</strong></p>
        <p>Payment Terms: {{paymentTerms}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">5. INDEPENDENT CONTRACTOR</h2>
        <p>Consultant is an independent contractor, not an employee.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">6. CONFIDENTIALITY</h2>
        <p>All information shared remains confidential and proprietary.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">7. NON-COMPETE</h2>
        <p>During the term, Consultant will not engage with direct competitors without disclosure.</p>

        <div style="margin-top: 60px;">
          <div style="margin-bottom: 60px;">
            <p><strong>CONSULTANT:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{businessSignature}}
            </div>
            <p>{{businessName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>

          <div>
            <p><strong>CLIENT:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{clientSignature}}
            </div>
            <p>{{clientName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>
        </div>
      </div>
    `,
  },
  {
    id: 'maintenance_agreement',
    name: 'Maintenance & Support Agreement',
    description: 'Ongoing maintenance and support services contract',
    requiredFields: [
      'businessName',
      'clientName',
      'projectName',
      'projectScope',
      'deliverables',
      'startDate',
      'projectFee',
      'paymentTerms',
    ],
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 30px;">MAINTENANCE & SUPPORT AGREEMENT</h1>

        <p>Agreement Date: <strong>{{signatureDate}}</strong></p>
        <p><strong>Provider:</strong> {{businessName}}</p>
        <p><strong>Client:</strong> {{clientName}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">1. SERVICES</h2>
        <p><strong>System/Application:</strong> {{projectName}}</p>
        <p style="white-space: pre-wrap;">{{projectScope}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">2. SCOPE OF MAINTENANCE</h2>
        <p style="white-space: pre-wrap;">{{deliverables}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">3. TERM</h2>
        <p>Start Date: <strong>{{startDate}}</strong></p>
        <p>This agreement automatically renews monthly unless either party provides 30 days notice.</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">4. FEES</h2>
        <p>Monthly Fee: <strong>{{currency}} {{projectFee}}</strong></p>
        <p>Payment: {{paymentTerms}}</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">5. RESPONSE TIME</h2>
        <p>Critical issues: Within 4 hours</p>
        <p>Non-critical issues: Within 24 hours</p>

        <h2 style="font-size: 18px; margin-top: 30px; margin-bottom: 15px;">6. EXCLUSIONS</h2>
        <p>Major feature additions and redesigns are outside this agreement and will be quoted separately.</p>

        <div style="margin-top: 60px;">
          <div style="margin-bottom: 60px;">
            <p><strong>PROVIDER:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{businessSignature}}
            </div>
            <p>{{businessName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>

          <div>
            <p><strong>CLIENT:</strong></p>
            <div style="border-bottom: 2px solid #000; width: 300px; margin: 30px 0 10px 0; min-height: 50px; display: flex; align-items: flex-end;">
              {{clientSignature}}
            </div>
            <p>{{clientName}}</p>
            <p>Date: {{signatureDate}}</p>
          </div>
        </div>
      </div>
    `,
  },
]

export function getTemplateById(id: string): ContractTemplate | undefined {
  return contractTemplates.find((t) => t.id === id)
}

export function replaceVariables(
  template: string,
  variables: Record<string, string>,
): string {
  let result = template

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value || '')
  })

  return result
}
