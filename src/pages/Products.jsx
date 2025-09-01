import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { imagesURL } from '../api/index.js'
import { getStoredHomeData } from '../api/home.js'
import GlobalLoader from '../components/GlobalLoader.jsx'

// Helper to build Cloudflare image URL keys into full URLs
const buildImg = (key) => {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return key;
  return `${imagesURL}${key}/public`;
}

export default function Products() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const homeData = await getStoredHomeData()
        
        if (homeData?.product) {
          setProducts(homeData.product)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <GlobalLoader visible={true} />
  }

  return (
    <AppLayout>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              padding: 8,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 24, color: '#1E1F24' }}>
            Recommended Products
          </h1>
        </div>

        {/* Search Bar */}
        {/* <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <span style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
            color: '#6B7280'
          }}>
            🔍
          </span>
        </div> */}
      </div>

      {/* Products Grid */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        WebkitOverflowScrolling: 'touch'
      }}>
        {filteredProducts.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: 64, marginBottom: 16 }}>📦</span>
            <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#1E1F24' }}>
              {searchTerm ? 'No products found' : 'No products available'}
            </h3>
            <p style={{ margin: 0, fontSize: 16, color: '#6B7280' }}>
              {searchTerm ? 'Try a different search term' : 'Check back later for new products'}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            {/* <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                {searchTerm ? `${filteredProducts.length} products found` : `${products.length} products available`}
              </p>
            </div> */}

            {/* Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20
            }}>
              {filteredProducts.map((product, index) => {
                const img = buildImg(product?.product_image?.[0]);
                return (
                  <div key={index} style={{
                    background: '#F0F7FB',
                    border: '1px solid #e5e7eb',
                    borderRadius: 20,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{ padding: 16 }}>
                      {/* Product Image */}
                      <div style={{
                        height: 200,
                        background: '#fff',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e5e7eb',
                        marginBottom: 16
                      }}>
                        {img ? (
                          <img
                            src={img}
                            alt={product.product_name || 'Product'}
                            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                          />
                        ) : (
                          <span style={{ fontSize: 48, color: '#9ca3af' }}>📦</span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div>
                        <h4 style={{
                          margin: '0 0 8px',
                          fontSize: 18,
                          color: '#1E1F24',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}>
                          {product.product_name || 'Product Name'}
                        </h4>

                        {/* Description */}
                        {product.product_description && (
                          <p style={{
                            margin: '0 0 12px',
                            fontSize: 14,
                            color: '#6B7280',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                          }}>
                            {product.product_description.replace(/<[^>]*>/g, '')}
                          </p>
                        )}

                        {/* Price */}
                        <p style={{ 
                          margin: '0 0 16px', 
                          fontSize: 18, 
                          color: '#2743B8',
                          fontWeight: 600
                        }}>
                          ${product.product_price || '—'}
                        </p>

                        {/* Buy Button */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (product?.product_url) {
                                window.open(product.product_url, '_blank');
                              }
                            }}
                            style={{
                              minWidth: 140,
                              padding: '12px 20px',
                              background: '#2743B8',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 28,
                              fontSize: 16,
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#1e3296'}
                            onMouseLeave={(e) => e.target.style.background = '#2743B8'}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
