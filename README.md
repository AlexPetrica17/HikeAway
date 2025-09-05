# HikeAway 🥾🌲
**Web Application for Booking Guided Nature Tours**  
**Bachelor's Thesis Project**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Parcel](https://img.shields.io/badge/Parcel-b9b9b9?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Mapbox](https://img.shields.io/badge/Mapbox-FF6C00?style=for-the-badge&logo=mapbox&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-FF4500?style=for-the-badge)

---

> ⚠️ **Copyright Notice:**  
> This project was developed solely by **Alexandru-Nicolae Petrica** as part of his bachelor's thesis.  
> Other users do **not** have permission to copy, reuse, or redistribute this project.

---

## 📖 Description
HikeAway is a web application for discovering and booking guided nature tours.  
Users can explore tours on an interactive map, make reservations and online payments via Stripe, and leave reviews.  
Administrators can manage tours, bookings, and reviews through a dedicated dashboard.  
The system also supports automatic invoice generation and email notifications for confirmations and updates.

---

## ⚙️ Main Features
- 👤 **User Authentication & Account Management**  
- 🔍 **Tour Browsing** – interactive map and detailed tour info (Mapbox)  
- 📅 **Tour Booking**  
- 💳 **Secure Online Payments** (Stripe)  
- 🧾 **Automatic Invoice Generation**  
- 📧 **Automated Email Notifications** (Nodemailer)  
- ✍️ **Reviews Management**  
- 👨‍💼 **Admin Dashboard** – manage tours, bookings, reviews  

---

## 🏗️ Technologies Used
- **Back-end:** Node.js, Express.js, REST API  
- **Front-end:** Pug Templates, JavaScript, CSS, Parcel bundler  
- **Database:** MongoDB (Users, Tours, Bookings, Reviews)  
- **File Uploads:** Multer  
- **Maps:** Mapbox  
- **Payments:** Stripe  
- **Emails:** Nodemailer for automated notifications  

---

## 🚀 Local Setup
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/username/hikeaway.git
   cd hikeaway
   ```
2. **Install dependencies:**  
   ```bash
   npm install
   ```
3. **Create a `.env` file** with the following variables:  
   ```
   DATABASE=mongodb+srv://...
   PORT=3000
   JWT_SECRET=...
   STRIPE_SECRET_KEY=...
   MAPBOX_TOKEN=...
   EMAIL_HOST=...
   EMAIL_PORT=...
   EMAIL_USER=...
   EMAIL_PASSWORD=...
   ```
4. **Start the application:**  
   ```bash
   npm start
   ```
5. **Open in your browser:** `http://localhost:3000`  

---

## 📌 Future Directions
- Mobile optimization  
- Social/community features for hikers  
- Advanced reporting and analytics for administrators  
- Explore front-end frameworks (React/Vue) or GraphQL integration  

---

## 👨‍🎓 Author
**Alexandru-Nicolae Petrica** – Bachelor's Thesis Project  
Developed independently. No copying or redistribution allowed.

