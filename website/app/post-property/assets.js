export const IMG = {
  heroMain:
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=1100&fit=crop&q=82',
  heroTop:
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop&q=82',
  heroBottom:
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop&q=82',
  bento1:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=640&h=480&fit=crop&q=82',
  bento2:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=640&h=480&fit=crop&q=82',
  bento3:
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=640&h=480&fit=crop&q=82',
  quote: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=82',
};

export function billingSuffix(cycle) {
  const m = {
    monthly: ' / month',
    quarterly: ' / quarter',
    half_yearly: ' / 6 months',
    yearly: ' / year',
  };
  return m[cycle] || '';
}

