### Chef Origin — Marketplace for Local Home-Cooked Meals

Chef Origin is a modern online platform that connects home cooks with people looking for fresh, homemade food. Customers can explore daily menus, check a chef’s availability, place orders, make secure payments, and track their orders in real time.
For home cooks, it provides an easy way to earn money from their kitchen without needing a physical restaurant. For customers, it offers access to healthy, affordable, homemade meals prepared by local chefs.

The platform includes features like user registration, food ordering, real-time order tracking, ratings and reviews, and role-based access control. Chef Origin will be built using the MERN stack (MongoDB, Express.js, React, Node.js).
Ensure the Following things to get 100% mark

● Include a README file with the project name, purpose, live URL, key features, and any npm packages you have used.
● Include at least 20 meaningful commits on the client side & 12 meaningful commits on the server side with descriptive messages.
● Secure Firebase configuration keys using environment variables.
● Secure your MongoDB credentials using the environment variable.
● Create a design that encourages recruiters. Color contrast should please the eye & ensure that the website has proper alignment, space, and the website does not express gobindo design.  
● If we found your project similar to any project of your module / conceptual / assignment. You will get 0 and may miss the chance of any upcoming reward.  
Deployment Guideline
If your Deployment is not okay you will get 0 and may miss the chance of our upcoming rewards.  
● Ensure that your server is working perfectly on production and not throwing any CORS / 404 / 504 Errors.  
● Ensure that your Live Link is working perfectly and that it is not showing errors on Landing in your system.  
● ⚠ ensure that the page doesn't throw any error on reloading from any routes.  
● ⚠ Add your domain for authorization to Firebase if you use Netlify / surge / Vercel
● ⚠ Logged in User must not redirect to Login on reloading any private route  
1.User Roles and Permissions
Role Management
The system will include three main user roles:
● Admin
Has full system access, including managing users, chefs, orders, and platform settings.

● Chef
Can upload menus, manage food items, and handle customer orders.

● Normal User (Customer)
Can browse meals, place orders, and leave reviews.

2. User Authentication (Public)
   Registration
   The platform will include a registration page where users can create an account.By default, every newly registered user will be assigned the role "user" use firebase authentication to implement user registration and login.
   Important: Email verification and password reset/forgot-password features are not required for the assignment, as they may inconvenience the evaluator. You may add them later after the project review.
   Registration Form Fields
   ● Email

● Name

● Profile Image(you can use image upload method or give direct image link)

● Address

● Password

● Confirm Password

User Status
Every user will have a default status: "active" .No social login/register (Google, Facebook, etc.) is required.
Login
The application will include a login page where users can log in using their email and password.Users should be able to navigate from the login page to the registration page and vice versa easily.
3.Layout & Required Pages
Navbar
The top navigation bar will include:
● Logo + Project Name

● Navigation Links:

○ Home

○ Meals

● Dashboard (visible only after login)

● Authentication Buttons:

○ If the user is not logged in → Show Login / Register buttons

○ If the user is logged in → Show Logout button and the user’s profile picture in the navbar

Footer
The footer section will include:
● Contact Details

● Social Media Links

● Working Hours

● Copyright Information 4. Main Pages
Home Page(public)
Must include:
● Animated Hero/ Banner Section (Framer Motion)
● Dynamic Daily Meals Section show 6 data in card layout (fetch data from server)

● Customer Reviews section(fetch data from server)

● Add one Extra Section
5.Meals Page(public)
The Meals Page will display a list of daily meals in a card layout.Each meal card must include:
● Chef Name
● Chef Id

● Food image

● Food Price

● Food Rating
● Delivery Area

● “See Details” Button
The page must include - Sort Button: Allows users to sort meals by Price in either ascending or descending order.
View Details Access
● If the user is logged in, clicking “See Details” will take them to the Meal Details Page.

● If the user is not logged in, they will be redirected to the Login Page before accessing details.
6.View Details Page(Private) The Meal Details Page will show complete information about the selected meal.
Users must be logged in to access this page. (If not logged in → redirect to Login Page.)
Meal Information to Display
The page must show details such as:
● Food Name

● Chef Name

● Food Image

● Price

● Rating

● Ingredients
● Delivery Area

● Estimated Delivery Time

● Chef’s Experience
● Chef Id
● Order Now (When a user clicks “Order Now”, they will be taken to the Order Page, where they can confirm their order and complete the purchase.)
Review Section
The details page must include a Review Section where users can read and submit reviews for that specific meal.
Features of the Review Section

