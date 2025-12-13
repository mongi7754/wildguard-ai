export interface NationalPark {
  id: string;
  name: string;
  country: string;
  region: string;
  area: number; // km²
  established: number;
  coordinates: { lat: number; lng: number };
  description: string;
  keyWildlife: string[];
  threats: string[];
  conservationStatus: 'stable' | 'vulnerable' | 'critical';
  rangerTeams: number;
  activeDrones: number;
  recentAlerts: number;
  imageEmoji: string;
}

export const kenyanParks: NationalPark[] = [
  {
    id: 'masai-mara',
    name: 'Masai Mara',
    country: 'Kenya',
    region: 'Narok County',
    area: 1510,
    established: 1961,
    coordinates: { lat: -1.4061, lng: 35.0167 },
    description: 'Famous for the Great Migration and exceptional big cat populations. One of Africa\'s most iconic wildlife destinations.',
    keyWildlife: ['Lion', 'Elephant', 'Wildebeest', 'Zebra', 'Cheetah', 'Leopard', 'Hippo'],
    threats: ['Poaching', 'Human-wildlife conflict', 'Habitat encroachment'],
    conservationStatus: 'stable',
    rangerTeams: 8,
    activeDrones: 3,
    recentAlerts: 2,
    imageEmoji: '🦁'
  },
  {
    id: 'amboseli',
    name: 'Amboseli',
    country: 'Kenya',
    region: 'Kajiado County',
    area: 392,
    established: 1974,
    coordinates: { lat: -2.6527, lng: 37.2606 },
    description: 'Known for large elephant herds and stunning views of Mount Kilimanjaro. A premier elephant research site.',
    keyWildlife: ['African Elephant', 'Cape Buffalo', 'Lion', 'Cheetah', 'Giraffe', 'Zebra'],
    threats: ['Drought', 'Human-wildlife conflict', 'Climate change'],
    conservationStatus: 'stable',
    rangerTeams: 5,
    activeDrones: 2,
    recentAlerts: 1,
    imageEmoji: '🐘'
  },
  {
    id: 'tsavo-east',
    name: 'Tsavo East',
    country: 'Kenya',
    region: 'Taita-Taveta County',
    area: 13747,
    established: 1948,
    coordinates: { lat: -2.8333, lng: 38.75 },
    description: 'One of the oldest and largest parks in Kenya. Known for red elephants and vast semi-arid landscapes.',
    keyWildlife: ['African Elephant', 'Lion', 'Leopard', 'Black Rhino', 'Hippo', 'Crocodile'],
    threats: ['Poaching', 'Drought', 'Infrastructure development'],
    conservationStatus: 'vulnerable',
    rangerTeams: 12,
    activeDrones: 4,
    recentAlerts: 5,
    imageEmoji: '🦏'
  },
  {
    id: 'tsavo-west',
    name: 'Tsavo West',
    country: 'Kenya',
    region: 'Taita-Taveta County',
    area: 9065,
    established: 1948,
    coordinates: { lat: -3.0, lng: 38.25 },
    description: 'Features diverse landscapes including volcanic hills, springs, and lava flows. Home to Mzima Springs.',
    keyWildlife: ['Black Rhino', 'African Elephant', 'Lion', 'Leopard', 'Buffalo', 'Hippo'],
    threats: ['Poaching', 'Human encroachment', 'Water scarcity'],
    conservationStatus: 'vulnerable',
    rangerTeams: 10,
    activeDrones: 3,
    recentAlerts: 4,
    imageEmoji: '🌋'
  },
  {
    id: 'lake-nakuru',
    name: 'Lake Nakuru',
    country: 'Kenya',
    region: 'Nakuru County',
    area: 188,
    established: 1961,
    coordinates: { lat: -0.3667, lng: 36.0833 },
    description: 'Famous for flamingos and rhino sanctuary. A critical habitat for endangered species.',
    keyWildlife: ['Flamingo', 'White Rhino', 'Black Rhino', 'Lion', 'Leopard', 'Rothschild Giraffe'],
    threats: ['Water pollution', 'Invasive species', 'Climate change'],
    conservationStatus: 'stable',
    rangerTeams: 4,
    activeDrones: 2,
    recentAlerts: 1,
    imageEmoji: '🦩'
  },
  {
    id: 'serengeti',
    name: 'Serengeti',
    country: 'Tanzania',
    region: 'Mara & Simiyu',
    area: 14763,
    established: 1951,
    coordinates: { lat: -2.3333, lng: 34.8333 },
    description: 'Host of the Great Migration with over 1.5 million wildebeest. A UNESCO World Heritage Site.',
    keyWildlife: ['Wildebeest', 'Zebra', 'Lion', 'Leopard', 'Elephant', 'Cheetah', 'Hyena'],
    threats: ['Poaching', 'Climate change', 'Infrastructure projects'],
    conservationStatus: 'stable',
    rangerTeams: 15,
    activeDrones: 5,
    recentAlerts: 3,
    imageEmoji: '🦓'
  },
  {
    id: 'samburu',
    name: 'Samburu',
    country: 'Kenya',
    region: 'Samburu County',
    area: 165,
    established: 1985,
    coordinates: { lat: 0.5833, lng: 37.5333 },
    description: 'Home to unique northern species including Grevy\'s zebra and reticulated giraffe.',
    keyWildlife: ['Grevy\'s Zebra', 'Reticulated Giraffe', 'Gerenuk', 'Somali Ostrich', 'Elephant'],
    threats: ['Drought', 'Poaching', 'Livestock grazing'],
    conservationStatus: 'vulnerable',
    rangerTeams: 4,
    activeDrones: 2,
    recentAlerts: 3,
    imageEmoji: '🦒'
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    region: 'Nairobi',
    area: 117,
    established: 1946,
    coordinates: { lat: -1.3733, lng: 36.8581 },
    description: 'The only national park within a capital city. Unique urban wildlife experience.',
    keyWildlife: ['Lion', 'Rhino', 'Buffalo', 'Giraffe', 'Zebra', 'Ostrich'],
    threats: ['Urban expansion', 'Habitat fragmentation', 'Human-wildlife conflict'],
    conservationStatus: 'critical',
    rangerTeams: 3,
    activeDrones: 2,
    recentAlerts: 6,
    imageEmoji: '🏙️'
  },
  {
    id: 'mount-kenya',
    name: 'Mount Kenya',
    country: 'Kenya',
    region: 'Central Kenya',
    area: 715,
    established: 1949,
    coordinates: { lat: -0.1522, lng: 37.3083 },
    description: 'Africa\'s second highest peak. UNESCO World Heritage Site with unique alpine ecosystems.',
    keyWildlife: ['Elephant', 'Buffalo', 'Black Rhino', 'Leopard', 'Giant Forest Hog', 'Bongo'],
    threats: ['Deforestation', 'Poaching', 'Climate change', 'Illegal logging'],
    conservationStatus: 'vulnerable',
    rangerTeams: 6,
    activeDrones: 2,
    recentAlerts: 2,
    imageEmoji: '🏔️'
  },
  {
    id: 'meru',
    name: 'Meru',
    country: 'Kenya',
    region: 'Meru County',
    area: 870,
    established: 1966,
    coordinates: { lat: 0.15, lng: 38.2 },
    description: 'Made famous by Born Free. Remote wilderness with diverse habitats from swamps to mountains.',
    keyWildlife: ['White Rhino', 'Black Rhino', 'Elephant', 'Lion', 'Leopard', 'Grevy\'s Zebra'],
    threats: ['Poaching', 'Human-wildlife conflict', 'Drought'],
    conservationStatus: 'stable',
    rangerTeams: 5,
    activeDrones: 2,
    recentAlerts: 2,
    imageEmoji: '🌿'
  }
];

export const getAllParks = () => kenyanParks;

export const getParkById = (id: string) => kenyanParks.find(p => p.id === id);

export const getParkStats = () => ({
  totalParks: kenyanParks.length,
  totalArea: kenyanParks.reduce((sum, p) => sum + p.area, 0),
  totalRangers: kenyanParks.reduce((sum, p) => sum + p.rangerTeams, 0),
  totalDrones: kenyanParks.reduce((sum, p) => sum + p.activeDrones, 0),
  totalAlerts: kenyanParks.reduce((sum, p) => sum + p.recentAlerts, 0)
});
