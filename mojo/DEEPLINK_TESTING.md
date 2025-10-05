# Deeplink Testing Guide

This guide explains how to test the deeplink functionality in the Mojo React Native app.

## Deeplink URLs

The app supports the following deeplink patterns:

- `mojo://request?id=<transaction_id>` - Opens a payment request modal
- `mojo://send?id=<transaction_id>` - Opens a send payment modal

## Testing Methods

### 1. iOS Simulator Testing

1. Start the iOS simulator
2. Run the app: `npm run ios`
3. Open Safari on the simulator
4. Navigate to one of these URLs:
   - `mojo://request?id=12345`
   - `mojo://send?id=67890`
5. The app should open and display the appropriate modal

### 2. Android Emulator Testing

1. Start the Android emulator
2. Run the app: `npm run android`
3. Use ADB to send deeplinks:
   ```bash
   adb shell am start -W -a android.intent.action.VIEW -d "mojo://request?id=12345" com.hackr.sh.myexpoapp
   adb shell am start -W -a android.intent.action.VIEW -d "mojo://send?id=67890" com.hackr.sh.myexpoapp
   ```

### 3. Physical Device Testing

#### iOS
1. Install the app on your device
2. Create a simple HTML file with links:
   ```html
   <a href="mojo://request?id=12345">Test Request</a>
   <a href="mojo://send?id=67890">Test Send</a>
   ```
3. Open the HTML file in Safari and tap the links

#### Android
1. Install the app on your device
2. Use ADB commands as shown above, or
3. Create a simple HTML file and open it in Chrome

## Expected Behavior

When a deeplink is triggered:

1. The app should open (if not already running) or come to the foreground
2. A modal should appear with:
   - Appropriate title ("Payment Request" or "Send Payment")
   - Transaction ID display
   - Cancel and Accept/Send buttons
3. Tapping Cancel should close the modal
4. Tapping Accept/Send should log the action and close the modal

## Troubleshooting

- Make sure the app is properly installed and the scheme is registered
- Check the console logs for any deeplink parsing errors
- Ensure the URL format is exactly as specified (case-sensitive)
- For iOS, make sure the app is signed and installed via Xcode or TestFlight