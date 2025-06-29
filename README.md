# Snipy Mobile - React Native App

A React Native mobile application for the Snipy link management platform. This app provides all the core functionality of the web application in a native mobile experience.

## Features

- **URL Shortening**: Create short, memorable links
- **Link Trees**: Build beautiful landing pages with multiple links
- **QR Code Generation**: Generate QR codes for any URL
- **Password Generator**: Create secure passwords with customizable options
- **Dashboard**: View analytics and manage all your content
- **Cross-platform**: Works on both iOS and Android

## Tech Stack

- **React Native 0.73.2**
- **TypeScript**
- **React Navigation 6**
- **Supabase** (Backend & Database)
- **React Native Vector Icons**
- **React Native Linear Gradient**
- **React Native QR Code SVG**

## Prerequisites

- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snipy-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure Supabase**
   - Update `src/lib/supabase.ts` with your Supabase URL and anon key
   - Or create a `.env` file with:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Android Setup**
   - Ensure Android Studio is installed
   - Create an Android Virtual Device (AVD) or connect a physical device

## Running the App

### Development

1. **Start Metro bundler**
   ```bash
   npm start
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Run on iOS** (macOS only)
   ```bash
   npm run ios
   ```

### Production Builds

1. **Android APK**
   ```bash
   npm run build:android
   ```

2. **iOS Archive** (macOS only)
   ```bash
   npm run build:ios
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── TabBarIcon.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── lib/               # Utilities and configurations
│   ├── supabase.ts
│   ├── utils.ts
│   ├── passwordUtils.ts
│   └── database.types.ts
├── screens/           # Screen components
│   ├── auth/
│   ├── dashboard/
│   ├── urls/
│   ├── linktrees/
│   ├── qrcodes/
│   ├── passwords/
│   └── profile/
└── App.tsx           # Main app component
```

## Key Features Implementation

### Authentication
- Supabase Auth integration
- Email/password authentication
- Persistent login state
- Secure token management

### URL Shortening
- Generate memorable short codes
- Track click analytics
- Copy to clipboard functionality
- Share URLs directly from the app

### Link Trees
- Create custom landing pages
- Drag and drop link reordering
- Theme customization
- Social media icons

### QR Code Generation
- Generate QR codes for any URL
- Customizable colors and sizes
- Save and share QR codes
- Download as images

### Password Generator
- Customizable password options
- Strength indicator
- Encrypted storage
- Copy to clipboard

## Database Schema

The app uses the same Supabase database schema as the web application:

- `urls` - Shortened URLs
- `link_trees` - Link tree pages
- `tree_links` - Individual links within link trees
- `qr_codes` - Generated QR codes
- `passwords` - Encrypted password storage

## Security

- Row Level Security (RLS) enabled on all tables
- Encrypted password storage using CryptoJS
- Secure authentication with Supabase Auth
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.