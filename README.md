# HikeAway 🥾🌲
**Aplicație Web pentru rezervarea de tururi în natură**

## 📖 Descriere
HikeAway este o aplicație web pentru descoperirea și rezervarea de tururi ghidate în natură.  
Utilizatorii pot vizualiza tururi disponibile pe hartă, își pot face rezervări și plăți online prin Stripe, pot lăsa recenzii, iar administratorii pot gestiona tururile, rezervările și recenziile dintr-un panou dedicat.  
Aplicația include generarea automată de facturi și trimiterea de emailuri automate pentru confirmări și notificări.

## ⚙️ Funcționalități principale
- 👤 Autentificare și gestionare conturi utilizatori  
- 🔍 Vizualizare listă tururi disponibile și detalii interactive pe hartă (Mapbox)  
- 📅 Rezervare tururi ghidate  
- 💳 Plăți online securizate cu **Stripe**  
- 🧾 Generare facturi pentru rezervări  
- 📧 Trimitere emailuri automate (confirmări, facturi, notificări)  
- ✍️ Adăugare și gestionare recenzii  
- 👨‍💼 Panou de administrare pentru gestionarea tururilor, rezervărilor și recenziilor  

## 🏗️ Tehnologii utilizate
- **Back-end**: Node.js, Express.js, REST API  
- **Front-end**: Pug Templates, JavaScript, CSS, Parcel bundler  
- **Bază de date**: MongoDB (colecții: Users, Tours, Bookings, Reviews)  
- **Upload fișiere**: Multer  
- **Plăți online**: Stripe  
- **Hărți interactive**: Mapbox  
- **Facturi**: generare automată pe baza rezervărilor  
- **Emailuri**: sistem de trimitere emailuri automate (ex. Nodemailer)  

## 🚀 Instalare și rulare local
1. Clonează repository-ul:  
   ```bash
   git clone https://github.com/username/hikeaway.git
   cd hikeaway
   ```
2. Instalează dependențele:  
   ```bash
   npm install
   ```
3. Creează un fișier `.env` cu variabilele necesare (exemplu):  
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
4. Rulează aplicația:  
   ```bash
   npm start
   ```
5. Deschide în browser: `http://localhost:3000`  

## 📌 Direcții viitoare
- optimizare pentru mobil  
- extinderea aplicației cu funcționalități sociale (comunitate de excursioniști)  
- export avansat de rapoarte și statistici pentru administratori  

## 👨‍🎓 Autor
Proiect realizat de **[Numele Tău]**
