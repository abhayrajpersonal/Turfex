
import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { InventoryItem } from '../../../lib/types';
import { useData } from '../../../context/DataContext';

// Initial Mock Data can be moved to DataContext or kept as default
const MOCK_INVENTORY: InventoryItem[] = [
    { id: '1', name: 'Cricket Ball (Red)', stock: 50, price: 250, category: 'Equipment', last_updated: '2024-05-10' },
    { id: '2', name: 'Water Bottle (500ml)', stock: 200, price: 20, category: 'Refreshment', last_updated: '2024-05-11' },
    { id: '3', name: 'Grip Tape', stock: 15, price: 100, category: 'Merch', last_updated: '2024-05-08' },
];

const InventoryManager: React.FC = () => {
  const { inventory, updateInventory } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', stock: 0, price: 0, category: 'Equipment' });

  // Initialize data if empty
  useEffect(() => {
      if (inventory.length === 0) {
          updateInventory(MOCK_INVENTORY);
      }
  }, []);

  const handleAddItem = () => {
      const item: InventoryItem = {
          id: Date.now().toString(),
          name: newItem.name,
          stock: newItem.stock,
          price: newItem.price,
          category: newItem.category as any,
          last_updated: new Date().toISOString().split('T')[0]
      };
      updateInventory([...inventory, item]);
      setIsAdding(false);
      setNewItem({ name: '', stock: 0, price: 0, category: 'Equipment' });
  };

  const updateStock = (id: string, delta: number) => {
      const newItems = inventory.map(item => item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item);
      updateInventory(newItems);
  };

  const deleteItem = (id: string) => {
      const newItems = inventory.filter(item => item.id !== id);
      updateInventory(newItems);
  };

  return (
    <div className="bg-white dark:bg-darkcard p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in-up">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-midnight dark:text-white flex items-center gap-2">
                <Package className="text-purple-500" size={24}/> Inventory
            </h3>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
                <Plus size={16} /> Add Item
            </button>
        </div>

        {isAdding && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-4 animate-scale-in">
                <input placeholder="Item Name" className="p-2 rounded border" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                <input type="number" placeholder="Stock" className="p-2 rounded border" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})} />
                <input type="number" placeholder="Price" className="p-2 rounded border" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} />
                <select className="p-2 rounded border" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                    <option>Equipment</option>
                    <option>Refreshment</option>
                    <option>Merch</option>
                </select>
                <button onClick={handleAddItem} className="bg-green-500 text-white rounded font-bold">Save</button>
            </div>
        )}

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-bold uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3 rounded-l-lg">Item</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-midnight dark:text-white">{item.name}</td>
                            <td className="px-4 py-3 text-gray-500">{item.category}</td>
                            <td className="px-4 py-3 font-mono">₹{item.price}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateStock(item.id, -1)} className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 hover:bg-red-200 dark:hover:bg-red-900 text-gray-600 dark:text-gray-300 font-bold">-</button>
                                    <span className={`font-bold w-8 text-center ${item.stock < 10 ? 'text-red-500' : 'text-midnight dark:text-white'}`}>{item.stock}</span>
                                    <button onClick={() => updateStock(item.id, 1)} className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-green-900 text-gray-600 dark:text-gray-300 font-bold">+</button>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default InventoryManager;