1. Display Existing Reviews
   ● Show all reviews that other users have given for this specific meal.

● Each review should include:

○ Reviewer Name

○ Reviewer Image

○ Rating/Stars

○ Comment

○ Date 2. Add Review and Add to Favorite Button
● There will be a button: “Give Review”

● When the user submits a review:

○ The review will be saved in MongoDB under that specific food Review collection.
○ A success message will appear after submitting a review. (example: “Review submitted successfully!”).

○ The page should instantly update to show the newly added review along with existing reviews.
Data will be saved on mongodb in this formate:  
{
"\_id": "6759d2a4f12ab34567890fff",
“foodId”: "6759c1f4e12ab34567890abc" (This is the MongoDB \_id of the food item that this review belongs to.)
"reviewerName": "Ariana Sultana",
"reviewerImage": "https://i.ibb.co/sample-user.jpg",
"rating": 5,
"comment": "The food was delicious! Perfect taste and fast delivery.",
"date": "2025-01-15T12:45:00Z"
}
Favorite Button Requirement
When a user clicks the Favorite button on a meal:

1. The selected meal will be added to a “favorites” collection in MongoDB.

2. The following information must be saved in the favorites collection:
   {
   "\_id": "6759f12be12ab34567890999",
   "userEmail": "user@example.com", // logged-in user’s email
   "mealId": "M001", // ID of the selected meal
   "mealName": "Chicken Biriyani", // Name of the meal
   "chefId": "C001", // Chef ID
   "chefName": "Chef Rahim", // Chef name
   "price": "500",  
    "addedTime": "2025-11-27T16:00:00Z" // Time when added
   }
   If the meal is already in the user’s favorites, it should not be added again.Show a success message after the meal is added to favorites (SweetAlert or toast).
3. Order Page (Private)
   On the Order Page, there will be a form where the user confirms their order. Most fields will be filled automatically, and the user only needs to enter their address and quantity.There will be a collection in MongoDB named order_collection, where all order-related data will be stored.
   The order form must contain:
   ● mealName → auto-filled

● price → auto-filled

● quantity → user selects how many they want

● chefId → auto-filled

● userEmail → auto-filled

● userAddress → user must enter delivery address

● orderStatus → default: "pending"

● orderTime
● Confirm order button  
Confirm Order Button
When the user clicks it:
● Show a confirmation message: Your total price is ${totalPrice}. ● Do you want to confirm the order?

1. If the user clicks Yes:

○ Show a SweetAlert success message

■ Example: “Order placed successfully!”

○ Save the order data to the MongoDB database.Data will be saved in mongodb in this format:
{
"\_id": "6759f12be12ab34567890aaa",
"foodId": "6759c1f4e12ab34567890abc",(This is the MongoDB \_id of the food item that this review belongs to.)
"mealName": "Spicy Chicken Biriyani",
"price": 220,
"quantity": 2,
"chefId": "CH-009",
“paymentStatus”: “Pending”
"userEmail": "customer@example.com",
"userAddress": "House 12, Road 7, Mirpur DOHS, Dhaka",
"orderStatus": "pending",
"orderTime": "2025-01-20T14:32:00Z"
} 2. If user clicks Cancel:

○ Close the popup and do nothing.
Here, you need to multiply the price by the quantity to calculate the total price.

8. Dashboard Requirements
   ● User Dashboard
   ● My Profile

● My Orders

● My review
● Favorite Meal
● Chef Dashboard
● My Profile
● Create meal
● My Meals
● Order requests
● Admin Dashboard
● My Profile
● Manage User
● Mange request
● Platform Statistics 9. Profile Page(Private)
The Profile Page will display the logged-in user’s information.
The page must show:
● User Name

● User Email

● User Image

● User Address

● User Role (e.g., user / chef / admin)

● User Status (active / fraud)
● Chef Id (it will be shown only if the login user role is chef)

All fields should be neatly displayed in a card or section.
There will be two buttons:

1. Be a Chef

2. Be an Admin
   Conditional Display:
   ● If the user’s role is chef, hide the “Be a Chef” button.

● If the user’s role is admin, hide both buttons.
When a user clicks the “Be a Chef” or “Be an Admin” button on their profile page:A POST request must be sent to the admin with the following information:

