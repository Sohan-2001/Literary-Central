
# 📖 Literary Central

Welcome to **Literary Central**, a modern and elegant integrated library management system. This application provides a seamless, real-time solution for managing books, authors, and user borrowing records, all powered by a robust and scalable tech stack.

![Literary Central Dashboard](https://raw.githubusercontent.com/firebase/studio-images/main/literary-central/dashboard.png)

---

## ✨ Core Features

Literary Central is designed to be a complete solution for library management, offering a comprehensive suite of features:

*   **👤 Role-Based Access**: Secure sign-in for administrators. Each administrator manages their own isolated library instance.
*   **📊 Interactive Dashboard**: Get a quick overview of your library's key statistics, including total books, registered authors, and the number of books currently on loan.
*   **📚 Full Book Management**:
    *   Add, edit, and delete books with a user-friendly modal form.
    *   Upload cover images and manage details like ISBN, publication date, and descriptions.
    *   Filter and sort your collection with an interactive data table.
*   **✒️ Complete Author Management**:
    *   Maintain a comprehensive database of authors with full CRUD functionality.
*   **👥 User & Member Management**:
    *   Manage library members, edit their details, and keep track of their status.
*   **🔄 Seamless Borrowing System**:
    *   Mark books as borrowed by a specific user directly from the book list.
    *   Track all books currently on loan in a dedicated "Borrowed Books" section.
    *   Mark books as returned with a single click, automatically updating their status to "available".

---

## 🚀 Technology Stack

This application is built with a modern, component-driven, and server-centric architecture.

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth) (Google Sign-In)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation.

---

##  архитектура How It Works

Literary Central leverages a powerful **client-side architecture** with Firebase, which enables a highly responsive and real-time user experience.

*   **No Traditional Backend**: Instead of a typical REST API, the application communicates directly and securely with Firebase services from the client.
*   **Real-time Data**: All data is fetched and updated in real-time using the Firebase Realtime Database SDK. Any change made is instantly reflected across the application for all users viewing the same data.
*   **Secure by Design**: Security is not handled in the application code itself but is enforced by **Firebase Security Rules**. These rules are defined in `firestore.rules` and ensure that users can only access and modify data they are authorized to, creating a robust and secure environment.
*   **Isolated Data per User**: The database is structured so that each user (admin) has their own sandboxed environment. All books, authors, and records are stored under a unique folder corresponding to the user's Firebase UID, guaranteeing data privacy between different libraries.

---

## Getting Started

1.  **Sign In**: The application uses Google for authentication. Simply sign in with your Google account to get started.
2.  **Your Own Library**: Upon your first sign-in, a new, empty library instance is created for you in the database.
3.  **Manage**: You can start adding authors, creating books, and managing your library immediately.

Enjoy managing your collection with Literary Central!
# Literary-Central
