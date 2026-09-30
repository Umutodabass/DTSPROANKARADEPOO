import React from 'react';
import { useStore } from '../store/useStore';
import { MapPin, AlertCircle, CheckCircle2, Wrench } from 'lucide-react';

export const Deployments: React.FC = () => {
  const { locations, inventory, products } = useStore();
  
  const displayLocations = locations;

  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Bilinmiyor';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'broken':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lokasyon ve Saha Takibi</h1>
        <p className="mt-1 text-sm text-slate-500">Tüm lokasyonlarda ve sahada bulunan cihazların güncel durumları.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayLocations.map((location) => {
          const itemsAtLocation = inventory.filter(i => i.locationId === location.id);
          
          return (
            <div key={location.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{location.name}</h3>
                      <p className="text-sm text-slate-500">{location.city}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-1 bg-white dark:bg-slate-900">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Bulunan Ekipmanlar ({itemsAtLocation.length})
                </h4>
                
                {itemsAtLocation.length > 0 ? (
                  <ul className="space-y-3">
                    {itemsAtLocation.map((item) => (
                      <li key={item.id} className="flex items-start p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="mt-0.5 mr-3">
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {getProductName(item.productId)}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-slate-500">
                            <span className="truncate">{item.serialNumber || 'SN Yok'}</span>
                            <span className="mx-1.5">•</span>
                            <span>{item.quantity} Adet</span>
                          </div>
                          {item.notes && (
                            <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 py-1 px-2 rounded">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-sm text-slate-500">
                    Bu lokasyonda henüz ekipman bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {displayLocations.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <MapPin className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">Lokasyon Bulunamadı</h3>
            <p className="mt-1 text-sm text-slate-500">Henüz hiçbir depo veya saha lokasyonu tanımlanmamış.</p>
          </div>
        )}
      </div>
    </div>
  );
};