{
"\_id": "6759f12be12ab345679845555",
"userName": "John Doe",
"userEmail": "john@example.com",
"requestType": "chef", // or "admin"
"requestStatus": "pending", // default
"requestTime": "2025-11-27T15:30:00Z"
}
requestStatus must be set to "pending" by default.requestTime must record the exact time when the request was sent.The admin will later view these requests in the Admin Dashboard and approve or reject them. 10. My order Page (Private)
The Order Page will display all orders the logged-in user has made in a card layout.Each order card must show the following details:
● Food Name → Name of the meal ordered

● Order Status → Current status (e.g., pending, preparing, delivered)

● Price → Price of the meal

● Quantity → Number of items ordered

● Delivery Time → Estimated delivery or order time

● Chef Name → Name of the chef who prepared the meal

● Chef ID → Unique ID of the chef
● Payment Status
Payment Requirements
● The Pay button will only appear when:

○ The order is accepted by the chef, and

○ The payment status is pending

● When the user clicks the Pay button:

○ Redirect them to the Stripe payment page and implement the payment functionality

● After a successful payment:

○ Save the payment history in MongoDB

○ Update the order’s paymentStatus → “paid”

○ Redirect the user to a Payment Success page

11. My Review (Private)
    The My Review Page will display all reviews made by the logged-in user.Each review should be displayed in a card or list layout.
    Each Review Must Show:
    ● Meal Name → The meal the review is for

● Rating → User’s rating

● Comment → User’s review text

● Date → When the review was submitted
Action Buttons for Each Review

1. Delete Button
   ● Clicking Delete will remove the review from MongoDB.

● Show a confirmation prompt before deletion. 2. Update Button
● Clicking Update will open a modal with the current review data.

● Users can edit the rating or comment.

● After submission, the updated review will replace the old review in MongoDB.

● Show a success message after the review is updated.

12. Favorite Meals Page (Private)
    The Favorite Meals Page will display all meals the logged-in user has added to their favorites. Data should be retrieved from the favorites collection in MongoDB.
    Display Requirements
    ● Show the favorite meals in a table format.

● Each row must include:

○ Meal Name

○ Chef Name

○ Price (optional if saved)

○ Date Added
○ Delete button
Delete Button
● Each row will have a Delete button.

● When clicked:

1. Remove the favorite meal from MongoDB.

2. Show a toast or alert message confirming deletion. Example: “Meal removed from favorites successfully.”
3. Create Meal (Private)
   The Create Meal Page allows a chef to add a new meal to the platform.All submitted meals will be saved in the meals collection in MongoDB.
   Form Fields
   The page must include the following fields:
   ● Food Name

● Chef Name

● Food Image (use image upload method not link)

● Price

● Rating

● Ingredients

● Estimated Delivery Time
● Chef’s Experience
● Chef ID – This ID is assigned once the admin approves you as a chef  
● User Email → Auto-filled, read-only
When the chef submits the form, the meal is added to the meals collection in MongoDB and shows a toast message.
{
"\_id": "656f1a7b9f1b3c0012345678",
"foodName": "Grilled Chicken Salad",
"chefName": "John Doe",
"foodImage": "https://example.com/images/grilled-chicken-salad.jpg",
"price": 12.99,
"rating": 0,
"ingredients": [
"Chicken breast",
"Lettuce",
"Tomatoes",
"Cucumber",
"Olive oil",
"Lemon juice",
"Salt",
"Pepper"
],
"estimatedDeliveryTime": "30 minutes",
"chefExperience": "5 years of experience in Mediterranean cuisine",
"chefId": "chef_123456",
"userEmail": "user@example.com",
"createdAt": { "$date": "2025-12-02T12:00:00Z" }
} 14. My Meals Page (Private)
The Meals Page will display all meals created by the logged-in chef in a card layout.
Each Meal Card Must Show
● Food Name

● Food Image

● Price

● Rating

● Ingredients

● Estimated Delivery Time

● Chef Name

● Chef ID  
● Delete and Update Button

Action Buttons for Each Meal

1. Delete Button
   ● Clicking Delete will remove the meal from MongoDB.

● Show a confirmation prompt before deletion.

● Show a success message after deletion.

2. Update Button
   ● Clicking Update will either: Open a modal with a form, or Redirect to an Update Meal Page with a pre-filled form.

● The form will contain all meal data and allow the chef to edit fields.

● When submitted, the meal data in MongoDB is updated.

