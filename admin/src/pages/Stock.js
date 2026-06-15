import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'
import { Plus, Search, X, AlertTriangle } from 'lucide-react'

const SAMPLE_STOCK = [
  { id: 1, name: 'Tomatoes', category: 'Vegetables', price: 30, stock_quantity: 0, unit: 'kg', reorder_level: 20 },
  { id: 2, name: 'Sukuma Wiki', category: 'Vegetables', price: 20, stock_quantity: 45, unit: 'bunch', reorder_level: 30 },
  { id: 3, name: 'Avocados', category: 'Fruits', price: 50, stock_quantity: 36, unit: 'piece', reorder_level: 20 },
  { id: 4, name: 'Milk 500ml', category: 'Dairy', price: 60, stock_quantity: 9, unit: 'bottle', reorder_level: 30 },
  { id: 5, name: 'Eggs (tray)', category: 'Dairy', price: 480, stock_quantity: 22, unit: 'tray', reorder_level: 10 },
  { id: 6, name: 'Bread', category: 'Bakery', price: 65, stock_quantity: 0, unit: 'loaf', reorder_level: 15 },
  { id: 7, name: 'Ugali Flour 2kg', category: 'Grains', price: 180, stock_quantity: 34, unit: 'bag', reorder_level: 20 },
  { id: 8, name: 'Cooking Oil 1L', category: 'Pantry', price: 280, stock_quantity: 18, unit: 'bottle', reorder_level: 10 },
  { id: 9, name: 'Bananas (bunch)', category: 'Fruits', price: 80, stock_quantity: 25, unit: 'bunch', reorder_level: 15 },
  { id: 10, name: 'Onions', category: 'Vegetables', price: 60, stock_quantity: 5, unit: 'kg', reorder_level: 20 },
]

export default function Stock() {
  const [products, setProducts] = useState(SAMPLE_STOCK)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name:'', category:'', price:'', stock_quantity:'', unit:'', reorder_level:'' })

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data && data.length > 0) setProducts(data)
  }

  function openAdd() { setEditItem(null); setForm({ name:'', category:'', price:'', stock_quantity:'', unit:'', reorder_level:'' }); setShowModal(true) }
  function openEdit(item) { setEditItem(item); setForm({ name:item.name, category:item.category, price:item.price, stock_quantity:item.stock_quantity, unit:item.unit, reorder_level:item.reorder_level }); setShowModal(true) }

  async function saveProduct() {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    if (editItem) {
      const { error } = await supabase.from('products').update(form).eq('id', editItem.id)
      if (!error) { toast.success('Product updated!') } else { toast.success('Updated (demo mode)') }
      setProducts(prev => prev.map(p => p.id === editItem.id ? { ...p, ...form } : p))
    } else {
      const newItem = { ...form, id: Date.now(), price: Number(form.price), stock_quantity: Number(form.stock_quantity), reorder_level: Number(form.reorder_level) }
      const { error } = await supabase.from('products').insert([form])
      if (!error) { toast.success('Product added!') } else { toast.success('Added (demo mode)') }
      setProducts(prev => [...prev, newItem])
    }
    setShowModal(false)
  }

  async function deleteProduct(id) {
    if (!window.confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product deleted')
  }

  const getStatus = (item) => {
    if (item.stock_quantity === 0) return { label: 'Out of Stock', cls: 'pill-out' }
    if (item.stock_quantity <= item.reorder_level) return { label: 'Low Stock', cls: 'pill-low' }
    return { label: 'In Stock', cls: 'pill-ok' }
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const outOfStock = products.filter(p => p.stock_quantity === 0).length
  const lowStock = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.reorder_level).length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Stock Taking</div>
          <div className="page-sub">Monitor and manage your inventory</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16}/> Add Product</button>
      </div>

      {/* ALERTS */}
      {(outOfStock > 0 || lowStock > 0) && (
        <div style={{background:'#fff3e0',border:'1px solid #ffcc80',borderRadius:10,padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:10}}>
          <AlertTriangle size={18} color="#e65100"/>
          <span style={{fontSize:13,color:'#bf360c',fontWeight:600}}>
            {outOfStock} item(s) out of stock • {lowStock} item(s) running low — restock soon!
          </span>
        </div>
      )}

      {/* SEARCH */}
      <div className="search-bar">
        <Search size={16} color="var(--text3)"/>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Product</th><th>Category</th><th>Unit</th><th>Price (KES)</th><th>Stock</th><th>Reorder Level</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const st = getStatus(p)
                const pct = p.reorder_level > 0 ? Math.min(100, (p.stock_quantity / (p.reorder_level * 3)) * 100) : 0
                return (
                  <tr key={p.id}>
                    <td style={{fontWeight:600}}>{p.name}</td>
                    <td className="text-muted">{p.category}</td>
                    <td className="text-muted">{p.unit}</td>
                    <td style={{fontWeight:700}}>KES {p.price}</td>
                    <td>
                      <div style={{fontWeight:600,marginBottom:4}}>{p.stock_quantity} units</div>
                      <div className="progress-wrap" style={{width:80}}>
                        <div className="progress-fill" style={{width:`${pct}%`,background:p.stock_quantity===0?'var(--red)':p.stock_quantity<=p.reorder_level?'var(--accent)':'var(--g3)'}}></div>
                      </div>
                    </td>
                    <td className="text-muted">{p.reorder_level} units</td>
                    <td><span className={`pill ${st.cls}`}>{st.label}</span></td>
                    <td>
                      <div className="flex gap-8">
                        <button className="btn btn-outline" style={{fontSize:11,padding:'4px 10px'}} onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger" style={{fontSize:11,padding:'4px 10px'}} onClick={() => deleteProduct(p.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editItem ? 'Edit Product' : 'Add New Product'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Product Name</label><input value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="e.g. Tomatoes"/></div>
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                  <option value="">Select category</option>
                  {['Vegetables','Fruits','Dairy','Bakery','Grains','Pantry','Meat','Beverages'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Price (KES)</label><input type="number" value={form.price} onChange={e => setForm({...form,price:e.target.value})} placeholder="0"/></div>
              <div className="form-group"><label>Unit</label><input value={form.unit} onChange={e => setForm({...form,unit:e.target.value})} placeholder="e.g. kg, piece, bottle"/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Current Stock</label><input type="number" value={form.stock_quantity} onChange={e => setForm({...form,stock_quantity:e.target.value})} placeholder="0"/></div>
              <div className="form-group"><label>Reorder Level</label><input type="number" value={form.reorder_level} onChange={e => setForm({...form,reorder_level:e.target.value})} placeholder="Minimum before restock"/></div>
            </div>
            <div className="flex gap-8" style={{justifyContent:'flex-end',marginTop:8}}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveProduct}>{editItem ? 'Update' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}