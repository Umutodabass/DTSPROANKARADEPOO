import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PackagePlus, Search, Edit2, X } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { inventory, products, locations, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newStock, setNewStock] = useState({
    productId: '',
    locationId: '',
    quantity: 1,
    status: 'working' as 'working' | 'maintenance' | 'broken',
    serialNumber: '',
    notes: ''
  });

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStock.productId || !newStock.locationId) return;
    
    addInventoryItem({
      productId: newStock.productId,
      locationId: newStock.locationId,
      quantity: Number(newStock.quantity),
      status: newStock.status,
      serialNumber: newStock.serialNumber,
      notes: newStock.notes
    });

    setIsAddModalOpen(false);
    setNewStock({
      productId: '',
      locationId: '',
      quantity: 1,
      status: 'working',
      serialNumber: '',
      notes: ''
    });
  };

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Bilinmiyor';
  const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || 'Bilinmiyor';

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = getProductName(item.productId).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = filterLocation === 'all' || item.locationId === filterLocation;
    return matchesSearch && matchesLocation;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Çalışıyor</span>;
      case 'maintenance':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Bakımda</span>;
      case 'broken':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Arızalı</span>;
      default:
        return null;
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setNewStock({
      productId: item.productId,
      locationId: item.locationId,
      quantity: item.quantity,
      status: item.status,
      serialNumber: item.serialNumber || '',
      notes: item.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !newStock.productId || !newStock.locationId) return;

    if (window.confirm('Bu envanter kaydını güncellemek istediğinize emin misiniz?')) {
      updateInventoryItem(editingId, {
        productId: newStock.productId,
        locationId: newStock.locationId,
        quantity: Number(newStock.quantity),
        status: newStock.status,
        serialNumber: newStock.serialNumber,
        notes: newStock.notes
      });
      
      setIsEditModalOpen(false);
      setEditingId(null);
      setNewStock({ productId: '', locationId: '', quantity: 1, status: 'working', serialNumber: '', notes: '' });
    }
  };

  const handleDeleteStock = (id: string) => {
    if (window.confirm('Bu envanter kaydını kalıcı olarak silmek istediğinize emin misiniz?')) {
      deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Envanter Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-500">Depodaki ve sahadaki tüm ürünlerin durumu ve miktarı.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <PackagePlus className="w-4 h-4 mr-2" />
            Yeni Stok Ekle
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Ürün adı veya seri no ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-transparent dark:text-white"
            />
          </div>
          <div className="w-full sm:w-64">
            <select 
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-transparent dark:text-white"
            >
              <option value="all">Tüm Lokasyonlar</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ürün
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Lokasyon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Adet
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Notlar
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Düzenle</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {getProductName(item.productId)}
                      </span>
                      {item.serialNumber && (
                        <span className="text-xs text-slate-500">SN: {item.serialNumber}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {getLocationName(item.locationId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {item.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => startEdit(item)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStock(item.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    Arama kriterlerine uygun ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yeni Stok Ekleme Modalı */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Yeni Stok Ekle</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="add-stock-form" onSubmit={handleAddStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ürün</label>
                  <select
                    required
                    value={newStock.productId}
                    onChange={e => setNewStock({...newStock, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="" disabled>Ürün Seçin</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lokasyon</label>
                  <select
                    required
                    value={newStock.locationId}
                    onChange={e => setNewStock({...newStock, locationId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="" disabled>Lokasyon Seçin</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Miktar</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newStock.quantity}
                      onChange={e => setNewStock({...newStock, quantity: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Durum</label>
                    <select
                      value={newStock.status}
                      onChange={e => setNewStock({...newStock, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="working">Çalışıyor</option>
                      <option value="maintenance">Bakımda</option>
                      <option value="broken">Arızalı</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seri Numarası (Opsiyonel)</label>
                  <input
                    type="text"
                    value={newStock.serialNumber}
                    onChange={e => setNewStock({...newStock, serialNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Örn: SN-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notlar (Opsiyonel)</label>
                  <textarea
                    rows={2}
                    value={newStock.notes}
                    onChange={e => setNewStock({...newStock, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                    placeholder="Ek bilgiler..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                İptal
              </button>
              <button
                type="submit"
                form="add-stock-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Stok Ekle
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Düzenleme Modalı */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Stok Düzenle</h3>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingId(null);
                  setNewStock({ productId: '', locationId: '', quantity: 1, status: 'working', serialNumber: '', notes: '' });
                }}
                className="p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="edit-stock-form" onSubmit={handleEditStock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ürün</label>
                  <select
                    required
                    value={newStock.productId}
                    onChange={e => setNewStock({...newStock, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="" disabled>Ürün Seçin</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lokasyon</label>
                  <select
                    required
                    value={newStock.locationId}
                    onChange={e => setNewStock({...newStock, locationId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="" disabled>Lokasyon Seçin</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Miktar</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newStock.quantity}
                      onChange={e => setNewStock({...newStock, quantity: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Durum</label>
                    <select
                      value={newStock.status}
                      onChange={e => setNewStock({...newStock, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="working">Çalışıyor</option>
                      <option value="maintenance">Bakımda</option>
                      <option value="broken">Arızalı</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seri Numarası (Opsiyonel)</label>
                  <input
                    type="text"
                    value={newStock.serialNumber}
                    onChange={e => setNewStock({...newStock, serialNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Örn: SN-12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notlar (Opsiyonel)</label>
                  <textarea
                    rows={2}
                    value={newStock.notes}
                    onChange={e => setNewStock({...newStock, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                    placeholder="Ek bilgiler..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingId(null);
                  setNewStock({ productId: '', locationId: '', quantity: 1, status: 'working', serialNumber: '', notes: '' });
                }}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium"
              >
                İptal
              </button>
              <button
                type="submit"
                form="edit-stock-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
