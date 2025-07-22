# Medieval Combat and Inventory

A Foundry VTT module for *Call of Cthulhu 7th Edition (Unofficial)* that adds a "Body & Inventory" tab to character sheets. The tab includes:
- A body diagram displaying equipped armor for helmet, chest, arms, gloves, legs, and boots.
- A 4x5 grid-based inventory with a 20-slot limit, supporting drag-and-drop functionality.

## Installation
1. In Foundry VTT, go to **Add-on Modules** > **Install Module**.
2. Paste the manifest URL: `https://raw.githubusercontent.com/kouart/medieval-combat-inventory/main/module.json`
3. Click **Install**.

## Usage
- Open a character sheet and select the "Body & Inventory" tab.
- Create armor items in the Item Directory with a custom `isArmor` field set to `true`.
- Right-click armor items to equip them to specific slots (helmet, chest, etc.).
- Drag items from the Item Directory to the inventory grid to add them. Remove items by clicking the "Remove" button.
- The inventory is limited to 20 slots; a warning appears if you try to add items when full.

## Requirements
- Foundry VTT version 12 or later.
- *Call of Cthulhu 7th Edition (Unofficial)* system installed.

## Development
- To contribute, clone the repository and place it in your Foundry VTT `Data/modules/` folder.
- Report issues or submit pull requests on [GitHub](https://github.com/kouart/medieval-combat-inventory).

## License
MIT License