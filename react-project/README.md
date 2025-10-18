# React Project - My Way Company

This project is a React application built according to the provided design and requirements, integrating Firebase for authentication, Firestore for database, and Storage for file management.

## Project Structure


react-project/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/
│   ├── components/
│   │   └── LoadingSpinner.js
│   │   └── LoadingSpinner.module.css
│   ├── contexts/
│   │   └── FirebaseContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFirestore.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── HomePage.js
│   │   └── SignIn.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── productService.js
│   ├── utils/
│   ├── styles/
│   │   ├── App.module.css
│   │   ├── Dashboard.module.css
│   │   ├── design.module.css
│   │   └── SignIn.module.css
│   ├── config/
│   ├── App.js
│   ├── index.js
│   └── reportWebVitals.js
├── .env
├── .gitignore
├── package.json
└── README.md


## Getting Started

1.  **Clone the repository:**
    bash
    git clone <your-repo-url>
    cd react-project
    
2.  **Install dependencies:**
    bash
    npm install
    # or
    yarn install
    
3.  **Set up Firebase Environment Variables:**
    Create a `.env` file in the root directory of the project and add your Firebase configuration:
    
    REACT_APP_FIREBASE_API_KEY="AIzaSyAGV2T-vtyuUMvY4JbbnasmqsxYdZfsgO4"
    REACT_APP_FIREBASE_AUTH_DOMAIN="aign-ed801.firebaseapp.com"
    REACT_APP_FIREBASE_PROJECT_ID="aign-ed801"
    REACT_APP_FIREBASE_STORAGE_BUCKET="aign-ed801.firebasestorage.app"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="66513709331"
    REACT_APP_FIREBASE_APP_ID="1:66513709331:web:c829e53b3fca16d57692e6"
    REACT_APP_FIREBASE_MEASUREMENT_ID="G-RXS6M904T9"
    
    _Note: Replace with your actual Firebase project configuration if you're deploying this._

4.  **Run the development server:**
    bash
    npm start
    # or
    yarn start
    
    The application will open in your browser at `http://localhost:3000`.

## Features

*   **Firebase Integration:** Full setup for Authentication, Firestore, and Storage.
*   **Authentication:** User login/logout with email and password, protected routes.
*   **Firestore Data Management:** Example of fetching and adding data (products) with real-time updates using `onSnapshot`.
*   **Tenant Isolation:** Data isolated by a `projectId` (`react-project-1760815792371-h9vf08sio`) for all Firestore and Storage operations. User roles are managed in Firestore.
*   **Responsive Design:** CSS for adapting to different screen sizes.
*   **PWA Ready:** `manifest.json` configured for Progressive Web App capabilities.
*   **Error & Loading States:** Clear UI feedback for asynchronous operations.
*   **Email Validation:** Basic regex validation for email input during sign-in/sign-up.

## Firebase Firestore Security Rules (Suggestion)

To enforce tenant isolation and ensure only authorized members of a project can access its data, consider using the following Firestore security rules:

firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to project-specific data only if authenticated and is a member with 'owner' role
    match /projects/{projectId}/{document=**} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/projects/$(projectId)/members/$(request.auth.uid)).data.roles.includes('owner');
    }

    // Allow new users to create their member document only on signup, for their own project (tenant)
    // This rule assumes `members` collection is within `projects/{projectId}`
    match /projects/{projectId}/members/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId && request.resource.data.roles.includes('owner');
      allow read: if request.auth != null && request.auth.uid == userId; // Allow user to read their own member data
    }

    // For other top-level collections, explicitly deny or define rules based on your app's needs
    // match /{collection}/{document=**} {
    //   allow read, write: if false;
    // }
  }
}

**Explanation for the Firestore Rules:**
*   `match /projects/{projectId}/{document=**}`: This rule applies to all documents within any `projects/{projectId}` path. It allows `read` and `write` operations only if:
    *   `request.auth != null`: The user is authenticated.
    *   `get(/databases/$(database)/documents/projects/$(projectId)/members/$(request.auth.uid)).data.roles.includes('owner')`: The authenticated user has a corresponding document in the `members` subcollection for that specific `projectId`, and that document contains a `roles` array which includes `'owner'`. This effectively checks if the user is a member (and owner) of that particular project.
*   `match /projects/{projectId}/members/{userId}`: This rule specifically targets the `members` subcollection.
    *   `allow create`: Allows a user to create their own member document (`userId` must match `request.auth.uid`) within a `projectId`, provided they are assigning themselves the `'owner'` role. This is crucial for the `signup` process.
    *   `allow read`: Allows an authenticated user to read their own member document.

## How to use Firestore with tenant isolation:

When performing Firestore operations, ensure you always include the `projectId` as part of your collection path.
Example:
javascript
import { collection, doc } from 'firebase/firestore';
import { db, projectId } from '../services/firebase';

// To get a product:
const productDocRef = doc(db, `projects/${projectId}/products`, productId);

// To query products:
const productsCollectionRef = collection(db, `projects/${projectId}/products`);


This structure ensures that data for different projects (tenants) is logically separated within your Firestore database.
