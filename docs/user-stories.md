# User Stories

## Overview

This document contains the user stories for the SkinLab application, covering both the customer-facing storefront and the administrator dashboard.

## User Stories for Skincare App

---

### US001: Email Subscription Pop-up

**As a** Customer, **I want to** see a subscription pop-up when I first enter the application, **so that** I can register my email and receive a welcome discount as a new customer.

**Scenario 1: Pop-up displays on first visit**

- **Given** the Customer accesses the application for the first time
- **When** the page loads
- **Then** the system displays a pop-up with an email input field and a message indicating the welcome discount for new customers

**Scenario 2: Successful subscription**

- **Given** the Customer enters a valid email address in the pop-up
- **When** the Customer clicks the subscribe button
- **Then** the system registers the email, closes the pop-up, and displays a confirmation message with the discount code

**Scenario 3: Pop-up not shown on return visit**

- **Given** the Customer has already subscribed in a previous session
- **When** the Customer accesses the application again
- **Then** the system does not display the subscription pop-up

**Scenario 4: Customer dismisses the pop-up**

- **Given** the Customer does not wish to subscribe
- **When** the Customer clicks the close button on the pop-up
- **Then** the system dismisses the pop-up and allows the Customer to continue browsing normally

---

### US002: View Landing Page

**As a** Customer, **I want to** view a visually appealing landing page upon entering the application, **so that** I can discover the brand, its featured products, and current promotions.

**Scenario 1: Hero section is displayed**

- **Given** the Customer accesses the application
- **When** the landing page loads
- **Then** the system displays a hero section with a full-width banner image, a brand slogan, and a call-to-action button redirecting to the catalog

**Scenario 2: Featured products and categories are visible**

- **Given** the Customer is on the landing page
- **When** the Customer scrolls down
- **Then** the system displays sections for best-selling products, main skincare categories, and promotional banners

**Scenario 3: Customer testimonials are displayed**

- **Given** the Customer continues scrolling the landing page
- **When** the testimonials section renders
- **Then** the system displays customer reviews including name, rating, and comment

**Scenario 4: Announcement banner is visible**

- **Given** the Customer accesses the application
- **When** the page loads
- **Then** the system displays a top announcement banner with current promotions or free shipping thresholds

---

### US003: Browse Products by Category

**As a** Customer, **I want to** browse products organized by category, **so that** I can easily find what I need based on my skincare routine.

**Scenario 1: All categories are displayed**

- **Given** the Customer accesses the product catalog
- **When** the page loads
- **Then** the system displays the available categories: Lip Care, Cleansers, Toners, Essences, Moisturizers, Ampoules, and Serums

**Scenario 2: Customer selects a category**

- **Given** the Customer is browsing the catalog
- **When** the Customer clicks on a category
- **Then** the system displays only the products belonging to that category and highlights it as active

**Scenario 3: No products available in a category**

- **Given** the Customer selects a category
- **When** no products are currently assigned to it
- **Then** the system displays an informative message indicating that no products are available in that category

---

### US004: Filter and Sort Products

**As a** Customer, **I want to** filter and sort the product catalog, **so that** I can find the right product according to my preferences and budget.

**Scenario 1: Sort by price**

- **Given** the Customer is on the catalog or a category page
- **When** the Customer selects the "Price: Low to High" or "Price: High to Low" sort option
- **Then** the system reorders the displayed products accordingly

**Scenario 2: Sort by popularity**

- **Given** the Customer is browsing the catalog
- **When** the Customer selects "Most Popular"
- **Then** the system reorders the products based on their number of sales or ratings

**Scenario 3: Sort by newest**

- **Given** the Customer is browsing the catalog
- **When** the Customer selects "Newest"
- **Then** the system displays the most recently added products first

**Scenario 4: Real-time filter update**

- **Given** the Customer applies any sort or filter option
- **When** the selection is made
- **Then** the system updates the product list in real time without reloading the page

---

### US005: Search Products

**As a** Customer, **I want to** search for products by name or keyword, **so that** I can quickly find a specific product without browsing the entire catalog.

**Scenario 1: Customer performs a search**

- **Given** the Customer is on any page of the application
- **When** the Customer types a keyword into the search bar and submits
- **Then** the system displays all products whose name or description matches the keyword

**Scenario 2: No results found**

- **Given** the Customer performs a search
- **When** no products match the keyword
- **Then** the system displays a message indicating no results were found and suggests browsing by category

---

### US006: View Product Detail

**As a** Customer, **I want to** view the full detail of a product, **so that** I can make an informed decision before adding it to my cart.

**Scenario 1: Product detail page loads**

- **Given** the Customer clicks on a product from the catalog or landing page
- **When** the product detail page loads
- **Then** the system displays the product's name, images, price, description, key ingredients, recommended skin type, and customer ratings

**Scenario 2: Product is in stock**

- **Given** the Customer is on a product detail page
- **When** the product has available stock
- **Then** the system enables the "Add to Cart" button and displays the available quantity

**Scenario 3: Product is out of stock**

