import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'

const SAMPLE = [
  { id:1, name:'Tomatoes', category:'Vegetables', price:30, unit:'kg', stock:0, image:'🍅' },
  { id:2, name:'Sukuma Wiki', category:'Vegetables', price:20, unit:'bunch', stock:45, image:'🥬' },
  { id:3, name:'Avocados', category:'Fruits', price:50, unit:'piece', stock:36, image:'🥑' },
  { id:4, name:'Milk 500ml', category:'Dairy', price:60, unit:'bottle', stock:9, image:'🥛' },
  { id:5, name:'Eggs (tray)', category:'Dairy', price:480, unit:'tray', stock:22, image:'🥚' },
  { id:6, name:'Bread', category:'Bakery', price:65, unit:'loaf', stock:0, image:'🍞' },
  { id:7, name:'Ugali Flour 2kg', category:'Grains', price:180, unit:'bag', stock:34, image:'🌾' },
  { id:8, name:'Bananas', category:'Fruits', price:80, unit:'bunch', stock:25, image:'🍌' },
]

export default function Products() {
  const [products, setProducts] = useState(SAMPLE)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name:'', category:'', price:'', unit:'', stock:'', image:'🛒' })

  const categories = ['All', ...new Set(SAMPLE.map(p => p.category))]

  function addProduct() {
    if (!form.name || !form.price) { toast.error('Name and price required'); return }
    setProducts(prev => [...prev, { id: Date.now(), ...form, price: Number(form.price), stock: Number(form.stock) }])
    toast.success('Product added!')
    setShowModal(false)
  }

  function deleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Removed')
  }

  const filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Products</div><div className="page-sub">Manage your product catalogue</div></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16}/> Add Product</button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-8 mb-16" style={{flexWrap:'wrap'}}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} className="btn" style={{
            background: category === c ? 'var(--g2)' : 'var(--white)', color: category === c ? '#fff' : 'var(--text2)',
            border: '1.5px solid var(--border)', fontSize: 12, padding: '6px 14px'
          }}>{c}</button>
        ))}
      </div>

      <div className="search-bar mb-16">
        <Search size={16} color="var(--text3)"/>
        <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* PRODUCT GRID */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}}>
        {filtered.map(p => (
          <div key={p.id} className="card">
            <div style={{background:'var(--g5)',height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>{p.image}</div>
            <div className="card-body">
              <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginBottom:8}}>{p.category} • {p.unit}</div>
              <div className="flex-between">
                <span style={{fontWeight:700,fontSize:15,color:'var(--g1)'}}>KES {p.price}</span>
                <span className={`pill ${p.stock === 0 ? 'pill-out' : p.stock < 15 ? 'pill-low' : 'pill-ok'}`}>
                  {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                </span>
              </div>
              <button className="btn btn-danger" style={{width:'100%',marginTop:10,fontSize:12,padding:'6px'}} onClick={() => deleteProduct(p.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Product</div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <div className="form-group"><label>Product Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Tomatoes"/></div>
            <div className="form-row">
              <div className="form-group"><label>Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  <option value="">Select</option>
                  {['Vegetables','Fruits','Dairy','Bakery','Grains','Pantry'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Emoji Icon</label><input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="🥬"/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Price (KES)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div>
              <div className="form-group"><label>Unit</label><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="kg / piece / bottle"/></div>
            </div>
            <div className="form-group"><label>Current Stock</label><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/></div>
            <div className="flex gap-8" style={{justifyContent:'flex-end',marginTop:8}}>
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addProduct}>Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}