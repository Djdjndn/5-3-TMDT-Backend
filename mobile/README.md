# TMDT Mobile

React Native + Expo + TypeScript app for the e-commerce backend.

## Run

```bash
cd mobile
npm run start -- --port 19000
```

Open with Expo Go, Android emulator, or Expo web.

## API URL

Default API URL:

- Android emulator: `http://10.0.2.2:8080`
- iOS simulator / web: `http://localhost:8080`

For a real phone on the same Wi-Fi, run with your computer LAN IP:

```bash
$env:EXPO_PUBLIC_API_URL="http://192.168.1.x:8080"
npm run start -- --port 19000
```

Replace `192.168.1.x` with your computer's IP address.
