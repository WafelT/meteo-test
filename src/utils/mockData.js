// Mock data generator for products
const rarities = ['consumer', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert']
const tagsPool = ['postcard', 'limited', 'rare', 'collectible', 'vintage', 'holiday', 'birthday', 'wedding', 'artistic', 'handmade']

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2))
}

export function generateProducts(count = 80) {
  const products = []
  const names = [
    'Sunset Memories', 'Ocean Breeze', 'Mountain View', 'City Lights', 'Spring Bloom',
    'Winter Wonderland', 'Summer Paradise', 'Autumn Leaves', 'Starry Night', 'Golden Hour',
    'Rose Garden', 'Lavender Fields', 'Cherry Blossom', 'Tropical Paradise', 'Northern Lights',
    'Desert Sunset', 'Forest Path', 'Beach Sunset', 'Mountain Peak', 'Valley View'
  ]

  for (let i = 1; i <= count; i++) {
    const name = `${randomElement(names)} ${randomInt(1, 999)}`
    const rarity = randomElement(rarities)
    const tagCount = randomInt(1, 3)
    const tags = []
    for (let j = 0; j < tagCount; j++) {
      const tag = randomElement(tagsPool)
      if (!tags.includes(tag)) tags.push(tag)
    }

    products.push({
      id: `postcard_${String(i).padStart(3, '0')}`,
      name,
      price: randomFloat(2.99, 49.99),
      rarity,
      inStock: Math.random() > 0.2, // 80% in stock
      tags,
      image: `https://picsum.photos/seed/${i}/400/400`,
      updatedAt: new Date().toISOString()
    })
  }

  return products
}
