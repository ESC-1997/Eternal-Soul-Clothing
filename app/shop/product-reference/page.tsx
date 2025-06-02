'use client';

interface Product {
  id: string;
  title: string;
  tags: string[];
  category: string;
  gender: string;
  price?: number;
}

const products: Product[] = [
  {
    id: "6837ae4cfc22921d390fac92",
    title: "Eternally Cozy New-Gen Sweatpants",
    tags: ["mens", "sweats", "bottoms"],
    category: "Sweats",
    gender: "Mens",
    price: 45.00
  },
  {
    id: "6837a77ffd8bf79ea50c2e6f",
    title: "Eternally Bold",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 25.00
  },
  {
    id: "683781de85ebb655240f8919",
    title: "Eternal Vibe Women's Casual Leggings - Midnight Indigo",
    tags: ["womens", "leggings", "bottoms"],
    category: "Leggings",
    gender: "Women",
    price: 35.00
  },
  {
    id: "68377f8616435a536a06dede",
    title: "Eternal Vibe Women's Casual Leggings - Black",
    tags: ["womens", "leggings", "bottoms"],
    category: "Leggings",
    gender: "Women",
    price: 35.00
  },
  {
    id: "683763a0ced8bcc1e60d3a62",
    title: "Eternal Vibe Women's Casual Leggings - Grey",
    tags: ["womens", "leggings", "bottoms"],
    category: "Leggings",
    gender: "Women",
    price: 35.00
  },
  {
    id: "6837625974dbd4b84f013cca",
    title: "Eternal Love",
    tags: ["womens", "tshirt"],
    category: "T-Shirt",
    gender: "Women",
    price: 25.00
  },
  {
    id: "683756842f12da1cab085d7c",
    title: "Eternal Soul Sports Bra - Grey",
    tags: ["womens", "bra"],
    category: "Bra",
    gender: "Women",
    price: 35.00
  },
  {
    id: "68360008466ce6069d0b90d7",
    title: "Eternal Motion (Biker Shorts) - Midnight Waves",
    tags: ["womens", "shorts", "bottoms"],
    category: "Shorts",
    gender: "Women",
    price: 35.00
  },
  {
    id: "6835f16e725346fd320e752d",
    title: "Eternal Motion (Biker Shorts) - Charm Pink",
    tags: ["womens", "shorts", "bottoms"],
    category: "Shorts",
    gender: "Women",
    price: 35.00
  },
  {
    id: "6835ee132f12da1cab0805ef",
    title: "Eternal Motion (Biker Shorts) - Dark Grey",
    tags: ["womens", "shorts", "bottoms"],
    category: "Shorts",
    gender: "Women",
    price: 35.00
  },
  {
    id: "683520806bcc8fd0d80d4a0f",
    title: "Eternal Ascension T-Shirt",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "68326c3269e742166100b813",
    title: "Eternal Glow",
    tags: ["womens", "tshirt"],
    category: "T-Shirt",
    gender: "Women",
    price: 30.00
  },
  {
    id: "6831fb16049a5caa620a004e",
    title: "Eternally Untainted",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "68310185f5d9c1a985100823",
    title: "Eternal Shadow",
    tags: ["mens", "tshirt"],
    category: "T-Shirt",
    gender: "Men / Women / Unisex",
    price: 35.00
  },
  {
    id: "68308fb0091bd77e0309587f",
    title: "Eternal Swords Graphic Tee",
    tags: ["mens", "tshirt"],
    category: "T-Shirt",
    gender: "Men / Women / Unisex",
    price: 25.00
  },
  {
    id: "682ffd05b28c6bba12087a44",
    title: "Soulful Baseball Tee",
    tags: ["mens", "long sleeve", "shirt"],
    category: "Long Sleeve",
    gender: "Men / Women / Unisex",
    price: 30.00
  },
  {
    id: "682e3060e01d0723900aa637",
    title: "Eternal Tank - Women's Summer Top",
    tags: ["womens", "tank top"],
    category: "Tank Top",
    gender: "Women",
    price: 30.00
  },
  {
    id: "682dbe84049a5caa6208ed11",
    title: "Eternal Vibe Women's Casual Leggings - Light Pink",
    tags: ["womens", "leggings", "bottoms"],
    category: "Leggings",
    gender: "Women",
    price: 35.00
  },
  {
    id: "682cb629b4133fe21803df44",
    title: "The Eternal Snap (Vol. 2) - White",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "682b9cf4a908726ca70b8a8d",
    title: "The Eternal Snap (Vol. 2)",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "682b9829cb01057ec30ee8fc",
    title: "Eternal Rebirth (Mineral Wash)",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 45.00
  },
  {
    id: "6829066cc8782d21a1039cda",
    title: "Eternally Cozy Legacy Sweatpants",
    tags: ["mens", "sweats", "bottoms"],
    category: "Sweats",
    gender: "Mens",
    price: 45.00
  },
  {
    id: "6829030f8de41e64de032e9b",
    title: "Eternal Ascension - Women's Cropped Hoodie",
    tags: ["womens", "hoodie"],
    category: "Hoodie",
    gender: "Women",
    price: 50.00
  },
  {
    id: "6828fffb1b86b3997803d1af",
    title: "Eternal Soul Sports Bra",
    tags: ["womens", "bra"],
    category: "Bra",
    gender: "Women",
    price: 35.00
  },
  {
    id: "6828f8aec2588d18331054ee",
    title: "Eternal Motion (Biker Shorts) - Black",
    tags: ["womens", "shorts", "bottoms"],
    category: "Shorts",
    gender: "Women",
    price: 35.00
  },
  {
    id: "6828ef61ecd9db648306e954",
    title: "The Eternal Snap",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Men",
    price: 40.00
  },
  {
    id: "6828ede2465b246fe50cc776",
    title: "The Eternal Snap",
    tags: ["accessory", "hat", "headwear"],
    category: "Hat",
    gender: "Men",
    price: 40.00
  },
  {
    id: "68268cde04479021a204cf52",
    title: "Eternally Woven",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Men",
    price: 40.00
  },
  {
    id: "682265138de41e64de019528",
    title: "Eternal Awakening",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 40.00
  },
  {
    id: "6820b02093284a99660b189d",
    title: "Eternal Divide - Midnight Indigo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6820aed333803c3c4502120d",
    title: "Eternal Divide - Red",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6820ad40471efa6af008268a",
    title: "Eternal Divide - White",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6820abb0471efa6af0082632",
    title: "Eternal Divide - Grey",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681fe48893284a99660af2f9",
    title: "Eternal Divide - Black",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681fe068ebfdaacb650ca1d7",
    title: "Eternal Divide - Violet",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681acbd3c9285dd17e0dd618",
    title: "Eternal Collapse",
    tags: ["unisex", "tshirt"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 30.00
  },
  {
    id: "681ac79a1207456e76092f23",
    title: "Vow of the Eternal",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 30.00
  },
  {
    id: "68163f2a42fcdb2640010975",
    title: "Eternal Elegance - Red",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6816397864bdd1b0c608ecf7",
    title: "Eternal Elegance - Light Blue",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681637d444c4abfbc303ec25",
    title: "Eternal Elegance - Black Tee",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6816351f960c7decc0099524",
    title: "Eternal Elegance - Violet",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "68163317960c7decc0099499",
    title: "Eternal Elegance Grey",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6814c6d00ed813d9e5087aea",
    title: "Eternal Elegance",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681449c6b03bb3ed0c01a685",
    title: "Phoenix ES Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6814491964bdd1b0c60875d0",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681446b7b03bb3ed0c01a5c7",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6814469c5057e72cc20d67c7",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "681445f7b03bb3ed0c01a591",
    title: "ES Phoenix Logo",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 35.00
  },
  {
    id: "6813ea12a7ab600a950c4b5a",
    title: "Eternal Lotus (Black & Grey)",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 40.00
  },
  {
    id: "6813de3b9fb67dd986004dc8",
    title: "Eternal Lotus - Purple Floral Graphic Tee",
    tags: ["unisex", "tshirt", "customizable"],
    category: "T-Shirt",
    gender: "Unisex",
    price: 40.00
  }
];

export default function ProductReference() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-['Bebas_Neue'] text-[#1B1F3B] tracking-wider mb-8">
          PRODUCT REFERENCE
        </h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#DADBE4] text-[#1B1F3B]">
                <th className="px-4 py-2 text-left">Product ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Tags</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm text-[#1B1F3B]">{product.id}</td>
                  <td className="px-4 py-2 text-[#1B1F3B]">{product.title}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-[#1B1F3B] rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[#1B1F3B]">{product.category}</td>
                  <td className="px-4 py-2 text-[#1B1F3B]">{product.gender}</td>
                  <td className="px-4 py-2 text-[#1B1F3B]">
                    {product.price ? `$${product.price.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 