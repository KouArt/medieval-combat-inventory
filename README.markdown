# Medieval Combat and Inventory

A Foundry VTT module for *Call of Cthulhu 7th Edition (Unofficial)* that adds a "Body & Inventory" tab to character sheets and a complete Event Cards system for Hollowbrook scenarios. The module includes:
- A body diagram displaying equipped armor for helmet, chest, arms, gloves, legs, and boots.
- A 4x5 grid-based inventory with a 20-slot limit, supporting drag-and-drop functionality.
- An Event Cards system with 10 pre-made cards for Hollowbrook, featuring supernatural events, organic crises, spore infestations, and city-wide panic scenarios.

## Features

### Body & Inventory
- Visual body diagram for armor equipment
- 20-slot grid inventory with drag-and-drop support
- Real-time slot usage tracking

### Event Cards
- Draw random event cards from a deck of 10 Hollowbrook events
- Track active events affecting your character
- View detailed event information including mechanical effects, narrative context, duration, and affected areas
- Resolve events when their conditions are met
- Events include:
  - **Esporos na Névoa** (Spores in the Mist) - Supernatural event with infection mechanics
  - **Pânico Coletivo** (Collective Panic) - Social event affecting interactions
  - **Quarentena Emergencial** (Emergency Quarantine) - Administrative lockdown
  - **Infestação Fúngica** (Fungal Infestation) - Organic environmental hazard
  - **Lua de Sangue** (Blood Moon Rising) - Supernatural night event
  - **Surto de Pestilência** (Plague Outbreak) - Disease outbreak
  - **Alucinação Coletiva** (Mass Hallucination) - Sanity-affecting event
  - **Escassez de Suprimentos** (Supply Shortage) - Resource scarcity
  - **Despertar Sobrenatural** (Supernatural Awakening) - Mystical phenomena
  - **Toque de Recolher Rígido** (Strict Curfew) - Movement restrictions

## Installation
1. In Foundry VTT, go to **Add-on Modules** > **Install Module**.
2. Paste the manifest URL: `https://raw.githubusercontent.com/kouart/medieval-combat-inventory/main/module.json`
3. Click **Install**.

## Usage
- Open a character sheet and select the "Body & Inventory" tab to manage armor and inventory.
- Create armor items in the Item Directory with a custom `isArmor` field set to `true`.
- Right-click armor items to equip them to specific slots (helmet, chest, etc.).
- Drag items from the Item Directory to the inventory grid to add them. Remove items by clicking the "Remove" button.
- The inventory is limited to 20 slots; a warning appears if you try to add items when full.
- Select the "Event Cards" tab to manage Hollowbrook event cards.
- Click "Draw Event Card" to randomly draw an event from the deck.
- Active events are displayed with their full details - type, description, mechanical effects, narrative context, duration, and affected area.
- Click "View Details" to see the complete event information in a dialog.
- Click "Resolve Event" to remove an event from your active events list when its conditions are met or duration expires.

## Languages
- English (en)
- Português (Brasil) (pt-BR)

## Requirements
- Foundry VTT version 12 or later.
- *Call of Cthulhu 7th Edition (Unofficial)* system installed.

## Development
- To contribute, clone the repository and place it in your Foundry VTT `Data/modules/` folder.
- Report issues or submit pull requests on [GitHub](https://github.com/kouart/medieval-combat-inventory).

## License
MIT License