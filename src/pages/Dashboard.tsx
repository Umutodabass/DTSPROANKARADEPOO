import React from 'react';
import { useStore } from '../store/useStore';
import { Package, MapPin, ShoppingCart, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { inventory, locations, shoppingList, users } = useStore();

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
    </div>
  );
};
