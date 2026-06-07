<div>
    <h1>
    <img src="icon.png" style="height:1em;"> Muffler: Auto-Duck Volume Extension for Chrome
    <img src="icon.png" style="height:1em;">
    </h1>
</div>


**Muffler** is a lightweight, zero-configuration browser extension that automatically balances your audio workspace. It checks active window transitions, safely ducking background media tabs down and restoring your target tab back to its full custom baseline the moment you click it.<br>
**Currently only works on Youtube tabs.**

## Features

- **Auto-Duck:** Automatically ducks background Youtube tabs if you switch to another Youtube tab. (e.g: Listening to a music and changing to a video tab).
- **Settings Popup:** Configure the extension's behaviour by opening the little popup when clicking the extension icon.
- **Dynamic Baseline Tracking:** Change a video's volume slider at any time! Muffler automatically calculates the difference and updates your preferred baseline.
- **Context Preservation:** Smartly ignores non-media domains (like GitHub or Google) to freeze your background states without accidental audio death-spirals.
- **Ultra Lightweight:** Running entirely on Manifest V3 via an asynchronous storage state machine with zero background overhead.

## Installation (Chrome Web Store)

You can download the extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/muffler/ineddfgdkeiidcdedfjdalfokgmjkjjf).

## Installation (Local Development)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/` or your browser's equivalent.
3. Enable **Developer mode** (top-right toggle switch).
4. Click **Load unpacked** and select the root directory containing the extension files.

## License

Distributed under the MIT License. See `LICENSE` for more information.
