
export interface Property {
  id: string;
  title: string;
  type: string;
  status: 'For Sale' | 'For Rent';
  price: string;
  priceRaw: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  description: string;
  amenities: string[];
  agent: {
    name: string;
    phone: string;
    image: string;
  };
}

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Skyline Heights Apartment',
    type: 'Apartment',
    status: 'For Sale',
    price: '$850,000',
    priceRaw: 850000,
    location: 'Downtown, Metro City',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1450,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&h=600&auto=format&fit=crop'],
    description: 'A breathtaking 3-bedroom apartment with panoramic city views. Recently renovated with top-of-the-line appliances and modern finishes.',
    amenities: ['Gym', 'Swimming Pool', '24/7 Security', 'Covered Parking', 'Balcony'],
    agent: {
      name: 'John Smith',
      phone: '+1 555-0123',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&auto=format&fit=crop'
    }
  },
  {
    id: '2',
    title: 'Teal Garden Villa',
    type: 'Villa',
    status: 'For Sale',
    price: '$1,200,000',
    priceRaw: 1200000,
    location: 'Oakwood Suburbs',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=600&auto=format&fit=crop'],
    description: 'Spacious 4-bedroom villa with a private garden and modern architectural design. Perfect for families looking for serenity.',
    amenities: ['Private Garden', 'Modular Kitchen', 'Study Room', 'Home Theatre', 'Solar Power'],
    agent: {
      name: 'Sarah Connor',
      phone: '+1 555-0199',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop'
    }
  },
  {
    id: '3',
    title: 'Urban Studio Loft',
    type: 'Studio',
    status: 'For Rent',
    price: '$2,500/mo',
    priceRaw: 2500,
    location: 'West End, Arts District',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&h=600&auto=format&fit=crop'],
    description: 'Chic studio loft in the heart of the arts district. High ceilings, exposed brick, and vibrant community vibes.',
    amenities: ['High-speed Wi-Fi', 'Rooftop Lounge', 'Bike Storage', 'Pet Friendly'],
    agent: {
      name: 'Mike Ross',
      phone: '+1 555-0144',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&auto=format&fit=crop'
    }
  },
  {
    id: '4',
    title: 'Modern Family Penthouse',
    type: 'Penthouse',
    status: 'For Sale',
    price: '$2,100,000',
    priceRaw: 2100000,
    location: 'Crystal Harbor',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3500,
    images: ['https://images.unsplash.com/photo-1567496898731-daec1b36bcc0?q=80&w=800&h=600&auto=format&fit=crop'],
    description: 'Luxury living at its finest. This 5-bedroom penthouse features floor-to-ceiling windows and premium smart home integration.',
    amenities: ['Smart Home', 'Infinity Pool', 'Private Elevator', 'Wine Cellar'],
    agent: {
      name: 'Harvey Specter',
      phone: '+1 555-0177',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop'
    }
  }
];
