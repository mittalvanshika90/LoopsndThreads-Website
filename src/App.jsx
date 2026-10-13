
import { useState } from 'react'
import './App.css'
import tulip from './assets/tulip.jpg'
import pinkRoseStick from './assets/pink rose stick.jpeg'
import pandaPhoto from './assets/panda.jpeg'
import bunnyPhoto from './assets/bunny.jpeg'
import roseBouquet from './assets/rose bouquet.jpeg'

const WHATSAPP_NUMBER = '919458262803'
const SHIPPING_CHARGE = 99

const products = [
  {
  id: 'tulip-stick',
  name: 'Tulip Stick',
  price: 149,
  category: 'CROCHET FLOWER',
  description: 'A cute handmade tulip that never fades.',
  image: tulip,
  tag: 'New',
  },
  {
    id: 'pink-rose-stick',
    name: 'Pink Rose Stick',
    price: 149,
    category: 'CROCHET FLOWER',
    description: 'A pretty pink crochet rose, handmade with love.',
    image: pinkRoseStick,
    tag: 'New',
  },
  {
    id: 'panda',
    name: 'Crochet Panda',
    price: 499,
    category: 'AMIGURUMI',
    description: 'A cute handmade panda for your little collection.',
    image: pandaPhoto,
    tag: 'Cute',
  },
  {
    id: 'bunny',
    name: 'Crochet Bunny',
    price: 699,
    category: 'AMIGURUMI',
    description: 'A soft, sweet crochet bunny made with care.',
    image: bunnyPhoto,
    tag: 'Popular',
  },
]

const bouquet = {
  id: 'rose-bouquet',
  name: 'Rose Bouquet',
  price: 999,
  category: 'CROCHET BOUQUET',
  description: 'A beautiful handmade rose bouquet, perfect for gifting.',
  image: roseBouquet,
  tag: 'Special',
}

