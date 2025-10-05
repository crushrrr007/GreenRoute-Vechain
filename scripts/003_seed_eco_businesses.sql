-- Seed eco-friendly businesses for the marketplace

INSERT INTO public.eco_businesses (name, business_type, location, description, certifications, contact_info, rating, is_verified) VALUES
  (
    'Green Haven Eco Lodge',
    'hotel',
    'Costa Rica',
    'Solar-powered eco-lodge in the rainforest with organic farm-to-table dining',
    ARRAY['Green Key Certified', 'Rainforest Alliance', 'Carbon Neutral'],
    '{"email": "info@greenhaven.cr", "phone": "+506-1234-5678", "website": "https://greenhaven.cr"}'::jsonb,
    4.8,
    true
  ),
  (
    'Bamboo Bikes Tours',
    'transport',
    'Thailand',
    'Sustainable bicycle tours using locally-made bamboo bikes',
    ARRAY['Travelife Certified', 'B Corp'],
    '{"email": "tours@bamboobikes.th", "phone": "+66-12-345-6789", "website": "https://bamboobikes.th"}'::jsonb,
    4.9,
    true
  ),
  (
    'Ocean Guardians Diving',
    'activity',
    'Philippines',
    'Eco-diving experiences with coral reef restoration programs',
    ARRAY['Green Fins', 'PADI Eco Center'],
    '{"email": "dive@oceanguardians.ph", "phone": "+63-123-456-7890", "website": "https://oceanguardians.ph"}'::jsonb,
    4.7,
    true
  ),
  (
    'Farm to Fork Restaurant',
    'restaurant',
    'Italy',
    'Zero-waste restaurant using only local, seasonal ingredients',
    ARRAY['Slow Food', 'Organic Certified', 'Zero Waste'],
    '{"email": "info@farmtofork.it", "phone": "+39-123-456-7890", "website": "https://farmtofork.it"}'::jsonb,
    4.6,
    true
  ),
  (
    'Solar Safari Lodge',
    'hotel',
    'Kenya',
    '100% solar-powered safari lodge supporting local communities',
    ARRAY['Ecotourism Kenya', 'Fair Trade Tourism'],
    '{"email": "bookings@solarsafari.ke", "phone": "+254-123-456-789", "website": "https://solarsafari.ke"}'::jsonb,
    4.9,
    true
  ),
  (
    'Electric Tuk Tuk Tours',
    'transport',
    'India',
    'Zero-emission electric tuk tuk city tours',
    ARRAY['Green Tourism', 'Carbon Neutral'],
    '{"email": "tours@etuktuks.in", "phone": "+91-1234-567-890", "website": "https://etuktuks.in"}'::jsonb,
    4.5,
    true
  ),
  (
    'Permaculture Farm Stay',
    'hotel',
    'Portugal',
    'Educational farm stay teaching sustainable agriculture',
    ARRAY['WWOOF', 'Organic Certified', 'Permaculture Certified'],
    '{"email": "stay@permafarm.pt", "phone": "+351-123-456-789", "website": "https://permafarm.pt"}'::jsonb,
    4.8,
    true
  ),
  (
    'Vegan Nomad Cafe',
    'restaurant',
    'Bali',
    'Plant-based cafe with composting and zero plastic policy',
    ARRAY['Vegan Certified', 'Zero Waste', 'Plastic Free'],
    '{"email": "hello@vegannomad.id", "phone": "+62-123-456-7890", "website": "https://vegannomad.id"}'::jsonb,
    4.7,
    true
  ),
  (
    'Kayak & Conservation',
    'activity',
    'New Zealand',
    'Kayaking tours with marine wildlife conservation education',
    ARRAY['Qualmark Enviro-Gold', 'DOC Concession'],
    '{"email": "paddle@kayakconservation.nz", "phone": "+64-12-345-6789", "website": "https://kayakconservation.nz"}'::jsonb,
    4.9,
    true
  ),
  (
    'Community Homestay Network',
    'hotel',
    'Nepal',
    'Authentic homestays supporting local communities',
    ARRAY['Fair Trade Tourism', 'Community Based Tourism'],
    '{"email": "stay@homestaynepal.np", "phone": "+977-123-456-7890", "website": "https://homestaynepal.np"}'::jsonb,
    4.6,
    true
  );