- **Given** the Customer is on a product detail page
- **When** the product has no available stock
- **Then** the system displays the "Add to Cart" button as disabled with the label "Out of Stock"

**Scenario 4: Customer views product ratings**

- **Given** the Customer is on a product detail page
- **When** the ratings section renders
- **Then** the system displays the average star rating and individual customer reviews including name, score, and comment

---

### US007: Manage Wishlist

**As a** Customer, **I want to** add products to my wishlist, **so that** I can save them and purchase them at a later time.

**Scenario 1: Customer adds a product to the wishlist**

- **Given** the Customer is viewing a product
- **When** the Customer clicks the heart/favorite icon
- **Then** the system adds the product to the wishlist and updates the icon to its active state

**Scenario 2: Customer views the wishlist**

- **Given** the Customer navigates to the wishlist section
- **When** the page loads
- **Then** the system displays all saved products with their image, name, price, and an "Add to Cart" button

**Scenario 3: Customer removes a product from the wishlist**

- **Given** the Customer is on the wishlist page
- **When** the Customer clicks the remove icon on a product
- **Then** the system removes the product from the wishlist and updates the view

**Scenario 4: Customer not logged in attempts to add to wishlist**

- **Given** the Customer is not logged in
- **When** the Customer clicks the favorite icon on a product
- **Then** the system prompts the Customer to log in or register before saving the product

---

### US008: Manage Shopping Cart

**As a** Customer, **I want to** add, update, and remove products from my cart, **so that** I can review and adjust my purchase before checking out.

**Scenario 1: Customer adds a product to the cart**

- **Given** the Customer clicks "Add to Cart" from any view
- **When** the action is triggered
- **Then** the system adds the product to the cart and updates the cart icon counter in the navbar

**Scenario 2: Customer views the cart**

- **Given** the Customer opens the cart
- **When** the cart loads
- **Then** the system displays all products with their image, name, unit price, quantity selector, subtotal, and the overall total

**Scenario 3: Customer updates product quantity**

- **Given** the Customer is in the cart
- **When** the Customer changes the quantity of a product
- **Then** the system automatically recalculates the subtotal and the overall total

**Scenario 4: Customer removes a product from the cart**

- **Given** the Customer is in the cart
- **When** the Customer clicks the remove icon on a product
- **Then** the system removes the product and recalculates the total

**Scenario 5: Customer applies a discount code**

- **Given** the Customer has a valid discount code
- **When** the Customer enters and applies it in the cart
- **Then** the system deducts the corresponding percentage or amount from the total and displays the updated price

---

### US009: Complete Checkout

**As a** Customer, **I want to** complete the checkout process, **so that** I can finalize my purchase and receive my order.

**Scenario 1: Customer proceeds to checkout**

- **Given** the Customer has products in the cart
- **When** the Customer clicks "Proceed to Checkout"
- **Then** the system displays a checkout form requesting shipping address and payment information

**Scenario 2: Order is confirmed**

- **Given** the Customer completes the checkout form with valid data
- **When** the Customer confirms the order
- **Then** the system processes the order and displays a confirmation page with the order number and summary

**Scenario 3: Customer not logged in proceeds to checkout**

- **Given** the Customer is not logged in and clicks "Proceed to Checkout"
- **When** the action is triggered
- **Then** the system prompts the Customer to log in, register, or continue as a guest

---

### US010: Track Orders

**As a** Customer, **I want to** view my order history and track the status of my orders, **so that** I know when my products will arrive.

**Scenario 1: Customer views order history**

- **Given** the Customer is logged in and accesses "My Orders"
- **When** the page loads
- **Then** the system displays a list of past orders with order number, date, products, and status

**Scenario 2: Customer tracks an order**

- **Given** the Customer selects an order from the history
- **When** the order detail page loads
- **Then** the system displays the current shipping status and estimated delivery date

---

### US011: Manage Customer Account

**As a** Customer, **I want to** register, log in, and manage my account, **so that** I can access my personal data, orders, and wishlist.

**Scenario 1: Customer registers an account**

- **Given** a new visitor wants to create an account
- **When** the visitor completes the registration form with name, email, and password and submits it
- **Then** the system creates the account and grants the Customer access to the platform

**Scenario 2: Customer logs in**

- **Given** the Customer has an existing account
- **When** the Customer enters valid credentials and submits
- **Then** the system grants access to the customer dashboard

**Scenario 3: Customer updates personal data**

- **Given** the Customer is in the "My Account" section
- **When** the Customer edits and saves their personal information
- **Then** the system updates the data and displays a confirmation message

**Scenario 4: Customer logs out**

- **Given** the Customer is logged in
- **When** the Customer clicks "Log Out"
- **Then** the system ends the session and redirects to the landing page

---

### US012: View About Us Section

**As a** Customer, **I want to** access information about the company, **so that** I can learn about the brand's story and values before making a purchase.

**Scenario 1: About Us section loads**

- **Given** the Customer clicks on "About Us" from the navigation menu
- **When** the section loads
- **Then** the system displays the brand's story, mission, vision, values, and representative images

