import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type User = {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'admin' | 'user';
};

export type ProductDefinition = {
  id: string;
  name: string;
  category: string;
  description?: string;
};

export type LocationDefinition = {
  id: string;
  name: string;
  city: string;
  type: 'warehouse' | 'field';
};

export type InventoryItem = {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  status: 'working' | 'maintenance' | 'broken';
  serialNumber?: string;
  notes?: string;
};

export type ShoppingItem = {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  isCompleted: boolean;
  requestedBy?: string;
};

interface AppState {
  currentUser: User | null;
  users: User[];
  products: ProductDefinition[];
  locations: LocationDefinition[];
  inventory: InventoryItem[];
  shoppingList: ShoppingItem[];
  
  isInitialized: boolean;
  initialize: () => Promise<void>;

  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<ProductDefinition, 'id'>) => Promise<void>;
  addLocation: (location: Omit<LocationDefinition, 'id'>) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'isCompleted'>) => Promise<void>;
  updateShoppingItem: (id: string, item: Partial<ShoppingItem>) => Promise<void>;
  toggleShoppingItem: (id: string) => Promise<void>;
  deleteShoppingItem: (id: string) => Promise<void>;
  
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useStore = create<AppState>()((set, get) => ({
  currentUser: null,
  users: [],
  products: [],
  locations: [],
  inventory: [],
  shoppingList: [],
  isInitialized: false,

  initialize: async () => {
    try {
      const [users, products, locations, inventory, shoppingList] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('products').select('*'),
        supabase.from('locations').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('shopping_list').select('*')
      ]);

      const mappedInventory = (inventory.data || []).map(item => ({
        id: item.id,
        productId: item.product_id,
        locationId: item.location_id,
        quantity: item.quantity,
        status: item.status,
        serialNumber: item.serial_number,
        notes: item.notes
      }));

      const mappedShoppingList = (shoppingList.data || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        isCompleted: item.is_completed,
        requestedBy: item.requested_by
      }));

      set({
        users: users.data || [],
        products: products.data || [],
        locations: locations.data || [],
        inventory: mappedInventory,
        shoppingList: mappedShoppingList,
        isInitialized: true
      });
      
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        set({ currentUser: JSON.parse(storedUser) });
      }
    } catch (error) {
      console.error('Error initializing data from Supabase:', error);
    }
  },

  login: async (email, password) => {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    if (data && (!password || data.password === password)) {
      set({ currentUser: data });
      localStorage.setItem('currentUser', JSON.stringify(data));
      return true;
    }
    return false;
  },
  
  logout: () => {
    set({ currentUser: null });
    localStorage.removeItem('currentUser');
  },

  addProduct: async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (!error && data) {
      set(state => ({ products: [...state.products, data] }));
    }
  },

  addLocation: async (location) => {
    const { data, error } = await supabase.from('locations').insert([location]).select().single();
    if (!error && data) {
      set(state => ({ locations: [...state.locations, data] }));
    }
  },

  addInventoryItem: async (item) => {
    const { data, error } = await supabase.from('inventory').insert([{
      product_id: item.productId,
      location_id: item.locationId,
      quantity: item.quantity,
      status: item.status,
      serial_number: item.serialNumber,
      notes: item.notes
    }]).select().single();
    
    if (!error && data) {
      const mapped = {
        id: data.id,
        productId: data.product_id,
        locationId: data.location_id,
        quantity: data.quantity,
        status: data.status,
        serialNumber: data.serial_number,
        notes: data.notes
      };
      set(state => ({ inventory: [...state.inventory, mapped] }));
    }
  },

  updateInventoryItem: async (id, updatedFields) => {
    const updateData: any = {};
    if (updatedFields.productId) updateData.product_id = updatedFields.productId;
    if (updatedFields.locationId) updateData.location_id = updatedFields.locationId;
    if (updatedFields.quantity !== undefined) updateData.quantity = updatedFields.quantity;
    if (updatedFields.status) updateData.status = updatedFields.status;
    if (updatedFields.serialNumber !== undefined) updateData.serial_number = updatedFields.serialNumber;
    if (updatedFields.notes !== undefined) updateData.notes = updatedFields.notes;

    const { error } = await supabase.from('inventory').update(updateData).eq('id', id);
    if (!error) {
      set(state => ({
        inventory: state.inventory.map(item => item.id === id ? { ...item, ...updatedFields } : item)
      }));
    }
  },

  addShoppingItem: async (item) => {
    const { data, error } = await supabase.from('shopping_list').insert([{
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      requested_by: item.requestedBy
    }]).select().single();

    if (!error && data) {
      const mapped = {
        id: data.id,
        name: data.name,
        category: data.category,
        quantity: data.quantity,
        isCompleted: data.is_completed,
        requestedBy: data.requested_by
      };
      set(state => ({ shoppingList: [...state.shoppingList, mapped] }));
    }
  },

  updateShoppingItem: async (id, updatedFields) => {
    const updateData: any = {};
    if (updatedFields.name) updateData.name = updatedFields.name;
    if (updatedFields.category) updateData.category = updatedFields.category;
    if (updatedFields.quantity !== undefined) updateData.quantity = updatedFields.quantity;
    if (updatedFields.isCompleted !== undefined) updateData.is_completed = updatedFields.isCompleted;
    if (updatedFields.requestedBy !== undefined) updateData.requested_by = updatedFields.requestedBy;

    const { error } = await supabase.from('shopping_list').update(updateData).eq('id', id);
    if (!error) {
      set(state => ({
        shoppingList: state.shoppingList.map(item => item.id === id ? { ...item, ...updatedFields } : item)
      }));
    }
  },

  toggleShoppingItem: async (id) => {
    const item = get().shoppingList.find(i => i.id === id);
    if (!item) return;
    const { error } = await supabase.from('shopping_list').update({ is_completed: !item.isCompleted }).eq('id', id);
    if (!error) {
      set(state => ({
        shoppingList: state.shoppingList.map(i => i.id === id ? { ...i, isCompleted: !i.isCompleted } : i)
      }));
    }
  },
  
  deleteShoppingItem: async (id) => {
    const { error } = await supabase.from('shopping_list').delete().eq('id', id);
    if (!error) {
      set(state => ({
        shoppingList: state.shoppingList.filter(item => item.id !== id)
      }));
    }
  },

  addUser: async (user) => {
    const { data, error } = await supabase.from('users').insert([user]).select().single();
    if (!error && data) {
      set(state => ({ users: [...state.users, data] }));
    }
  },

  updateUser: async (id, updatedFields) => {
    const { error } = await supabase.from('users').update(updatedFields).eq('id', id);
    if (!error) {
      set(state => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updatedFields } : u)
      }));
    }
  },

  deleteUser: async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) {
      set(state => ({
        users: state.users.filter(u => u.id !== id)
      }));
    }
  }
}));
