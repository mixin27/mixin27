'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  FileText,
  Download,
  Save,
  Plus,
  Trash2,
  Eye,
  Edit2,
  DollarSign,
} from 'lucide-react'

const DocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [docType, setDocType] = useState('invoice')
  const [documents, setDocuments] = useState<any>([])
  const [editingDoc, setEditingDoc] = useState<any>(null)
  const printRef = useRef<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    // Document info
    docNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'unpaid',

    // Your details
    yourName: 'Kyaw Zayar Tun',
    yourTitle: 'Developer & Consultant',
    yourPhone: '+95 9953527798',
    yourEmail: 'kyawzayartun.dev@gmail.com',
    yourAddress: 'Yangon, Myanmar',

    // Client details
    clientName: '',
    clientAddress: '',

    // Project details
    projectName: '',
    projectDescription: '',
    servicePeriod: '',

    // Line items
    items: [{ description: '', amount: '' }],

    // Totals
    discount: '',

    // Payment info
    paymentTerms: '',
    paymentMethod: '',
    paymentDate: '',

    // Notes
    notes: '',
  })

  // Load documents from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('freelance_documents')
    if (saved) {
      setDocuments(JSON.parse(saved))
    }
  }, [])

  // Auto-generate document number
  useEffect(() => {
    if (!editingDoc && !formData.docNumber) {
      const prefix = docType === 'invoice' ? 'INV' : 'QUO'
      const year = new Date().getFullYear()
      const count = documents.filter((d: any) => d.type === docType).length + 1
      setFormData((prev) => ({
        ...prev,
        docNumber: `${prefix}-${year}-${String(count).padStart(3, '0')}`,
      }))
    }
  }, [docType, documents, editingDoc, formData.docNumber])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems: any = [...formData.items]
    newItems[index][field] = value
    setFormData((prev) => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', amount: '' }],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const calculateSubtotal = () => {
    return formData.items.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0,
    )
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = parseFloat(formData.discount) || 0
    return subtotal - discount
  }

  const saveDocument = () => {
    const doc = {
      ...formData,
      type: docType,
      id: editingDoc ? editingDoc.id : Date.now(),
      createdAt: editingDoc ? editingDoc.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    let newDocs
    if (editingDoc) {
      newDocs = documents.map((d: any) => (d.id === editingDoc.id ? doc : d))
    } else {
      newDocs = [...documents, doc]
    }

    setDocuments(newDocs)
    localStorage.setItem('freelance_documents', JSON.stringify(newDocs))
    alert(editingDoc ? 'Document updated!' : 'Document saved!')
    setEditingDoc(null)
  }

  const loadDocument = (doc: any) => {
    setFormData(doc)
    setDocType(doc.type)
    setEditingDoc(doc)
    setActiveTab('create')
  }

  const deleteDocument = (id: any) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const newDocs = documents.filter((d: any) => d.id !== id)
      setDocuments(newDocs)
      localStorage.setItem('freelance_documents', JSON.stringify(newDocs))
    }
  }

  const resetForm = () => {
    setFormData({
      docNumber: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'unpaid',
      yourName: 'Kyaw Zayar Tun',
      yourTitle: 'Developer & Consultant',
      yourPhone: '+95 9953527798',
      yourEmail: 'kyawzayartun.dev@gmail.com',
      yourAddress: 'Yangon, Myanmar',
      clientName: '',
      clientAddress: '',
      projectName: '',
      projectDescription: '',
      servicePeriod: '',
      items: [{ description: '', amount: '' }],
      discount: '',
      paymentTerms: '',
      paymentMethod: '',
      paymentDate: '',
      notes: '',
    })
    setEditingDoc(null)
  }

  const exportToPDF = () => {
    window.print()
  }

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('en-US').format(amount) + ' MMK'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Document Generator
                </h1>
                <p className="text-sm text-gray-500">
                  Create invoices & quotations easily
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'create'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Create
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'saved'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Saved ({documents.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'create' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 print:hidden">
              <div className="space-y-6">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setDocType('invoice')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                        docType === 'invoice'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => setDocType('quotation')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                        docType === 'quotation'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Quotation
                    </button>
                  </div>
                </div>

                {/* Document Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Number
                    </label>
                    <input
                      type="text"
                      value={formData.docNumber}
                      onChange={(e) =>
                        handleInputChange('docNumber', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange('date', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {docType === 'invoice' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          handleInputChange('status', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="partial">Partial Payment</option>
                      </select>
                    </div>
                    {formData.status === 'paid' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={formData.paymentDate}
                          onChange={(e) =>
                            handleInputChange('paymentDate', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Client Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Client Details
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={formData.clientName}
                      onChange={(e) =>
                        handleInputChange('clientName', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Client Address"
                      value={formData.clientAddress}
                      onChange={(e) =>
                        handleInputChange('clientAddress', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Project Details
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={formData.projectName}
                      onChange={(e) =>
                        handleInputChange('projectName', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Project Description"
                      value={formData.projectDescription}
                      onChange={(e) =>
                        handleInputChange('projectDescription', e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Service Period (e.g., November 2025 - November 2026)"
                      value={formData.servicePeriod}
                      onChange={(e) =>
                        handleInputChange('servicePeriod', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">
                      Services / Items
                    </h3>
                    <button
                      onClick={addItem}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add Item</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Service description"
                          value={item.description}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              'description',
                              e.target.value,
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Amount (MMK)"
                          value={item.amount}
                          onChange={(e) =>
                            handleItemChange(index, 'amount', e.target.value)
                          }
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formData.items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (MMK)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange('discount', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Payment Info */}
                {docType === 'invoice' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Payment Information
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Payment Method (e.g., KBZ KPay, Wave Money)"
                        value={formData.paymentMethod}
                        onChange={(e) =>
                          handleInputChange('paymentMethod', e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <textarea
                        placeholder="Payment Terms"
                        value={formData.paymentTerms}
                        onChange={(e) =>
                          handleInputChange('paymentTerms', e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={saveDocument}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingDoc ? 'Update' : 'Save'}</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                  {editingDoc && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div
              className="bg-white rounded-lg shadow-sm p-8 print:shadow-none"
              ref={printRef}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase">
                      {docType === 'invoice' ? 'Invoice' : 'Quotation'}
                    </h1>
                    {docType === 'invoice' && formData.status === 'paid' && (
                      <div className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        PAID
                      </div>
                    )}
                    {docType === 'invoice' && formData.status === 'unpaid' && (
                      <div className="inline-block mt-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        UNPAID
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-bold text-lg">
                      {formData.docNumber || 'DOC-XXX-XXX'}
                    </div>
                    <div className="text-gray-600 mt-1">
                      Date: {formData.date}
                    </div>
                    {formData.paymentDate && (
                      <div className="text-gray-600">
                        Payment Date: {formData.paymentDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* From/To Section */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-xs text-gray-500 font-semibold mb-2">
                      FROM:
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-base">
                        {formData.yourName}
                      </div>
                      <div className="text-gray-600">{formData.yourTitle}</div>
                      <div className="text-gray-600">
                        {formData.yourAddress}
                      </div>
                      <div className="text-gray-600">{formData.yourPhone}</div>
                      <div className="text-gray-600">{formData.yourEmail}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-semibold mb-2">
                      {docType === 'invoice' ? 'BILL TO:' : 'PREPARED FOR:'}
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-base">
                        {formData.clientName || 'Client Name'}
                      </div>
                      <div className="text-gray-600">
                        {formData.clientAddress || 'Client Address'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                {(formData.projectName ||
                  formData.projectDescription ||
                  formData.servicePeriod) && (
                  <div className="bg-gray-50 p-4 rounded">
                    {formData.projectName && (
                      <h3 className="font-bold text-gray-900 mb-1">
                        Project: {formData.projectName}
                      </h3>
                    )}
                    {formData.projectDescription && (
                      <p className="text-sm text-gray-600 mb-1">
                        {formData.projectDescription}
                      </p>
                    )}
                    {formData.servicePeriod && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Service Period:</span>{' '}
                        {formData.servicePeriod}
                      </p>
                    )}
                  </div>
                )}

                {/* Items Table */}
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="text-left py-3 px-4 text-sm font-semibold">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map(
                        (item, index) =>
                          item.description && (
                            <tr
                              key={index}
                              className="border-b border-gray-200"
                            >
                              <td className="py-3 px-4 text-sm">
                                {item.description}
                              </td>
                              <td className="py-3 px-4 text-sm text-right">
                                {formatCurrency(item.amount || 0)}
                              </td>
                            </tr>
                          ),
                      )}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="mt-4 ml-auto w-64">
                    <div className="flex justify-between py-2 text-sm">
                      <span className="font-semibold">Subtotal:</span>
                      <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    {formData.discount && parseFloat(formData.discount) > 0 && (
                      <div className="flex justify-between py-2 text-sm">
                        <span className="font-semibold">Discount:</span>
                        <span>-{formatCurrency(formData.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-t-2 border-gray-800 font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {docType === 'invoice' &&
                  (formData.paymentMethod || formData.paymentTerms) && (
                    <div
                      className={`p-4 rounded ${formData.status === 'paid' ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Payment Information
                      </h3>
                      {formData.paymentMethod && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-semibold">Payment Method:</span>{' '}
                          {formData.paymentMethod}
                        </p>
                      )}
                      {formData.paymentTerms && (
                        <p className="text-sm text-gray-700">
                          {formData.paymentTerms}
                        </p>
                      )}
                    </div>
                  )}

                {/* Notes */}
                {formData.notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      Notes:
                    </h3>
                    <p className="text-sm text-gray-600">{formData.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t pt-4 text-center text-sm text-gray-600">
                  <p className="font-semibold">Thank you for your business!</p>
                  <p className="mt-1">
                    For any questions, contact {formData.yourName} at{' '}
                    {formData.yourPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Saved Documents List
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Saved Documents
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your invoices and quotations
              </p>
            </div>
            <div className="divide-y">
              {documents.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No documents saved yet</p>
                  <p className="text-sm mt-1">
                    Create your first document to get started
                  </p>
                </div>
              ) : (
                documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              doc.type === 'invoice'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {doc.type.toUpperCase()}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {doc.docNumber}
                          </span>
                          {doc.type === 'invoice' && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                doc.status === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {doc.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div className="font-medium">
                            {doc.clientName || 'No client name'}
                          </div>
                          {doc.projectName && <div>{doc.projectName}</div>}
                          <div className="flex items-center space-x-4 mt-1">
                            <span>Date: {doc.date}</span>
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(calculateTotal())}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => loadDocument(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none, .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  )
}

export default DocumentGenerator
