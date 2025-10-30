export interface DotaItem {
  id: string;
  name: string;
  cost: number;
  category: 'consumables' | 'attributes' | 'equipment' | 'miscellaneous' | 'secret_shop' | 'upgrades' | 'neutral';
}

export const DOTA_ITEMS: DotaItem[] = [
  { id: 'blink', name: 'Blink Dagger', cost: 2250, category: 'upgrades' },
  { id: 'black_king_bar', name: 'Black King Bar', cost: 4050, category: 'upgrades' },
  { id: 'power_treads', name: 'Power Treads', cost: 1400, category: 'upgrades' },
  { id: 'phase_boots', name: 'Phase Boots', cost: 1500, category: 'upgrades' },
  { id: 'arcane_boots', name: 'Arcane Boots', cost: 1300, category: 'upgrades' },
  { id: 'tranquil_boots', name: 'Tranquil Boots', cost: 925, category: 'upgrades' },
  { id: 'travel_boots', name: 'Boots of Travel', cost: 2500, category: 'upgrades' },
  { id: 'assault', name: 'Assault Cuirass', cost: 5125, category: 'upgrades' },
  { id: 'heart', name: 'Heart of Tarrasque', cost: 5000, category: 'upgrades' },
  { id: 'shivas_guard', name: "Shiva's Guard", cost: 4600, category: 'upgrades' },
  { id: 'blade_mail', name: 'Blade Mail', cost: 2100, category: 'upgrades' },
  { id: 'manta', name: 'Manta Style', cost: 4600, category: 'upgrades' },
  { id: 'butterfly', name: 'Butterfly', cost: 5125, category: 'upgrades' },
  { id: 'greater_crit', name: 'Daedalus', cost: 5150, category: 'upgrades' },
  { id: 'monkey_king_bar', name: 'Monkey King Bar', cost: 4975, category: 'upgrades' },
  { id: 'abyssal_blade', name: 'Abyssal Blade', cost: 6250, category: 'upgrades' },
  { id: 'bloodthorn', name: 'Bloodthorn', cost: 6800, category: 'upgrades' },
  { id: 'skadi', name: 'Eye of Skadi', cost: 5300, category: 'upgrades' },
  { id: 'satanic', name: 'Satanic', cost: 5050, category: 'upgrades' },
  { id: 'mjollnir', name: 'Mjollnir', cost: 5600, category: 'upgrades' },
  { id: 'diffusal_blade', name: 'Diffusal Blade', cost: 2500, category: 'upgrades' },
  { id: 'desolator', name: 'Desolator', cost: 3150, category: 'upgrades' },
  { id: 'orchid', name: 'Orchid Malevolence', cost: 3475, category: 'upgrades' },
  { id: 'ethereal_blade', name: 'Ethereal Blade', cost: 4650, category: 'upgrades' },
  { id: 'sheepstick', name: 'Scythe of Vyse', cost: 5675, category: 'upgrades' },
  { id: 'rod_of_atos', name: 'Rod of Atos', cost: 2750, category: 'upgrades' },
  { id: 'force_staff', name: 'Force Staff', cost: 2200, category: 'upgrades' },
  { id: 'cyclone', name: 'Eul\'s Scepter', cost: 2725, category: 'upgrades' },
  { id: 'glimmer_cape', name: 'Glimmer Cape', cost: 1950, category: 'upgrades' },
  { id: 'aether_lens', name: 'Aether Lens', cost: 2275, category: 'upgrades' },
  { id: 'octarine_core', name: 'Octarine Core', cost: 5275, category: 'upgrades' },
  { id: 'refresher', name: 'Refresher Orb', cost: 5000, category: 'upgrades' },
  { id: 'guardian_greaves', name: 'Guardian Greaves', cost: 4950, category: 'upgrades' },
  { id: 'lotus_orb', name: 'Lotus Orb', cost: 3850, category: 'upgrades' },
  { id: 'solar_crest', name: 'Solar Crest', cost: 2625, category: 'upgrades' },
  { id: 'vladmir', name: 'Vladmir\'s Offering', cost: 2450, category: 'upgrades' },
  { id: 'pipe', name: 'Pipe of Insight', cost: 3475, category: 'upgrades' },
  { id: 'mekansm', name: 'Mekansm', cost: 1650, category: 'upgrades' },
  { id: 'urn_of_shadows', name: 'Urn of Shadows', cost: 880, category: 'upgrades' },
  { id: 'spirit_vessel', name: 'Spirit Vessel', cost: 2840, category: 'upgrades' },
  { id: 'crimson_guard', name: 'Crimson Guard', cost: 3500, category: 'upgrades' },
  { id: 'vanguard', name: 'Vanguard', cost: 1700, category: 'upgrades' },
  { id: 'bracer', name: 'Bracer', cost: 505, category: 'attributes' },
  { id: 'wraith_band', name: 'Wraith Band', cost: 505, category: 'attributes' },
  { id: 'null_talisman', name: 'Null Talisman', cost: 505, category: 'attributes' },
  { id: 'magic_wand', name: 'Magic Wand', cost: 450, category: 'attributes' },
  { id: 'soul_ring', name: 'Soul Ring', cost: 770, category: 'attributes' },
  { id: 'boots', name: 'Boots of Speed', cost: 500, category: 'attributes' },
  { id: 'clarity', name: 'Clarity', cost: 50, category: 'consumables' },
  { id: 'flask', name: 'Healing Salve', cost: 110, category: 'consumables' },
  { id: 'tango', name: 'Tango', cost: 90, category: 'consumables' },
  { id: 'smoke_of_deceit', name: 'Smoke of Deceit', cost: 80, category: 'consumables' },
  { id: 'dust', name: 'Dust of Appearance', cost: 80, category: 'consumables' },
  { id: 'ward_observer', name: 'Observer Ward', cost: 0, category: 'consumables' },
  { id: 'ward_sentry', name: 'Sentry Ward', cost: 75, category: 'consumables' },
  { id: 'bloodstone', name: 'Bloodstone', cost: 4400, category: 'upgrades' },
  { id: 'battle_fury', name: 'Battle Fury', cost: 4130, category: 'upgrades' },
  { id: 'radiance', name: 'Radiance', cost: 5050, category: 'upgrades' },
  { id: 'silver_edge', name: 'Silver Edge', cost: 5450, category: 'upgrades' },
  { id: 'echo_sabre', name: 'Echo Sabre', cost: 2500, category: 'upgrades' },
  { id: 'maelstrom', name: 'Maelstrom', cost: 2700, category: 'upgrades' },
  { id: 'dragon_lance', name: 'Dragon Lance', cost: 1900, category: 'upgrades' },
  { id: 'hurricane_pike', name: 'Hurricane Pike', cost: 4450, category: 'upgrades' },
  { id: 'yasha', name: 'Yasha', cost: 2000, category: 'upgrades' },
  { id: 'kaya', name: 'Kaya', cost: 2000, category: 'upgrades' },
  { id: 'sange', name: 'Sange', cost: 2000, category: 'upgrades' },
  { id: 'sange_and_yasha', name: 'Sange and Yasha', cost: 4100, category: 'upgrades' },
  { id: 'yasha_and_kaya', name: 'Yasha and Kaya', cost: 4100, category: 'upgrades' },
  { id: 'kaya_and_sange', name: 'Kaya and Sange', cost: 4100, category: 'upgrades' },
];

export const getItemImageUrl = (itemId: string): string => {
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${itemId}.png`;
};

export const getItemByName = (name: string): DotaItem | undefined => {
  return DOTA_ITEMS.find(item => item.name.toLowerCase() === name.toLowerCase());
};
