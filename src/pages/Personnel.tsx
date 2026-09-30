import React, { useState } from 'react';
import { useStore, User } from '../store/useStore';
import { Users, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

export const Personnel: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editPassword, setEditPassword] = useState(''); // Optional reset

  const isAdmin = currentUser?.role === 'admin';

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;

    await addUser({
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole
    });

    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewRole('user');
    setIsAddModalOpen(false);
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword('');
  };

  const saveEdit = async (id: string) => {
    const updates: Partial<User> = { name: editName, email: editEmail, role: editRole };
    if (editPassword) updates.password = editPassword;
    
    await updateUser(id, updates);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu personeli silmek istediğinize emin misiniz?')) {
      await deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Personel Yönetimi</h1>
          <p className="mt-1 text-sm text-slate-500">Sisteme kayıtlı kullanıcılar ve yetkileri.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Personel Ekle
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">İsim</th>
                <th className="px-6 py-4">E-posta</th>
                <th className="px-6 py-4">Yetki</th>
                {isAdmin && <th className="px-6 py-4 text-right">İşlemler</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <input 
                        type="text" 
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-transparent dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Users className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <input 
                        type="email" 
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-transparent dark:text-white"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        value={editRole}
                        onChange={e => setEditRole(e.target.value as 'admin' | 'user')}
                        className="px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-transparent dark:text-white"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Yönetici</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      {editingId === user.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <input 
                            type="text"
                            placeholder="Yeni Şifre (Boş=Değişmez)"
                            value={editPassword}
                            onChange={e => setEditPassword(e.target.value)}
                            className="w-32 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded bg-transparent dark:text-white mr-2"
                          />
                          <button onClick={() => saveEdit(user.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => startEdit(user)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === currentUser?.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user.id === currentUser?.id ? 'Kendi hesabınızı silemezsiniz' : 'Sil'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Yeni Personel Ekle</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Şifre
                </label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Yetki Rolü
                </label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="user">Kullanıcı (Standart)</option>
                  <option value="admin">Yönetici (Tam Yetki)</option>
                </select>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
