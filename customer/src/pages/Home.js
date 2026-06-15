import { useState, useEffect } from 'react'
import { Search, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../supabaseClient'

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Grains', 'Pantry']

export default function Home({ cart, addToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchProducts()
    // Real-time: refresh products when stock changes
    const channel = supabase
      .channel('products-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) setProducts(data)
    setLoading(false)
  }

  function handleAdd(product) {
    if (product.stock === 0) return
    addToCart(product)
    toast.success(`${product.image} ${product.name} added to cart!`, { duration: 1500 })
  }

  const cartIds = cart.map(i => i.id)

  const filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (loading) return (
    <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text3)'}}>
      <div style={{fontSize:40,marginBottom:12}}>🌿</div>
      <div style={{fontSize:14}}>Loading fresh products...</div>
    </div>
  )

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <MapPin size={14} />
          <span style={{ fontSize:12, opacity:.8 }}>Delivering to: Westlands, Nairobi</span>
        </div>
        <h2>Fresh groceries,<br/>delivered fast 🌿</h2>
        <p>Order by 12pm for same-day delivery</p>
        <div className="hero-search">
          <Search size={16} color="var(--text3)" />
          <input
            placeholder="Search tomatoes, milk, avocado..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* PROMO BANNER */}
      <div style={{ margin:'16px 16px 0', background:'linear-gradient(135deg,#f5a623,#e67e22)', borderRadius:12, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.8)', fontWeight:600 }}>LIMITED OFFER</div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginTop:2 }}>Free delivery on orders over KES 500</div>
        </div>
        <div style={{ fontSize:32 }}>🎉</div>
      </div>

      {/* CATEGORIES */}
      <div className="section" style={{ paddingBottom:0 }}>
        <div className="section-title" style={{ marginBottom:10 }}>Categories</div>
        <div className="cat-scroll">
          {CATEGORIES.map(c => (
            <div key={c} className={`cat-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="section">
        <div className="section-title">
          {category === 'All' ? 'All Products' : category}
          <span style={{ fontSize:12, color:'var(--text3)', fontWeight:400 }}>{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <h3>Nothing found</h3>
            <p>Try searching for something else</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => {
              const inCart = cartIds.includes(p.id)
              const cartItem = cart.find(i => i.id === p.id)
              return (
                <div key={p.id} className="product-card">
                  <div className="product-img">
                    {p.image}
                    {p.stock_quantity === 0 && <span className="out-badge">Out of Stock</span>}
                    {p.stock_quantity > 0 && p.stock_quantity <= 10 && <span className="out-badge" style={{ background:'var(--accent)' }}>Low Stock</span>}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{p.name}</div>
                    <div className="product-unit">{p.unit}</div>
                    <div className="product-footer">
                      <div className="product-price">KES {p.price}</div>
                      {inCart ? (
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ background:'var(--g5)', borderRadius:8, padding:'3px 8px', fontSize:12, fontWeight:700, color:'var(--g2)' }}>
                            {cartItem.qty} in cart
                          </div>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={() => handleAdd(p)} disabled={p.stock_quantity === 0}>+</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}