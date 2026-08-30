// Travel Tools: Checklists, Vault, Journal, Expenses, and Time Sync
const ToolsManager = {
  defaultChecklists: [
    {
      category: "The Ghan Cabin Bag (Hand Luggage)",
      description: "Kept inside your cabin. Checked bags are NOT accessible during the 54h journey!",
      items: [
        { id: "c1", text: "Passport or Government Photo ID (Required at check-in)", checked: false },
        { id: "c2", text: "The Ghan E-tickets & Booking Confirmation", checked: false },
        { id: "c3", text: "Daily prescription medications (enough for 4+ days)", checked: false },
        { id: "c4", text: "Australian Type I plug adapter & multi-USB charger", checked: false },
        { id: "c5", text: "Portable power bank (10,000-20,000 mAh)", checked: false },
        { id: "c6", text: "Smart-casual dinner attire (collared shirt / dress / neat pants)", checked: false },
        { id: "c7", text: "Light warm fleece / jacket for chilly Marla desert night siding", checked: false },
        { id: "c8", text: "Toiletries & lip balm (desert air is dry)", checked: false },
        { id: "c9", text: "Camera / smartphone with offline music/podcasts loaded", checked: false }
      ]
    },
    {
      category: "Outback & Excursions Daypack",
      description: "For Alice Springs Desert Park, Simpsons Gap, and Nitmiluk Gorge",
      items: [
        { id: "o1", text: "Broad-brim sun hat (baseball caps do not protect neck/ears)", checked: false },
        { id: "o2", text: "Head fly net (invaluable for Alice Springs walks)", checked: false },
        { id: "o3", text: "SPF 50+ broad-spectrum sunscreen", checked: false },
        { id: "o4", text: "UV400 polarized sunglasses (sun glare is high on red sand)", checked: false },
        { id: "o5", text: "Refillable insulated water bottle (at least 1.0L)", checked: false },
        { id: "o6", text: "Comfortable, broken-in walking/hiking shoes", checked: false },
        { id: "o7", text: "DEET or Picaridin insect repellent (Bushman / Aerogard)", checked: false },
        { id: "o8", text: "Electrolyte rehydration powder sachets", checked: false },
        { id: "o9", text: "Small pack of band-aids / blister prevention tape", checked: false }
      ]
    },
    {
      category: "Checked Luggage (Hold Baggage)",
      description: "Up to 2x 25kg bags per guest checked in at Adelaide Terminal",
      items: [
        { id: "h1", text: "Main wardrobe & extra casual outfits for Darwin", checked: false },
        { id: "h2", text: "Swimwear for Darwin Waterfront Lagoon / hotel pools", checked: false },
        { id: "h3", text: "Lightweight breathable tropical linen/cotton clothing", checked: false },
        { id: "h4", text: "Luggage locks (TSA approved)", checked: false },
        { id: "h5", text: "Extra footwear & dress shoes", checked: false }
      ]
    },
    {
      category: "Travel Essentials & Finance",
      description: "Key documentation and payment cards",
      items: [
        { id: "e1", text: "Credit/Debit Cards (Visa/Mastercard with no intl foreign fee)", checked: false },
        { id: "e2", text: "$50-$100 AUD cash for small market/roadhouse stalls", checked: false },
        { id: "e3", text: "Travel Insurance policy card & emergency medical hotline number", checked: false },
        { id: "e4", text: "Hotel reservations for Adelaide (Night 1) and Darwin (Night 4)", checked: false },
        { id: "e5", text: "Offline maps & AusExplorer PWA saved to mobile Home Screen", checked: false }
      ]
    }
  ],

  getChecklist() {
    try {
      const data = localStorage.getItem('aus_checklist');
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return JSON.parse(JSON.stringify(this.defaultChecklists));
  },

  saveChecklist(data) {
    try {
      localStorage.setItem('aus_checklist', JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  },

  toggleCheckItem(catIndex, itemId) {
    const list = this.getChecklist();
    if (list[catIndex]) {
      const item = list[catIndex].items.find(i => i.id === itemId);
      if (item) {
        item.checked = !item.checked;
        this.saveChecklist(list);
      }
    }
    return list;
  },

  addCheckItem(catIndex, text) {
    if (!text || !text.trim()) return this.getChecklist();
    const list = this.getChecklist();
    if (list[catIndex]) {
      list[catIndex].items.push({
        id: 'user_' + Date.now(),
        text: text.trim(),
        checked: false
      });
      this.saveChecklist(list);
    }
    return list;
  },

  resetChecklist() {
    const fresh = JSON.parse(JSON.stringify(this.defaultChecklists));
    this.saveChecklist(fresh);
    return fresh;
  },

  // Travel Vault (Booking refs, cabin numbers, hotel addresses)
  getVault() {
    const defaultVault = {
      ghanBookingRef: "",
      ghanCabinNo: "",
      adelaideHotel: "Adelaide CBD Hotel",
      adelaideHotelAddress: "",
      adelaideHotelPhone: "",
      darwinHotel: "Darwin Waterfront Hotel",
      darwinHotelAddress: "",
      darwinHotelPhone: "",
      flightInfo: "",
      insurancePolicy: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      customNotes: ""
    };
    try {
      const raw = localStorage.getItem('aus_vault');
      if (raw) return { ...defaultVault, ...JSON.parse(raw) };
    } catch (e) {
      console.error(e);
    }
    return defaultVault;
  },

  saveVault(vaultData) {
    try {
      localStorage.setItem('aus_vault', JSON.stringify(vaultData));
    } catch (e) {
      console.error(e);
    }
  },

  // Journal / Notes
  getJournal() {
    try {
      const raw = localStorage.getItem('aus_journal');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "sample-1",
        day: "Day 1 (Adelaide)",
        date: "Trip Day 1",
        title: "Adelaide Central Market & Glenelg Tram",
        content: "Had wonderful flat whites and fresh pastries at Lucia's. Took the vintage tram down to Glenelg beach for sunset. The breeze over Gulf St Vincent was refreshing!",
        timestamp: Date.now() - 86400000
      }
    ];
  },

  saveJournal(entries) {
    try {
      localStorage.setItem('aus_journal', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  },

  addJournalEntry(day, title, content) {
    const list = this.getJournal();
    const newEntry = {
      id: "j_" + Date.now(),
      day: day || "General",
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: title || "Travel Note",
      content: content || "",
      timestamp: Date.now()
    };
    list.unshift(newEntry);
    this.saveJournal(list);
    return list;
  },

  deleteJournalEntry(id) {
    let list = this.getJournal();
    list = list.filter(item => item.id !== id);
    this.saveJournal(list);
    return list;
  },

  // Expense Logger
  getExpenses() {
    try {
      const raw = localStorage.getItem('aus_expenses');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  saveExpenses(expenses) {
    try {
      localStorage.setItem('aus_expenses', JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  },

  addExpense(amount, category, description, day) {
    const list = this.getExpenses();
    const item = {
      id: "exp_" + Date.now(),
      amount: parseFloat(amount) || 0,
      category: category || "Dining",
      description: description || "Expense",
      day: day || "Day 1",
      date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
      timestamp: Date.now()
    };
    list.unshift(item);
    this.saveExpenses(list);
    return list;
  },

  deleteExpense(id) {
    let list = this.getExpenses();
    list = list.filter(item => item.id !== id);
    this.saveExpenses(list);
    return list;
  },

  // Export / Import All App Data
  exportBackup() {
    const payload = {
      exportVersion: "1.0",
      exportDate: new Date().toISOString(),
      checklist: this.getChecklist(),
      vault: this.getVault(),
      journal: this.getJournal(),
      expenses: this.getExpenses()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AusExplorer_TripData_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.checklist) this.saveChecklist(parsed.checklist);
      if (parsed.vault) this.saveVault(parsed.vault);
      if (parsed.journal) this.saveJournal(parsed.journal);
      if (parsed.expenses) this.saveExpenses(parsed.expenses);
      return true;
    } catch (e) {
      console.error("Failed to parse backup JSON", e);
      return false;
    }
  }
};