---

### US013: Navigate Footer

**As a** Customer, **I want to** access the page footer, **so that** I can find navigation links, social media, support, FAQ, and subscribe to the newsletter.

**Scenario 1: Footer is displayed**

- **Given** the Customer scrolls to the bottom of any page
- **When** the footer renders
- **Then** the system displays sections for quick navigation, social media links, FAQ, customer support contact, and a newsletter subscription form

**Scenario 2: Customer clicks a social media link**

- **Given** the Customer is in the footer
- **When** the Customer clicks a social media icon
- **Then** the system opens the corresponding social media page in a new tab

**Scenario 3: Customer subscribes via footer newsletter form**

- **Given** the Customer enters a valid email in the footer subscription form
- **When** the Customer submits the form
- **Then** the system registers the email and displays a success confirmation message

---

### US014: Switch Application Language

**As a** Customer, **I want to** switch the application language, **so that** I can interact with the platform in my preferred language.

**Scenario 1: Customer changes the language**

- **Given** the Customer is using the application
- **When** the Customer selects a language from the language switcher (English or Spanish)
- **Then** the system updates all visible text to the chosen language without reloading the page

**Scenario 2: Language preference is preserved**

- **Given** the Customer has selected a preferred language
- **When** the Customer navigates to a different section
- **Then** the system maintains the selected language across all pages

---

### US015: Manage Product Catalog

**As an** Administrator, **I want to** add, edit, and delete products from the catalog, **so that** I can keep the inventory updated and organized.

**Scenario 1: Administrator adds a product**

- **Given** the Administrator is on the dashboard and clicks "Add Product"
- **When** the Administrator completes the form with name, description, price, category, ingredients, skin type, stock, and images and submits
- **Then** the system registers the product and makes it visible in the customer catalog

**Scenario 2: Administrator edits a product**

- **Given** the Administrator selects an existing product and clicks "Edit"
- **When** the Administrator modifies the data and saves
- **Then** the system updates the product information across the catalog

**Scenario 3: Administrator deletes a product**

- **Given** the Administrator clicks "Delete" on a product
- **When** the Administrator confirms the action in the confirmation dialog
- **Then** the system removes the product from the catalog and displays a confirmation message

---

### US016: Manage Categories

**As an** Administrator, **I want to** create, edit, and delete product categories, **so that** I can keep the catalog well structured.

**Scenario 1: Administrator creates a category**

- **Given** the Administrator is in the categories section and clicks "Add Category"
- **When** the Administrator enters the category name and confirms
- **Then** the system registers the category and makes it available when assigning products

**Scenario 2: Administrator edits a category**

- **Given** the Administrator selects an existing category and clicks "Edit"
- **When** the Administrator updates the name and saves
- **Then** the system updates the category name across all associated products

**Scenario 3: Administrator deletes a category with associated products**

- **Given** the Administrator clicks "Delete" on a category that has products assigned
- **When** the action is triggered
- **Then** the system displays a warning indicating the number of associated products before allowing the Administrator to proceed

---

### US017: Manage Administrator Account

**As an** Administrator, **I want to** access and update my account information, **so that** I can keep my credentials secure and my profile up to date.

**Scenario 1: Administrator views profile**

- **Given** the Administrator accesses "My Profile" from the dashboard
- **When** the section loads
- **Then** the system displays the Administrator's name, email, and an option to change the password

**Scenario 2: Administrator updates profile data**

- **Given** the Administrator modifies their information
- **When** the Administrator saves the changes
- **Then** the system updates the data and displays a confirmation message

**Scenario 3: Administrator logs out**

- **Given** the Administrator is logged in to the dashboard
- **When** the Administrator clicks "Log Out"
- **Then** the system ends the session and redirects to the admin login page

---

### US018: Mobile Responsive Design

**As a** User (Customer or Administrator) on a mobile device, **I want to** navigate the application seamlessly from my phone, **so that** I can shop or manage products from anywhere.

**Scenario 1: Hamburger menu appears on mobile**

- **Given** the User accesses the application from a device with screen width ≤768px
- **When** the page loads
- **Then** the system replaces the horizontal navigation bar with a hamburger menu icon

**Scenario 2: Products display in single column on mobile**

- **Given** the User is browsing the product catalog on a mobile device
- **When** the product grid renders
- **Then** the system displays products in a single full-width column instead of multiple columns

**Scenario 3: Hero section is readable on mobile**

- **Given** the User views the hero section on a mobile device
- **When** the section renders
- **Then** the system displays text with a minimum font size of 16px and full-width CTA buttons

**Scenario 4: Touch targets meet minimum size**

- **Given** the User is navigating on a touch device
- **When** the User interacts with any button or link
- **Then** all interactive elements have a minimum touch target of 44x44px

**Scenario 5: Admin dashboard adapts to mobile**

- **Given** the Administrator accesses the dashboard from a mobile device
- **When** the interface loads
- **Then** the system adapts tables and forms to the available screen width while maintaining full functionality