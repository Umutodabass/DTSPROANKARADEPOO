import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Server, MapPin } from 'lucide-react';

export const Definitions: React.FC = () => {
  const { products, locations, addProduct, addLocation } = useStore();
  
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  
  const [newProductName, setNewProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'new');
  const [isNewCategory, setIsNewCategory] = useState(categories.length === 0);
  const [customCategory, setCustomCategory] = useState('');
  
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationCity, setNewLocationCity] = useState('İstanbul');
  const [newLocationType, setNewLocationType] = useState<'warehouse'|'field'>('field');

  const TURKISH_CITIES = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ].sort();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isNewCategory ? customCategory.trim() : selectedCategory;
    
    if(newProductName.trim() && finalCategory) {
      addProduct({ name: newProductName.trim(), category: finalCategory });
      setNewProductName('');
      setSelectedCategory('');
      setIsNewCategory(false);
      setCustomCategory('');
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'new') {
      setIsNewCategory(true);
      setSelectedCategory('');
    } else {
      setIsNewCategory(false);
      setSelectedCategory(val);
    }
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if(newLocationName && newLocationCity) {
      addLocation({ name: newLocationName, city: newLocationCity, type: newLocationType });
      setNewLocationName('');
      setNewLocationCity('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sistem Tanımları</h1>
        <p className="mt-1 text-sm text-slate-500">Sistemde kullanılacak kategori, makine tipleri ve lokasyon tanımlamaları.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ürün / Makine Tanımları */}
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center">
            <Server className="w-5 h-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Makine / Ürün Tipleri</h2>
          </div>
          
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <form onSubmit={handleAddProduct} className="flex gap-3">
              <input 
                type="text" 
                placeholder="Ürün Adı (Örn: VTM-8)" 
                value={newProductName}
                onChange={e => setNewProductName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white"
                required
              />
              {!isNewCategory ? (
                <select
                  value={selectedCategory}
                  onChange={handleCategorySelect}
                  className="w-40 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white"
                  required
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="new" className="font-semibold text-blue-600 dark:text-blue-400">+ Yeni Kategori Ekle</option>
                </select>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Yeni Kategori"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-32 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white"
                    required
                  />
                  <button type="button" onClick={() => setIsNewCategory(false)} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    İptal
                  </button>
                </div>
              )}
              <button type="submit" className="px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto p-2">
            {products.map(p => (
              <li key={p.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.category}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Lokasyon Tanımları */}
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center">
            <MapPin className="w-5 h-5 text-emerald-500 mr-2" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lokasyonlar & Şantiyeler</h2>
          </div>
          
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <form onSubmit={handleAddLocation} className="space-y-3">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Lokasyon Adı (Örn: İzmir Şantiye)" 
                  value={newLocationName}
                  onChange={e => setNewLocationName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white"
                  required
                />
                <select
                  value={newLocationCity}
                  onChange={e => setNewLocationCity(e.target.value)}
                  className="w-36 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white"
                  required
                >
                  {TURKISH_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 items-center">
                <select 
                  value={newLocationType}
                  onChange={e => setNewLocationType(e.target.value as 'warehouse'|'field')}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white"
                >
                  <option value="field">Saha / Şantiye</option>
                  <option value="warehouse">Depo / Merkez</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Ekle
                </button>
              </div>
            </form>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto p-2">
            {locations.map(l => (
              <li key={l.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    {l.name}
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {l.type === 'warehouse' ? 'Depo' : 'Saha'}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{l.city}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};
