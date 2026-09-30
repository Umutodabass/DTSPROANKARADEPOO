import React from 'react';
import { useStore } from '../store/useStore';
import { Package, MapPin, ShoppingCart, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { inventory, locations, shoppingList, users, products } = useStore();

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const activeDeployments = locations.filter(l => l.type === 'field').length;
  const pendingShopping = shoppingList.filter(i => !i.isCompleted).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Sistemin genel durumu ve özet bilgiler.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    Toplam Envanter
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-slate-900 dark:text-white">
                      {totalItems} Adet
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    Aktif Saha Görevleri
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-slate-900 dark:text-white">
                      {activeDeployments} Lokasyon
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-amber-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    Alınacak Bekleyenler
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-slate-900 dark:text-white">
                      {pendingShopping} Kalem
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    Kayıtlı Personel
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-slate-900 dark:text-white">
                      {users.length} Kişi
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Inventory */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Son Eklenen Envanterler</h2>
          </div>
          <div className="p-5 flex-1">
            {inventory.length > 0 ? (
              <ul className="space-y-4">
                {inventory.slice(-5).reverse().map(item => {
                  const product = products.find(p => p.id === item.productId);
                  const location = locations.find(l => l.id === item.locationId);
                  return (
                    <li key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{product?.name || 'Bilinmiyor'}</p>
                          <p className="text-xs text-slate-500 truncate">{location?.name || 'Bilinmeyen Lokasyon'}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-4 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md whitespace-nowrap">{item.quantity} Adet</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500 flex flex-col items-center">
                <Package className="w-8 h-8 text-slate-300 mb-2" />
                Henüz envanter kaydı bulunmuyor.
              </div>
            )}
          </div>
        </div>

        {/* Pending Shopping */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Alınacak Bekleyenler</h2>
          </div>
          <div className="p-5 flex-1">
            {shoppingList.filter(i => !i.isCompleted).length > 0 ? (
              <ul className="space-y-4">
                {shoppingList.filter(i => !i.isCompleted).slice(-5).reverse().map(item => (
                  <li key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 truncate">{item.category || 'Kategorisiz'} • {item.requestedBy || 'Talep Eden Yok'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400 ml-4 bg-amber-100 dark:bg-amber-900/20 px-2.5 py-1 rounded-md whitespace-nowrap">{item.quantity} Adet</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-sm text-slate-500 flex flex-col items-center">
                <ShoppingCart className="w-8 h-8 text-slate-300 mb-2" />
                Bekleyen alınacak malzeme yok.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