● Show a success message after updating. 15. Order Requests Page (Private)
This page will display all orders placed by users for this specific chef.Only orders where chefId matches the logged-in chef’s ID should be shown.
Each Order Must Display:
● Food Name

● Price

● Quantity

● Order Status

● User Email

● Order Time
● UserAddress
● Payment Status
There will be Three button Cancel, Accept, Deliver in each card
Action Buttons for Each Order
Each order card must have these buttons:

1. Cancel
   ● Changes order status from pending → cancelled

● After clicking once, the button becomes disabled 2. Accept
● Changes order status from pending → accepted

● Button becomes disabled after click 3. Deliver
● Only enabled if the order is already accepted

● Changes order status from accepted → delivered

● After clicking, the button becomes disabled
Button Behavior Rules
● If the order is cancelled, all buttons must be disabled

● If the order is accepted, only Deliver button remains enabled

● If the order is delivered, all buttons must be disabled

● Chef and user should see live updated statuses after actions  
16. Manage Users Page (Private)
The Manage Users Page will allow the admin to view and manage all users on the platform.
Data to Display for Each User
Show all users in a table layout with the following fields:
● User Name

● User Email

● User Role (user / chef / admin)

● User Status (default: active, Every new user has status: “active” by default.)

● Make Fraud Button
Make Fraud
● If a user role is Admin, “Make Fraud” will be hide and it will be shown only if user role is chef or user

● When the admin clicks the button:

○ The user’s status will be updated to “fraud” in MongoDB.

○ Show a success message (toast or SweetAlert). 2. If User Is Already Fraud
● If the user’s status is fraud, hide the button or disable it.
Behavior Based on Fraud Status
If a Fraud User is a Customer (role: user)
● They cannot place any orders anywhere in the app.
If a Fraud User is a Chef (role: chef)
● Chefs will not be able to create any meal from the Create Meals page. 17. Manage Requests Page (Private)
This page allows the admin to view and manage all requests submitted by users who want to become Chef or Admin.

Data to Display for Each Request
Show all requests in a table layout with:
● User Name

● User Email

● Request Type (chef / admin)

● Request Status (pending / approved / rejected)

● Request Time

● Accept and Reject Button
Admin will have two buttons for each request:

1. Accept Request
   ● When clicked:

○ Update the user’s role in MongoDB:

■ If requestType = chef, update the user’s role to 'chef' in the user collection, and also generate a unique ChefId dynamically and save it inside the user document.Backend Hint generate chefId:
Check if the request type is chef.Generate a ChefId by combining "chef-" with a random 4-digit number using Math.floor(Any number + Math.random() \* Any number).Save the ChefId together with role: "chef" directly in the user collection.
■ If requestType = admin, Update the user role into chef in user collection.

○ Update the requestStatus → approved

○ Show a success message

○ Disable all buttons after approval

2. Reject Request
   ● When clicked:

○ Update requestStatus → rejected

○ User role does NOT change

○ Show a rejection message

○ Disable buttons after rejection 18. Platform Statistics Page (Private)
This page gives an overview of key platform metrics:
● Total Payment Amount → Sum of all payments made

● Total Users → Number of registered users

● Orders Pending → Orders not yet completed

● Orders Delivered → Orders successfully delivered

Display:
● Use Recharts to show these metrics visually.

○ Example: Bar chart or Pie chart for payments and orders

○ Cards or small numbers can show totals alongside the charts
This makes it easier for admins to see trends and platform performance at a glance. 19. Additional Requirements
● Create one loading page that shows up whenever the whole app is loading.

● Add a single error page that appears if something goes wrong in the app.

● Make sure the entire website works well on phones 20. Challenge Tasks
● The project must use JWT-based authentication for secure access.User receives a JWT token after login.The token must be stored safely (httpOnly cookie recommended).All protected routes and API requests should validate the token.Backend must verify the token before allowing access to protected data.This ensures the app is secure and prevents unauthorized access.
● Use react-hook-form in Every Form: All forms in the project must use react-hook-form for handling inputs, validation, and form submission.
● Dynamic Title in Every Route: Each page should change the browser tab title based on the current route.
● Pagination in Meals Page (10 Items per Page):The meals page must include pagination so that only 10 meals are shown per page. 21. Optional Tasks  
1.Use Axios interceptors
2.Implement search functionality  
3.Added animation on your website using
4.Add Dark and light theme toggle
