import { reactive } from 'vue'
import { Product } from '../domain/model/product.entity.js'
import { Category } from '../domain/model/category.entity.js'
import { Review } from '../domain/model/review.entity.js'
import { ProductFilter } from '../domain/model/product-filter.entity.js'
import { ProductApi } from '../infrastructure/product-api.js'
import { CategoryApi } from '../infrastructure/category-api.js'
import { ProductAssembler } from '../infrastructure/product.assembler.js'
import { CategoryAssembler } from '../infrastructure/category.assembler.js'

const productApi  = new ProductApi()
const categoryApi = new CategoryApi()

// ─── Mock Data ────────────────────────────────────────────
const MOCK_CATEGORIES = [
  new Category({ id: '1', name: 'Serums',       description: 'Target specific skin concerns with concentrated actives', productCount: 3 }),
  new Category({ id: '2', name: 'Toners',        description: 'Balance and prepare skin for the next skincare steps', productCount: 2 }),
  new Category({ id: '3', name: 'Cleansers',     description: 'Remove impurities without stripping the skin barrier', productCount: 2 }),
  new Category({ id: '4', name: 'Moisturizers',  description: 'Hydrate and strengthen the skin barrier all day long', productCount: 2 }),
  new Category({ id: '5', name: 'Ampoules',      description: 'Intensive treatment for targeted skin concerns', productCount: 1 }),
  new Category({ id: '6', name: 'Lip Care',      description: 'Nourish and protect delicate lip skin', productCount: 1 }),
  new Category({ id: '7', name: 'Essences',      description: 'Lightweight hydration and nutrient delivery', productCount: 1 })
]

