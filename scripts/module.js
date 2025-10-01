Hooks.once("init", () => {
  // Register custom sheet
  Actors.registerSheet("CoC7", MedievalCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Medieval Combat and Inventory Sheet"
  });

  // Load event cards data
  game.medieval = game.medieval || {};
  fetch("modules/medieval-combat-inventory/data/event-cards.json")
    .then(response => response.json())
    .then(data => {
      game.medieval.eventCards = data;
      console.log("Medieval Event Cards loaded:", data.length, "cards");
    })
    .catch(err => console.error("Failed to load event cards:", err));
});

class MedievalCharacterSheet extends CoC7CharacterSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: "modules/medieval-combat-inventory/templates/character-sheet.hbs",
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "core" }]
    });
  }

  async getData() {
    const data = await super.getData();
    
    // Initialize armor slots if not present
    if (!data.data.armor) {
      data.data.armor = {
        helmet: "",
        chest: "",
        arms: "",
        gloves: "",
        legs: "",
        boots: ""
      };
    }

    // Initialize inventory (20 slots)
    if (!data.data.inventory) {
      data.data.inventory = Array(20).fill(null).map(() => ({ id: "", name: "" }));
      data.data.inventoryUsed = 0;
    }

    // Calculate used slots
    data.data.inventoryUsed = data.data.inventory.filter(item => item.id).length;

    // Initialize active events if not present
    if (!data.data.activeEvents) {
      data.data.activeEvents = [];
    }

    // Pass event cards to template
    data.eventCards = game.medieval?.eventCards || [];
    data.data.activeEvents = data.data.activeEvents || [];

    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle item drag-and-drop to inventory
    html.find(".inventory-grid").on("dragenter", (event) => {
      event.preventDefault();
    });

    html.find(".inventory-slot").on("drop", async (event) => {
      event.preventDefault();
      const slotIndex = $(event.currentTarget).data("slot");
      const itemData = JSON.parse(event.originalEvent.dataTransfer.getData("text/plain"));
      const item = await Item.fromDropData(itemData);

      // Check if slot is empty and inventory isn't full
      const actor = this.actor;
      const inventory = actor.data.data.inventory;
      const usedSlots = inventory.filter(i => i.id).length;
      if (usedSlots >= 20 && !inventory[slotIndex].id) {
        ui.notifications.warn(game.i18n.localize("MEDIEVAL.InventoryFull"));
        return;
      }

      // Update inventory slot
      inventory[slotIndex] = { id: item.id, name: item.name };
      await actor.update({
        "data.inventory": inventory,
        "data.inventoryUsed": usedSlots + (inventory[slotIndex].id ? 0 : 1)
      });
    });

    // Handle item removal
    html.find(".item-remove").click(async (event) => {
      const slotIndex = $(event.currentTarget).data("slot");
      const inventory = this.actor.data.data.inventory;
      inventory[slotIndex] = { id: "", name: "" };
      await this.actor.update({
        "data.inventory": inventory,
        "data.inventoryUsed": inventory.filter(i => i.id).length
      });
    });

    // Handle armor equipping (via item context menu)
    this.actor.items.forEach(item => {
      if (item.type === "item" && item.data.data.isArmor) {
        item.sheet.contextMenuOptions = [
          {
            name: "Equip to Helmet",
            icon: "<i class='fas fa-helmet'></i>",
            callback: () => this._equipArmor(item, "helmet")
          },
          {
            name: "Equip to Chest",
            icon: "<i class='fas fa-chest'></i>",
            callback: () => this._equipArmor(item, "chest")
          },
          {
            name: "Equip to Arms",
            icon: "<i class='fas fa-arm'></i>",
            callback: () => this._equipArmor(item, "arms")
          },
          {
            name: "Equip to Gloves",
            icon: "<i class='fas fa-glove'></i>",
            callback: () => this._equipArmor(item, "gloves")
          },
          {
            name: "Equip to Legs",
            icon: "<i class='fas fa-leg'></i>",
            callback: () => this._equipArmor(item, "legs")
          },
          {
            name: "Equip to Boots",
            icon: "<i class='fas fa-boot'></i>",
            callback: () => this._equipArmor(item, "boots")
          }
        ];
      }
    });

    // Handle draw event card button
    html.find(".draw-event-card").click(async (event) => {
      event.preventDefault();
      await this._drawEventCard();
    });

    // Handle resolve event button
    html.find(".resolve-event").click(async (event) => {
      event.preventDefault();
      const eventId = $(event.currentTarget).data("event-id");
      await this._resolveEvent(eventId);
    });

    // Handle view event details
    html.find(".view-event-details").click(async (event) => {
      event.preventDefault();
      const eventId = $(event.currentTarget).data("event-id");
      await this._showEventDetails(eventId);
    });
  }

  async _equipArmor(item, slot) {
    const armor = this.actor.data.data.armor;
    armor[slot] = item.name;
    await this.actor.update({ "data.armor": armor });
  }

  async _drawEventCard() {
    const eventCards = game.medieval?.eventCards;
    if (!eventCards || eventCards.length === 0) {
      ui.notifications.warn("No event cards available!");
      return;
    }

    // Draw a random event card
    const randomIndex = Math.floor(Math.random() * eventCards.length);
    const drawnCard = eventCards[randomIndex];

    // Add to active events
    const activeEvents = this.actor.data.data.activeEvents || [];
    
    // Check if event is already active
    if (activeEvents.find(e => e.id === drawnCard.id)) {
      ui.notifications.info(`Event "${drawnCard.name}" is already active!`);
      return;
    }

    activeEvents.push({
      ...drawnCard,
      drawnAt: Date.now()
    });

    await this.actor.update({ "data.activeEvents": activeEvents });
    
    // Show event details
    await this._showEventDetails(drawnCard.id);
    
    ui.notifications.info(`Event card drawn: ${drawnCard.name}`);
  }

  async _resolveEvent(eventId) {
    const activeEvents = this.actor.data.data.activeEvents || [];
    const updatedEvents = activeEvents.filter(e => e.id !== eventId);
    
    await this.actor.update({ "data.activeEvents": updatedEvents });
    
    ui.notifications.info("Event resolved!");
  }

  async _showEventDetails(eventId) {
    const eventCards = game.medieval?.eventCards || [];
    const activeEvents = this.actor.data.data.activeEvents || [];
    
    // Find event in either active events or all cards
    const event = activeEvents.find(e => e.id === eventId) || eventCards.find(e => e.id === eventId);
    
    if (!event) {
      ui.notifications.warn("Event not found!");
      return;
    }

    // Create dialog to show event details
    new Dialog({
      title: event.name,
      content: `
        <div class="event-details">
          <p><strong>${game.i18n.localize("MEDIEVAL.EventType")}:</strong> ${event.type}</p>
          <p><strong>${game.i18n.localize("MEDIEVAL.EventDescription")}:</strong></p>
          <p>${event.description}</p>
          <p><strong>${game.i18n.localize("MEDIEVAL.EventEffect")}:</strong></p>
          <p>${event.effect}</p>
          <p><strong>${game.i18n.localize("MEDIEVAL.EventNarrative")}:</strong></p>
          <p>${event.narrative}</p>
          <p><strong>${game.i18n.localize("MEDIEVAL.EventDuration")}:</strong> ${event.duration}</p>
          <p><strong>${game.i18n.localize("MEDIEVAL.EventArea")}:</strong> ${event.area}</p>
        </div>
      `,
      buttons: {
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close"
        }
      },
      default: "close"
    }).render(true);
  }
}