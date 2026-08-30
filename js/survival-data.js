const SurvivalData = {
  "emergencyContacts": [
    {
      "name": "Triple Zero (000)",
      "number": "000",
      "description": "National Emergency Service for Police, Fire, and Ambulance across Australia.",
      "badge": "Primary 24/7",
      "icon": "shield"
    },
    {
      "name": "Mobile Emergency (112)",
      "number": "112",
      "description": "International standard GSM emergency number. Works from any mobile even with NO SIM or on roaming when any network signal is available.",
      "badge": "Mobile / Low Signal",
      "icon": "phone"
    },
    {
      "name": "Non-Emergency Police (131 444)",
      "number": "131444",
      "description": "For non-urgent police assistance, theft reporting, or non-life-threatening incidents (all states except Victoria).",
      "badge": "Non-Urgent",
      "icon": "phone"
    },
    {
      "name": "Poisons Information Centre",
      "number": "131126",
      "description": "24/7 national expert advice on snake bites, spider bites, marine envenomation, and toxic substances.",
      "badge": "24/7 Medical",
      "icon": "shield"
    },
    {
      "name": "Royal Flying Doctor Service (RFDS)",
      "number": "1800625800",
      "description": "Emergency medical evacuations and tele-health support across remote outback Australia.",
      "badge": "Outback Rescue",
      "icon": "crosshair"
    },
    {
      "name": "State Emergency Service (SES)",
      "number": "132500",
      "description": "Assistance during severe storms, flash floods, fallen trees, and natural disasters.",
      "badge": "Storm / Flood",
      "icon": "alertTriangle"
    }
  ],
  "hospitals": [
    {
      "city": "Adelaide",
      "state": "SA",
      "name": "Royal Adelaide Hospital (RAH)",
      "address": "Port Road, Adelaide SA 5000",
      "phone": "+61 8 7074 0000",
      "type": "Major Tertiary & Level 1 Trauma Hospital",
      "openHours": "24 Hours Emergency Department",
      "directions": "Located at the western end of North Terrace / Port Road. Free tram ride from CBD stops directly in front of the hospital ('Royal Adelaide Hospital' stop)."
    },
    {
      "city": "Alice Springs",
      "state": "NT",
      "name": "Alice Springs Hospital",
      "address": "Gap Road, Alice Springs NT 0870",
      "phone": "+61 8 8951 7777",
      "type": "Regional Base Hospital & 24h Trauma",
      "openHours": "24 Hours Emergency Department",
      "directions": "Located ~1.5 km south of the Alice Springs CBD along Gap Road towards Heavitree Gap. 5 mins taxi from railway station."
    },
    {
      "city": "Katherine",
      "state": "NT",
      "name": "Katherine Hospital",
      "address": "Gorge Road, Katherine NT 0850",
      "phone": "+61 8 8973 9211",
      "type": "Regional Community Hospital",
      "openHours": "24 Hours Emergency Department",
      "directions": "Located ~4 km northeast of Katherine town centre on Gorge Road (en route to Nitmiluk National Park)."
    },
    {
      "city": "Darwin",
      "state": "NT",
      "name": "Royal Darwin Hospital (RDH)",
      "address": "105 Rocklands Drive, Tiwi NT 0810",
      "phone": "+61 8 8922 8888",
      "type": "Major Tertiary Teaching Hospital & National Critical Care Centre",
      "openHours": "24 Hours Emergency Department",
      "directions": "Located in Darwin northern suburbs, ~15 km north of CBD. 15-20 mins taxi or accessible via Darwinbus Route 4."
    },
    {
      "city": "Darwin (CBD Urgent Care)",
      "state": "NT",
      "name": "Top End Medical Centre (Casuarina / CBD)",
      "address": "Darwin CBD & Casuarina Clinics",
      "phone": "+61 8 8930 4900",
      "type": "General Practice & Urgent Non-Trauma Care",
      "openHours": "Mon-Sun 08:00 - 20:00",
      "directions": "Walk-in GP services for minor cuts, prescription refills, ear/eye infections, or travel sickness."
    }
  ],
  "safetyRules": [
    {
      "id": "croc-wise",
      "title": "Croc-Wise: Saltwater Crocodile Safety in the Top End",
      "severity": "CRITICAL",
      "badge": "Darwin & Katherine Waters",
      "icon": "alertTriangle",
      "summary": "Saltwater crocodiles ('Salties') are apex predators inhabiting all rivers, estuaries, mangrove creeks, billabongs, and ocean beaches in the Northern Territory. They grow up to 6 metres and are deadly ambush hunters.",
      "dos": [
        "ALWAYS assume crocodiles are present in any natural water body in the Top End, even if you can't see them.",
        "Swim ONLY in signposted safe swimming areas (e.g. Darwin Waterfront Lagoon, Wave Lagoon, designated public pools).",
        "Stay at least 5 metres back from the water's edge when walking, fishing, or taking photos along riverbanks.",
        "Obey ALL crocodile warning signs immediately. 'No Swimming' means high risk of fatality.",
        "Stand back when launching or boarding boats at boat ramps."
      ],
      "donts": [
        "NEVER swim in Darwin beaches (Mindil Beach, Nightcliff, Casuarina, East Point) or natural rivers/creeks in Katherine.",
        "NEVER dangle arms or legs over the side of boats or canoes.",
        "NEVER clean fish or discard food scraps near the water's edge or boat ramps.",
        "NEVER camp within 50 metres of any watercourse in the Top End."
      ]
    },
    {
      "id": "marine-stingers",
      "title": "Marine Stingers: Box Jellyfish & Irukandji",
      "severity": "CRITICAL",
      "badge": "Darwin Coastal Waters",
      "icon": "shield",
      "summary": "Potentially fatal Box Jellyfish (Chironex fleckeri) and tiny Irukandji jellyfish inhabit coastal waters around Darwin, especially during the 'stinger season' (October to May), but can occur year-round.",
      "dos": [
        "Swim strictly in netted or filtered pools like the Darwin Waterfront Lagoon.",
        "If stung, IMMEDIATELY douse the tentacles generously with Vinegar for at least 30 seconds (this deactivates unfired stinging cells).",
        "Call 000 / 112 immediately for emergency medical transport.",
        "If patient becomes unresponsive, begin immediate CPR."
      ],
      "donts": [
        "NEVER rub the sting site with hands, sand, or towels (triggers more venom release).",
        "DO NOT use freshwater, urine, or alcohol on Box Jellyfish stings (causes remaining nematocysts to discharge).",
        "NEVER enter murky coastal ocean water along Darwin foreshore."
      ]
    },
    {
      "id": "heat-hydration",
      "title": "Outback Heat, Sunstroke & Dehydration",
      "severity": "HIGH",
      "badge": "Red Centre & Katherine",
      "icon": "sun",
      "summary": "Outback summer and shoulder temperatures in Alice Springs and Katherine regularly exceed 38\u00b0C\u201342\u00b0C (100\u00b0F\u2013108\u00b0F). Humidity in Darwin creates severe heat stress.",
      "dos": [
        "Drink at least 1 litre of water per hour of outdoor walking/excursions.",
        "Wear SPF 50+ broad-spectrum sunscreen, reapplying every 2 hours.",
        "Wear a wide-brimmed sun hat, UV-rated sunglasses, and lightweight, long-sleeve loose clothing.",
        "Carry electrolyte replacement tablets / hydration salts in your daypack.",
        "Seek immediate shade and rest if experiencing dizziness, nausea, headache, or confusion."
      ],
      "donts": [
        "DO NOT rely on soda, alcohol, or energy drinks for hydration (they accelerate dehydration).",
        "DO NOT embark on unshaded gorge walks in Alice Springs or Katherine during peak midday heat (12:00 PM - 03:00 PM)."
      ]
    },
    {
      "id": "snake-spider",
      "title": "Snake & Spider Bites: Pressure-Immobilization",
      "severity": "CRITICAL FIRST AID",
      "badge": "Australia-Wide",
      "icon": "shield",
      "summary": "Australia is home to venomous snakes (Eastern Brown, King Brown/Mulga, Taipan) and spiders (Funnel-web, Redback). The correct first aid technique dramatically slows venom transmission through the lymphatic system.",
      "dos": [
        "Step 1: Keep the patient completely still and calm. Movement accelerates venom spread.",
        "Step 2: Apply a broad, firm elastic bandage (or crepe bandage) directly over the bite site as tight as for a sprained ankle.",
        "Step 3: Wrap the bandage all the way up the affected limb to the hip or armpit.",
        "Step 4: Splint the limb (with a stick or rolled newspaper) to prevent joint bending.",
        "Step 5: Call 000 / 112 immediately. Note the time of the bite.",
        "Step 6: Mark the approximate location of the bite on the outside of the bandage."
      ],
      "donts": [
        "DO NOT WASH the bite area (hospital venom detection kits test the residual venom on the skin to determine the exact antivenom needed).",
        "DO NOT CUT the bite or attempt to suck out venom.",
        "DO NOT APPLY a arterial tourniquet (this causes tissue necrosis).",
        "DO NOT TRY to catch or kill the snake (high risk of second bite; doctors do not need the physical snake)."
      ]
    },
    {
      "id": "bush-flies",
      "title": "Bush Flies & Insect Management",
      "severity": "MODERATE",
      "badge": "Alice Springs & Red Centre",
      "icon": "shield",
      "summary": "Australian bush flies (Musca vetustissima) are non-biting but relentlessly swarm the eyes, mouth, and ears seeking moisture, especially around Alice Springs and outback gorges during warm sunny days.",
      "dos": [
        "Wear a head fly net over your broad-brim hat during walks in Alice Springs (available for $5-$10 AUD at gift shops/kiosks).",
        "Apply DEET or Picaridin-based insect repellent (e.g. Bushman or Aerogard) to exposed skin.",
        "Keep mouth closed or wear a light buff/gaiter when walking."
      ],
      "donts": [
        "Don't let them ruin your trip\u2014everyone does the famous 'Aussie Salute' (waving your hand across your face)!"
      ]
    }
  ],
  "transitInfo": {
    "adelaide": {
      "city": "Adelaide, SA",
      "metroTitle": "Adelaide Metro System",
      "details": "Adelaide's grid CBD is extremely easy to navigate on foot or via public transit.",
      "fares": "Tap-and-go with credit/debit card (Visa, Mastercard) on trams and buses, or purchase a rechargeable MetroCard at newsagents and train stations ($4.40 peak / $2.40 off-peak).",
      "freeZones": [
        "Free City Connector Buses (Routes 98A/98C clockwise and 98B counter-clockwise) circle the CBD and North Adelaide every 15-30 mins.",
        "Free Tram Zone: The tram is completely free between South Terrace, Victoria Square, Railway Station, and the Entertainment Centre / Botanic Gardens."
      ],
      "glenelgTram": "The Glenelg Tram runs from Royal Adelaide Hospital / North Terrace through Victoria Square to Moseley Square at Glenelg Beach. Frequency is every 10-15 mins. Travel time ~35 mins. (Standard fare applies south of South Terrace).",
      "parklandsTerminal": "Adelaide Parklands Terminal (The Ghan Departure Station) is located on Richmond Road, Keswick (~3 km from CBD). Best reached by Taxi/Uber (~10-15 mins, $15-$22 AUD) or Adelaide Metro Bus 190/195/196 from CBD to Stop 1 or Stop 2 Anzac Hwy (500m walk)."
    },
    "darwin": {
      "city": "Darwin, NT",
      "metroTitle": "Darwinbus & Local Transport",
      "details": "Darwin CBD is compact and walkable. Waterfront is connected via a scenic covered elevated walkway and glass elevator from Smith Street.",
      "fares": "Darwinbus tickets can be purchased on board with cash or contactless card ($3 AUD for a 3-hour single trip ticket, $7 AUD for an all-day pass).",
      "keyRoutes": [
        "Route 4: Connects Darwin CBD Interchange to Fannie Bay (MAGNT - Museum and Art Gallery), Nightcliff, and Casuarina Square.",
        "Route 10: High-frequency express between Darwin CBD and Casuarina Interchange.",
        "Waterfront Shuttle: Free open-air electric shuttle loops around Darwin Waterfront Precinct daily 11:30 AM - 02:00 PM & 04:00 PM - 09:00 PM."
      ],
      "berrimahTerminal": "Darwin Railway Terminal is in Berrimah (~15 km south of Darwin CBD). The Ghan operators provide complimentary coach transfers to major CBD hotels for arriving passengers. Taxis from terminal to CBD cost ~$40-$50 AUD."
    }
  },
  "slangAndEtiquette": [
    {
      "term": "Arvo",
      "meaning": "Afternoon ('See you this arvo')"
    },
    {
      "term": "Brekkie",
      "meaning": "Breakfast"
    },
    {
      "term": "Bottle-o",
      "meaning": "Liquor store / Bottle shop"
    },
    {
      "term": "Esky",
      "meaning": "Portable insulated ice-box / cooler"
    },
    {
      "term": "Sunnies",
      "meaning": "Sunglasses"
    },
    {
      "term": "Thongs",
      "meaning": "Rubber flip-flops / sandals (NOT underwear in AU!)"
    },
    {
      "term": "No worries",
      "meaning": "You're welcome / It's fine / No problem at all"
    },
    {
      "term": "Fair dinkum",
      "meaning": "Genuine, true, authentic"
    },
    {
      "term": "Billabong",
      "meaning": "An isolated waterhole in a dried riverbed"
    },
    {
      "term": "Muster",
      "meaning": "Gathering and rounding up livestock on massive cattle stations"
    },
    {
      "term": "Bush",
      "meaning": "Any natural or wild area outside major metropolitan cities"
    },
    {
      "term": "Outback",
      "meaning": "The remote, vast, arid interior of Australia"
    }
  ],
  "culturalTips": {
    "tipping": "Tipping is NOT mandatory or customary in Australia. Australian workers receive generous award minimum wages ($24+ AUD/hr). In casual cafes and bars, rounding up change or tipping nothing is standard. In upscale restaurants, leaving 5% to 10% is appreciated only for exceptional table service.",
    "payments": "Australia is overwhelmingly cashless. Almost all vendors, markets, taxis, and bars accept contactless EFTPOS, Visa, Mastercard, Apple Pay, and Google Pay. Cash is rarely needed, though having $30-$50 AUD is wise for remote roadhouse souvenirs.",
    "power": "Australian electrical sockets use Type I plugs (three-prong angled blades) supplying 230-240V AC at 50Hz. Visitors from North America, Europe, or UK will need a plug adapter. Cabins on The Ghan feature standard Type I wall sockets.",
    "timeZones": "South Australia observes Australian Central Standard Time (ACST, UTC+9:30) / Australian Central Daylight Time (ACDT, UTC+10:30 from Oct-Apr). The Northern Territory (Alice Springs, Katherine, Darwin) observes ACST (UTC+9:30) all year round without daylight saving."
  }
};