const MOCK_PRODUCTS = [
  new Product({
    id: '1', name: 'Vitamin C Brightening Serum',
    description: 'A high-potency serum that visibly brightens, evens skin tone, and protects against environmental aggressors. Formulated with 15% L-Ascorbic Acid combined with Vitamin E and Ferulic Acid for enhanced stability.',
    price: 48, stock: 85, images: ['https://images.unsplash.com/photo-1747303969063-3b90bcb3942e?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['L-Ascorbic Acid 15%', 'Vitamin E (Tocopherol)', 'Ferulic Acid', 'Hyaluronic Acid', 'Panthenol', 'Allantoin'],
    skinTypes: ['Normal', 'Oily', 'Combination'], tag: 'NEW', isNew: true, rating: 4.8, reviewCount: 124,
    category: { id: '1', name: 'Serums' }
  }),
  new Product({
    id: '2', name: 'Hyaluronic Acid Plumping Toner',
    description: 'A deeply hydrating toner with multiple weights of hyaluronic acid to attract and retain moisture at different skin layers. Leaves skin visibly plump and smooth after just one use.',
    price: 32, stock: 120, images: ['https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Sodium Hyaluronate', 'Hydrolyzed Hyaluronic Acid', 'Glycerin', 'Niacinamide 5%', 'Centella Asiatica Extract'],
    skinTypes: ['All', 'Dry', 'Dehydrated'], tag: 'BESTSELLER', isNew: false, rating: 4.7, reviewCount: 238,
    category: { id: '2', name: 'Toners' }
  }),
  new Product({
    id: '3', name: 'Gentle Milky Cleanser',
    description: 'A creamy, sulfate-free cleanser that effectively removes makeup, sunscreen, and impurities while maintaining the skin\'s natural moisture barrier. Leaves skin clean, soft, and never tight.',
    price: 28, stock: 95, images: ['https://images.unsplash.com/photo-1629380108660-bd39c778a721?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Ceramide NP', 'Niacinamide', 'Panthenol', 'Sodium PCA', 'Allantoin'],
    skinTypes: ['Dry', 'Sensitive', 'Normal'], tag: null, isNew: false, rating: 4.6, reviewCount: 89,
    category: { id: '3', name: 'Cleansers' }
  }),
  new Product({
    id: '4', name: 'Hydra Boost Moisturizer',
    description: 'A rich yet lightweight moisturizer that delivers 72-hour hydration. Packed with ceramides to reinforce the skin barrier and lock in moisture for visibly plumper, smoother skin.',
    price: 62, stock: 67, images: ['https://images.unsplash.com/photo-1748543668676-ea8241cb3886?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Ceramide Complex', 'Shea Butter', 'Squalane', 'Hyaluronic Acid', 'Glycerin', 'Peptide Complex'],
    skinTypes: ['Dry', 'Normal', 'Sensitive'], tag: 'BESTSELLER', isNew: false, rating: 4.9, reviewCount: 312,
    category: { id: '4', name: 'Moisturizers' }
  }),
  new Product({
    id: '5', name: 'Retinol 0.5% Night Serum',
    description: 'A gentle yet effective retinol serum that visibly reduces fine lines, improves skin texture, and enhances radiance over time. Encapsulated retinol ensures gradual release and maximum tolerance.',
    price: 58, stock: 45, images: ['https://images.unsplash.com/photo-1702475139570-b90434243af2?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Retinol 0.5% (Encapsulated)', 'Bakuchiol', 'Ceramide NP', 'Peptide Complex', 'Vitamin E'],
    skinTypes: ['Normal', 'Combination', 'Mature'], tag: null, isNew: false, rating: 4.5, reviewCount: 167,
    category: { id: '1', name: 'Serums' }
  }),
  new Product({
    id: '6', name: 'Niacinamide 10% + Zinc Serum',
    description: 'A targeted treatment that minimizes pores, controls excess sebum, and fades post-acne marks. Combines 10% Niacinamide with 1% Zinc PCA for superior pore-refining benefits.',
    price: 36, stock: 140, images: ['https://images.unsplash.com/photo-1741896135490-4062a3b21abf?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Hyaluronic Acid', 'Panthenol', 'Allantoin'],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'], tag: 'BESTSELLER', isNew: false, rating: 4.8, reviewCount: 445,
    category: { id: '1', name: 'Serums' }
  }),
  new Product({
    id: '7', name: 'Snail Mucin 96% Essence',
    description: 'A cult-favourite essence with 96% snail secretion filtrate to repair the skin barrier, fade scars, and deliver intense hydration. A multitasking powerhouse suitable for all skin types.',
    price: 42, stock: 78, images: ['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Snail Secretion Filtrate 96%', 'Sodium Hyaluronate', 'Panthenol', 'Arginine', 'Allantoin'],
    skinTypes: ['All'], tag: null, isNew: false, rating: 4.7, reviewCount: 521,
    category: { id: '7', name: 'Essences' }
  }),
  new Product({
    id: '8', name: 'Ceramide Repair Ampoule',
    description: 'An intensive barrier-repair ampoule packed with a full ceramide complex and skin-identical lipids. Ideal for compromised, reactive, or sensitized skin that needs deep repair.',
    price: 68, stock: 8, images: ['https://images.unsplash.com/photo-1573575155376-b5010099301b?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Ceramide Complex (NP/AP/EOP)', 'Cholesterol', 'Fatty Acids', 'Squalane', 'Peptide Complex'],
    skinTypes: ['Sensitive', 'Dry', 'Compromised'], tag: 'NEW', isNew: true, rating: 4.6, reviewCount: 53,
    category: { id: '5', name: 'Ampoules' }
  }),
  new Product({
    id: '9', name: 'Green Tea Balancing Toner',
    description: 'An antioxidant-rich toner with 80% green tea extract to control excess oil, tighten pores, and soothe irritation. Lightweight formula absorbs instantly without stickiness.',
    price: 26, stock: 103, images: ['https://images.unsplash.com/photo-1586212653598-40f9046fe5e3?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Green Tea Extract 80%', 'BHA 0.1%', 'Centella Asiatica', 'Niacinamide', 'Allantoin'],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'], tag: null, isNew: false, rating: 4.5, reviewCount: 178,
    category: { id: '2', name: 'Toners' }
  }),
  new Product({
    id: '10', name: 'SPF 50 Invisible Sunscreen',
    description: 'A lightweight, invisible sunscreen providing broad-spectrum SPF 50+ protection without a white cast. Doubles as a moisturizer with a silky, non-greasy finish perfect for daily wear.',
    price: 45, stock: 88, images: ['https://images.unsplash.com/photo-1521223344201-d169129f7b7d?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Niacinamide', 'Hyaluronic Acid', 'Vitamin E'],
    skinTypes: ['All', 'Sensitive'], tag: 'NEW', isNew: true, rating: 4.4, reviewCount: 76,
    category: { id: '4', name: 'Moisturizers' }
  }),
  new Product({
    id: '11', name: 'Shea & Honey Lip Sleeping Mask',
    description: 'An overnight lip treatment that deeply nourishes, repairs, and plumps chapped lips while you sleep. Infused with shea butter, honey extract, and hyaluronic acid for lasting softness.',
    price: 18, stock: 155, images: ['https://images.unsplash.com/photo-1742104134174-45edfbeb7487?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Shea Butter', 'Honey Extract', 'Hyaluronic Acid', 'Vitamin E', 'Beeswax'],
    skinTypes: ['All'], tag: null, isNew: false, rating: 4.6, reviewCount: 203,
    category: { id: '6', name: 'Lip Care' }
  }),
  new Product({
    id: '12', name: 'BHA 2% Exfoliating Cleanser',
    description: 'A gentle exfoliating cleanser with 2% salicylic acid to unclog pores, remove excess oil, and prevent breakouts. Soothing centella asiatica minimizes irritation.',
    price: 34, stock: 72, images: ['https://images.unsplash.com/photo-1760860992928-221d73c4c0cc?w=800&q=80&fit=crop&auto=format'],
    ingredients: ['Salicylic Acid 2%', 'Centella Asiatica', 'Glycerin', 'Niacinamide', 'Aloe Vera Extract'],
    skinTypes: ['Oily', 'Combination', 'Acne-Prone'], tag: null, isNew: false, rating: 4.3, reviewCount: 94,
    category: { id: '3', name: 'Cleansers' }
  })
]

const MOCK_REVIEWS = {
  '1': [
    new Review({ id: 'r1', customerId: 'c1', customerName: 'Sofia M.', rating: 5, comment: 'Absolutely love this serum! My skin tone has visibly evened out in just 3 weeks. Worth every penny.', createdAt: '2026-03-15' }),
    new Review({ id: 'r2', customerId: 'c2', customerName: 'Camille R.', rating: 5, comment: 'Best vitamin C serum I\'ve tried. No oxidation issues and absorbs beautifully.', createdAt: '2026-02-28' }),
    new Review({ id: 'r3', customerId: 'c3', customerName: 'Mia T.', rating: 4, comment: 'Slight tingling at first but my skin looks so much brighter now! Great product.', createdAt: '2026-02-10' })
  ],
  '4': [
    new Review({ id: 'r4', customerId: 'c4', customerName: 'Lena K.', rating: 5, comment: 'This moisturizer is pure magic. My skin drinks it up and stays hydrated all day.', createdAt: '2026-04-01' }),
    new Review({ id: 'r5', customerId: 'c5', customerName: 'Priya S.', rating: 5, comment: 'Finally found my HG moisturizer. Works perfectly under makeup too.', createdAt: '2026-03-22' })
  ],
  '6': [
    new Review({ id: 'r6', customerId: 'c6', customerName: 'Anna W.', rating: 5, comment: 'Reduced my pores noticeably after 4 weeks. My oily T-zone is so much better.', createdAt: '2026-04-05' }),
    new Review({ id: 'r7', customerId: 'c7', customerName: 'Jade L.', rating: 5, comment: 'The best niacinamide serum I\'ve tried. Faded my acne marks fast!', createdAt: '2026-03-18' })
  ],
  '7': [
    new Review({ id: 'r8', customerId: 'c8', customerName: 'Rachel T.', rating: 5, comment: 'I go through a bottle every month. The texture is unique but works incredibly well.', createdAt: '2026-04-10' })
  ]
}

// ─── Store ────────────────────────────────────────────────
export const catalogStore = reactive({
  products: [...MOCK_PRODUCTS],
  displayedProducts: [...MOCK_PRODUCTS],
  categories: [...MOCK_CATEGORIES],
  selectedCategory: null,
  activeFilter: new ProductFilter(),
  searchQuery: '',
  isLoading: false,
  currentProduct: null,
  currentProductReviews: [],

  _recomputeDisplayed() {
    let result = [...this.products]

    if (this.selectedCategory) {
      result = result.filter(p => p.category?.id === this.selectedCategory.id)
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.ingredients.some(i => i.toLowerCase().includes(q))
      )
    }

    this.displayedProducts = this.activeFilter.apply(result)
  },

  fetchProducts() {
    this.isLoading = true
    productApi.getAll()
      .then(response => {
        this.products = ProductAssembler.toEntitiesFromResponse(response)
        this._recomputeDisplayed()
      })
      .catch(() => {
        this.products = [...MOCK_PRODUCTS]
        this._recomputeDisplayed()
      })
      .finally(() => { this.isLoading = false })
  },

  fetchCategories() {
    categoryApi.getAll()
      .then(response => {
        this.categories = CategoryAssembler.toEntitiesFromResponse(response)
      })
      .catch(() => {
        this.categories = [...MOCK_CATEGORIES]
      })
  },

  filterByCategory(category) {
    this.selectedCategory = category
    this._recomputeDisplayed()
  },

  applyFilter(filter) {
    this.activeFilter = filter instanceof ProductFilter ? filter : new ProductFilter(filter)
    this._recomputeDisplayed()
  },

  searchProducts(query) {
    this.searchQuery = query
    this._recomputeDisplayed()
  },

  fetchProductById(id) {
    this.currentProduct = null
    this.currentProductReviews = []
    productApi.getById(id)
      .then(response => {
        this.currentProduct = ProductAssembler.toEntityFromResource(response.data)
        this.currentProductReviews = MOCK_REVIEWS[id] || []
      })
      .catch(() => {
        this.currentProduct = MOCK_PRODUCTS.find(p => p.id === id) || null
        this.currentProductReviews = MOCK_REVIEWS[id] || []
      })
  },

  createProduct(data) {
    const newProduct = { ...data, id: String(Date.now()), rating: 0, reviewCount: 0, images: [] }
    productApi.create(newProduct).catch(() => {})
    this.products.push(new Product(newProduct))
    this._recomputeDisplayed()
  },

  updateProduct(data) {
    productApi.update(data.id, data).catch(() => {})
    const idx = this.products.findIndex(p => p.id === data.id)
    if (idx !== -1) Object.assign(this.products[idx], data)
    this._recomputeDisplayed()
  },

  deleteProduct(id) {
    productApi.delete(id).catch(() => {})
    const idx = this.products.findIndex(p => p.id === id)
    if (idx !== -1) {
      this.products.splice(idx, 1)
      this._recomputeDisplayed()
    }
  },

  createCategory(data) {
    const newCat = { ...data, id: String(Date.now()), productCount: 0 }
    categoryApi.create(newCat).catch(() => {})
    this.categories.push(new Category(newCat))
  },

  updateCategory(data) {
    categoryApi.update(data.id, data).catch(() => {})
    const idx = this.categories.findIndex(c => c.id === data.id)
    if (idx !== -1) Object.assign(this.categories[idx], data)
  },

  deleteCategory(id) {
    categoryApi.delete(id).catch(() => {})
    const idx = this.categories.findIndex(c => c.id === id)
    if (idx !== -1) this.categories.splice(idx, 1)
  }
})
