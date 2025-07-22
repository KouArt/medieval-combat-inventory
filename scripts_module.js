Hooks.once("init", () => {
  // Register custom sheet
  Actors.registerSheet("CoC7", MedievalCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "Medieval Combat and Inventory Sheet"
  });
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
  }

  async _equipArmor(item, slot) {
    const armor = this.actor.data.data.armor;
    armor[slot] = item.name;
    await this.actor.update({ "data.armor": armor });
  }
}