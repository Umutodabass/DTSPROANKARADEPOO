import React, { useState, useMemo } from 'react';
import { useStore, type ShoppingItem } from '../store/useStore';
import { Plus, Check, Trash2, ShoppingCart, Filter, Pencil, Save, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const ShoppingList: React.FC = () => {
  const { shoppingList, addShoppingItem, updateShoppingItem, toggleShoppingItem, deleteShoppingItem, products } = useStore();
  
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [filterCategory, setFilterCategory] = useState('Tümü');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  const allCategories = ['Tümü', ...categories, 'Diğer'];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    let itemName = '';
    let itemCategory = 'Diğer';

    if (selectedProductId === 'other') {
      if (!customItemName.trim()) return;
      itemName = customItemName.trim();
      itemCategory = 'Diğer';
    } else {
      const product = products.find(p => p.id === selectedProductId);
      if (!product) return;
      itemName = product.name;
      itemCategory = product.category;
    }
    
    if (editingItemId) {
      updateShoppingItem(editingItemId, {
        name: itemName,
        category: itemCategory,
        quantity: newItemQty,
      });
      setEditingItemId(null);
    } else {
      addShoppingItem({
        name: itemName,
        category: itemCategory,
        quantity: newItemQty,
        requestedBy: 'Geçerli Kullanıcı' // In a real app, use currentUser
      });
    }
    
    setSelectedProductId('');
    setCustomItemName('');
    setNewItemQty(1);
  };

  const handleEditClick = (item: ShoppingItem) => {
    setEditingItemId(item.id);
    setNewItemQty(item.quantity);
    
    const product = products.find(p => p.name === item.name);
    if (product) {
      setSelectedProductId(product.id);
      setCustomItemName('');
    } else {
      setSelectedProductId('other');
      setCustomItemName(item.name);
    }
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setSelectedProductId('');
    setCustomItemName('');
    setNewItemQty(1);
  };

  const filteredList = useMemo(() => {
    if (filterCategory === 'Tümü') return shoppingList;
    return shoppingList.filter(item => (item.category || 'Diğer') === filterCategory);
  }, [shoppingList, filterCategory]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Alınacaklar Listesi</h1>
          <p className="mt-1 text-sm text-slate-500">Eksik malzemeler ve sipariş edilecek ürünlerin takibi.</p>
        </div>
        
        {/* Kategori Filtresi */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {allCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            
            <div className="w-full sm:w-1/3">
              <label htmlFor="productSelect" className="sr-only">Ürün Seçimi</label>
              <select
                id="productSelect"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              >
                <option value="" disabled>Sistemden Makine/Ürün Seçin...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
                <option value="other">Diğer (Kendim Yazacağım)</option>
              </select>
            </div>

            {selectedProductId === 'other' && (
              <div className="w-full sm:w-1/3">
                <label htmlFor="customName" className="sr-only">Özel Ürün Adı</label>
                <input
                  type="text"
                  id="customName"
                  placeholder="Ürün adını yazın..."
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
            )}

            <div className="w-full sm:w-32">
              <label htmlFor="itemQty" className="sr-only">Miktar</label>
              <input
                type="number"
                id="itemQty"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
              >
                {editingItemId ? <Save className="w-5 h-5 mr-1" /> : <Plus className="w-5 h-5 mr-1" />}
                {editingItemId ? 'Kaydet' : 'Ekle'}
              </button>
              {editingItemId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium whitespace-nowrap"
                >
                  <X className="w-5 h-5 mr-1" />
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {filteredList.length > 0 ? (
            filteredList.map((item) => (
              <li key={item.id} className={cn(
                "flex items-center justify-between p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                item.isCompleted ? "bg-slate-50 dark:bg-slate-800/30" : ""
              )}>
                <div className="flex items-center flex-1 min-w-0 gap-4">
                  <button
                    onClick={() => toggleShoppingItem(item.id)}
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900",
                      item.isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 dark:border-slate-600 text-transparent hover:border-emerald-500"
                    )}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate transition-all duration-200",
                      item.isCompleted 
                        ? "text-slate-400 dark:text-slate-500 line-through" 
                        : "text-slate-900 dark:text-white"
                    )}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                        {item.category || 'Diğer'}
                      </span>
                      <p className="text-xs text-slate-500">
                        Miktar: {item.quantity} 
                        {item.requestedBy && ` • İsteyen: ${item.requestedBy}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center gap-1">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Düzenle"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteShoppingItem(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-12 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Bu kategori için alınacaklar listesi boş.</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