function App() {
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderReady, setOrderReady] = useState(false)
  const [shippingSelected, setShippingSelected] = useState(true)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id)

      if (found) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...current, { ...product, quantity: 1 }]
    })

    setCartOpen(true)
    setOrderReady(false)
  }

  const increaseQuantity = (id) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const validCoupon =
    (appliedCoupon === 'CROCHET10' && subtotal > 999) ||
    (appliedCoupon === 'SAVE50' && subtotal >= 500)

  const discount = !validCoupon
    ? 0
    : appliedCoupon === 'CROCHET10'
      ? Math.round(subtotal * 0.1 * 100) / 100
      : 50

  const shipping =
    cart.length > 0 && shippingSelected ? SHIPPING_CHARGE : 0

  const finalTotal = subtotal - discount + shipping

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()

    if (code === 'CROCHET10') {
      if (subtotal <= 999) {
        setAppliedCoupon('')
        setCouponMessage(
          subtotal === 999
            ? 'CROCHET10 requires a subtotal above ₹999.'
            : `Add ₹${1000 - subtotal} more to unlock 10% off.`
        )
        return
      }

      setAppliedCoupon('CROCHET10')
      setCouponMessage('10% discount applied! 🎉')
      return
    }

    if (code === 'SAVE50') {
      if (subtotal < 500) {
        setAppliedCoupon('')
        setCouponMessage(
          `Add ₹${500 - subtotal} more to unlock ₹50 off.`
        )
        return
      }

      setAppliedCoupon('SAVE50')
      setCouponMessage('₹50 discount applied! 🎉')
      return
    }

    setAppliedCoupon('')
    setCouponMessage('Invalid coupon code. Try CROCHET10 or SAVE50.')
  }

  const clearCoupon = () => {
    setAppliedCoupon('')
    setCouponInput('')
    setCouponMessage('')
  }

  const handleCustomerChange = (event) => {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  const orderMessage = () => {
    const items = cart
      .map(
        (item) =>
          `• ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
      )
      .join('\n')

    return `Hello loopsndthreads! 🧶

I'd like to place an order.

CUSTOMER DETAILS
Name: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
City: ${customer.city}
Pincode: ${customer.pincode}

ORDER ITEMS
${items}

Subtotal: ₹${subtotal}
Shipping: ${shipping > 0 ? `₹${shipping}` : 'Free'}
Coupon: ${validCoupon ? appliedCoupon : 'None'}
Discount: -₹${discount}
FINAL TOTAL: ₹${finalTotal}

Please confirm my order. Thank you! ♡`
  }

  const submitOrder = (event) => {
    event.preventDefault()

    if (WHATSAPP_NUMBER.includes('X')) {
      alert('Please replace WHATSAPP_NUMBER in App.jsx with your WhatsApp number.')
      return
    }

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(orderMessage())

    window.open(url, '_blank', 'noopener,noreferrer')
    setOrderReady(true)
  }

  const resetShop = () => {
    setCart([])
    setCartOpen(false)
    setCheckoutOpen(false)
    setOrderReady(false)
    setShippingSelected(true)
    clearCoupon()
    setCustomer({
      name: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
    })
  }

  const ProductCard = ({ product }) => (
    <article className="product-card" key={product.id}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="tag">{product.tag}</span>
      </div>

      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
        </div>
        <strong className="product-price">₹{product.price}</strong>
      </div>

      <div className="product-action">
        <button className="add-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart <span>→</span>
        </button>
      </div>
    </article>
  )

  const MiniImage = ({ item }) => (
    <div className="mini-image">
      <img src={item.image} alt={item.name} />
    </div>
  )

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">
          loops<span>nd</span>threads
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#bouquets">Bouquets</a>
          <a href="#about">About</a>
          <a href="#custom">Custom Orders</a>
        </div>

        <button
          className="cart-icon"
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          🛍
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </nav>

      {cartOpen && (
        <button
          className="cart-overlay"
          aria-label="Close cart"
          onClick={() => setCartOpen(false)}
        />
      )}

      <aside className={`cart-drawer ${cartOpen ? 'cart-open' : ''}`}>
        <div className="cart-header">
          <div>
            <p className="section-label">YOUR BAG</p>
            <h2>Shopping Cart</h2>
          </div>
          <button className="close-button" onClick={() => setCartOpen(false)}>
            ×
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>🧶</span>
              <h3>Your cart is empty</h3>
              <p>Find something handmade just for you.</p>
              <button
                className="primary-btn"
                onClick={() => {
                  setCartOpen(false)
                  document.getElementById('shop')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <MiniImage item={item} />
                <div className="cart-item-info">
                  <p className="product-category">{item.category}</p>
                  <h3>{item.name}</h3>
                  <div className="cart-item-bottom">
                    <div className="quantity-control">
                      <button onClick={() => decreaseQuantity(item.id)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="bill-row">
              <span>Subtotal</span><strong>₹{subtotal}</strong>
            </div>
            <p className="muted-small">Shipping and coupons at checkout.</p>
            <button
              className="primary-btn full-width"
              onClick={() => {
                setCartOpen(false)
                setCheckoutOpen(true)
                setOrderReady(false)
              }}
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </aside>

      {checkoutOpen && (
        <div className="checkout-overlay">
          <div className="checkout-page">
            <div className="checkout-top">
              <a href="#home" className="logo" onClick={() => setCheckoutOpen(false)}>
                loops<span>nd</span>threads
              </a>
              <button className="close-button" onClick={() => setCheckoutOpen(false)}>
                ×
              </button>
            </div>

            {orderReady ? (
              <div className="order-success">
                <div className="success-icon">✓</div>
                <p className="section-label">ORDER DETAILS READY</p>
                <h1>Almost there, {customer.name}!</h1>
                <p>
                  Your order details opened in WhatsApp. Send the message there
                  to confirm your order.
                </p>
                <h2>Final total: ₹{finalTotal}</h2>
                <button
                  className="primary-btn full-width"
                  onClick={() => {
                    const url =
                      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
                      encodeURIComponent(orderMessage())
                    window.open(url, '_blank', 'noopener,noreferrer')
                  }}
                >
                  Open WhatsApp Again
                </button>
                <button className="text-button" onClick={resetShop}>
                  Back to Shop
                </button>
              </div>
            ) : (
              <div className="checkout-layout">
                <div>
                  <p className="section-label">CHECKOUT</p>
                  <h1>Almost yours.</h1>
                  <p className="muted-text">Where should we send your goodies?</p>

                  <form onSubmit={submitOrder}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input id="name" name="name" value={customer.name}
                        onChange={handleCustomerChange} required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input id="phone" name="phone" type="tel"
                        value={customer.phone} onChange={handleCustomerChange}
                        pattern="[0-9]{10}" maxLength={10}
                        placeholder="10-digit number" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Delivery Address</label>
                      <textarea id="address" name="address" rows={3}
                        value={customer.address} onChange={handleCustomerChange}
                        required />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input id="city" name="city" value={customer.city}
                          onChange={handleCustomerChange} required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pincode">Pincode</label>
                        <input id="pincode" name="pincode" value={customer.pincode}
                          onChange={handleCustomerChange} pattern="[0-9]{6}"
                          maxLength={6} required />
                      </div>
                    </div>

                    <label className="shipping-option">
                      <input type="checkbox" checked={shippingSelected}
                        onChange={(event) => setShippingSelected(event.target.checked)} />
                      <span className="shipping-copy">
                        <strong>Standard Shipping</strong>
                        <small>Delivery charges</small>
                      </span>
                      <strong>₹99</strong>
                    </label>

                    <div className="coupon-box">
                      <p className="section-label">GOT A COUPON?</p>
                      <input value={couponInput}
                        onChange={(event) => {
                          setCouponInput(event.target.value)
                          setAppliedCoupon('')
                          setCouponMessage('')
                        }}
                        placeholder="CROCHET10 or SAVE50" />

                      <button type="button" className="secondary-btn full-width"
                        onClick={applyCoupon}>
                        Apply Coupon
                      </button>

                      {couponMessage && (
                        <p className={`coupon-message ${validCoupon ? 'success' : ''}`}>
                          {couponMessage}
                        </p>
                      )}

                      <div className="coupon-info">
                        <p><strong>CROCHET10</strong> — 10% off above ₹999</p>
                        <p><strong>SAVE50</strong> — ₹50 off on ₹500 or more</p>
                      </div>

                      {appliedCoupon && (
                        <button type="button" className="text-button" onClick={clearCoupon}>
                          Remove coupon
                        </button>
                      )}
                    </div>

                    <button type="submit" className="primary-btn full-width">
                      Order on WhatsApp →
                    </button>
                    <p className="muted-small">
                      Send the WhatsApp message to confirm your order.
                    </p>
                  </form>
                </div>

                <div className="summary-card">
                  <p className="section-label">YOUR ORDER</p>
                  <h2>Order Summary</h2>

                  {cart.map((item) => (
                    <div className="summary-item" key={item.id}>
                      <MiniImage item={item} />
                      <div className="summary-item-name">
                        <strong>{item.name}</strong>
                        <small>Qty: {item.quantity}</small>
                      </div>
                      <strong>₹{item.price * item.quantity}</strong>
                    </div>
                  ))}

                  <hr />
                  <div className="bill-row"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
                  <div className="bill-row">
                    <span>Shipping</span><strong>{shipping ? `₹${shipping}` : 'Free'}</strong>
                  </div>
                  {validCoupon && (
                    <div className="bill-row discount-row">
                      <span>{appliedCoupon} discount</span><strong>-₹{discount}</strong>
                    </div>
                  )}
                  <hr />
                  <div className="bill-row final-total">
                    <span>Total</span><strong>₹{finalTotal}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="section-label">SMALL THINGS, BIG LOVE</p>
          <h1 className="brand-hero">loops<span>nd</span>threads</h1>
          <p className="hero-tagline">HANDMADE WITH LOVE</p>
          <p className="hero-text">
            Beautiful crochet pieces, carefully handmade with love, one stitch
            at a time.
          </p>
          <div className="hero-buttons">
            <a href="#shop" className="primary-btn">Shop Collection</a>
            <a href="#custom" className="secondary-btn">Custom Order →</a>
          </div>
        </div>
        <div className="hero-art"><span>🧶</span><div>Made with love ♡</div></div>
      </section>

      {/* SHOP */}
      <section className="products-section" id="shop">
        <div className="section-heading">
          <p className="section-label">OUR FAVOURITES</p>
          <h2>Handmade goodies</h2>
          <p>Little things, lovingly crocheted for you.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* BOUQUET SECTION */}
      <section className="bouquet-section" id="bouquets">
        <div className="section-heading">
          <p className="section-label">FLOWERS THAT LAST FOREVER</p>
          <h2>The Bouquet Collection</h2>
          <p>Handmade blooms for birthdays, anniversaries and your favourite people.</p>
        </div>
        <div className="bouquet-card">
          <div className="bouquet-photo">
            <img src={roseBouquet} alt="Rose Bouquet" loading="lazy" />
          </div>
          <div className="bouquet-details">
            <p className="product-category">CROCHET BOUQUET</p>
            <h3>Rose Bouquet</h3>
            <strong className="bouquet-price">₹999</strong>
            <p>{bouquet.description}</p>
            <button className="add-cart-btn" onClick={() => addToCart(bouquet)}>
              Add Bouquet to Cart <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-icon">🧶</div>
        <div>
          <p className="section-label">OUR STORY</p>
          <h2>Made one loop at a time.</h2>
          <p>
            Every piece at loopsndthreads is handmade with patience,
            creativity and a whole lot of heart.
          </p>
        </div>
      </section>

      {/* CUSTOM */}
      <section className="custom-section" id="custom">
        <p className="section-label">MAKE IT YOURS</p>
        <h2>Have something special in mind?</h2>
        <p>Tell us what you're imagining and we'll crochet it especially for you.</p>
        <a href="#contact" className="primary-btn">Get in Touch →</a>
      </section>

      <footer id="contact">
        <a href="#home" className="logo">loops<span>nd</span>threads</a>
        <p>Thoughtfully crocheted, one loop at a time. 🧶</p>
        <p>© 2026 loopsndthreads. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
