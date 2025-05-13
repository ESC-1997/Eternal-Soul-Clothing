'use client';
import { useState, useEffect } from 'react';
import { PromoCodeService, PromoCode } from '@/app/services/promoCodeService';

export default function PromoCodesAdmin() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    expiresAt: '',
    usageLimit: 0,
    isActive: true,
    customerId: '',
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      const codes = await PromoCodeService.getPromoCodes();
      setPromoCodes(codes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingCode) {
        await PromoCodeService.updatePromoCode(editingCode.id, {
          ...formData,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        });
      } else {
        await PromoCodeService.createPromoCode({
          ...formData,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        }, 'admin'); // Replace with actual admin ID
      }

      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        minPurchase: 0,
        maxDiscount: 0,
        expiresAt: '',
        usageLimit: 0,
        isActive: true,
        customerId: '',
      });
      setEditingCode(null);
      setIsCreating(false);
      await loadPromoCodes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      type: code.type,
      value: code.value,
      minPurchase: code.minPurchase || 0,
      maxDiscount: code.maxDiscount || 0,
      expiresAt: code.expiresAt ? new Date(code.expiresAt).toISOString().split('T')[0] : '',
      usageLimit: code.usageLimit || 0,
      isActive: code.isActive,
      customerId: code.customerId || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      await PromoCodeService.deletePromoCode(id);
      await loadPromoCodes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingCode(null);
            setFormData({
              code: '',
              type: 'percentage',
              value: 0,
              minPurchase: 0,
              maxDiscount: 0,
              expiresAt: '',
              usageLimit: 0,
              isActive: true,
              customerId: '',
            });
          }}
          className="px-4 py-2 bg-[#B054FF] text-white rounded hover:bg-[#9F2FFF]"
        >
          Create New Promo Code
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {isCreating && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            {editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full border rounded p-2"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  className="w-full border rounded p-2"
                  required
                  min="0"
                  step={formData.type === 'percentage' ? '1' : '0.01'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Min Purchase</label>
                <input
                  type="number"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                  className="w-full border rounded p-2"
                  min="0"
                  step="0.01"
                />
              </div>
              {formData.type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Max Discount</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                    className="w-full border rounded p-2"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Expires At</label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                  className="w-full border rounded p-2"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer ID (Optional)</label>
                <input
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full border rounded p-2"
                  placeholder="Leave empty for public promo code"
                />
              </div>
              <div className="col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingCode(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B054FF] text-white rounded hover:bg-[#9F2FFF]"
              >
                {editingCode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promoCodes.map((code) => (
              <tr key={code.id}>
                <td className="px-6 py-4 whitespace-nowrap">{code.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{code.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {code.type === 'percentage' ? `${code.value}%` : `$${code.value}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {code.usageCount} / {code.usageLimit || '∞'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {code.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(code)}
                    className="text-[#B054FF] hover:text-[#9F2FFF] mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(code.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 