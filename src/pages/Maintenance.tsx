import React from 'react';
import { useStore } from '../store/useStore';
import { Wrench, MapPin, Package, AlertTriangle } from 'lucide-react';

export const Maintenance: React.FC = () => {
  const { inventory, products, locations } = useStore();

  // Filter inventory items that have status = 'maintenance'
  const maintenanceItems = inventory.filter(item => item.status === 'maintenance');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bakımdaki Cihazlar</h1>
          <p className="mt-1 text-sm text-slate-500">Tamir, bakım veya onarım sürecinde olan tüm donanımlar.</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-lg flex items-center text-sm font-medium">
          <Wrench className="w-4 h-4 mr-2" />
          Toplam {maintenanceItems.length} Cihaz
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {maintenanceItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Donanım</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Bulunduğu Lokasyon</th>
                  <th className="px-6 py-4">Miktar</th>
                  <th className="px-6 py-4">Seri Numarası / Notlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {maintenanceItems.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  const location = locations.find(l => l.id === item.locationId);
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                            <Wrench className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white block">{product?.name || 'Bilinmeyen Ürün'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {product?.category || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          {location?.name || 'Bilinmiyor'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.quantity} Adet</span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {item.serialNumber && (
                          <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block mb-1">
                            SN: {item.serialNumber}
                          </div>
                        )}
                        {item.notes && (
                          <div className="text-xs text-slate-500 truncate mt-1">
                            {item.notes}
                          </div>
                        )}
                        {!item.serialNumber && !item.notes && (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Harika Haber!</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Şu anda bakımda olan veya arızalı hiçbir cihaz bulunmuyor. Tüm donanımlar aktif ve çalışır durumda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
