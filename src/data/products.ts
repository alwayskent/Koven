export type Product = {
  id: string;
  name: string;
  /** Price in IDR (Rupiah). Integer, no decimals. */
  price: number;
  category: "Hoodies" | "Tees" | "Jackets" | "Denim" | "Accessories";
  description: string;
  /** Unsplash URLs, each requested at ?w=800 */
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  tag?: string;
};

// Shared size runs, kept realistic per category.
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const JACKET_SIZES = ["S", "M", "L", "XL", "XXL"];
const DENIM_SIZES = ["28", "30", "32", "34", "36"];
const SHOE_SIZES = ["40", "41", "42", "43", "44"];
const ONE_SIZE = ["One Size"];

export const products: Product[] = [
  {
    id: "koven-essential-tee",
    name: "KOVEN Essential Tee",
    price: 249000,
    category: "Tees",
    description:
      "The everyday anchor of the collection. Heavyweight cotton jersey with a boxy cut, ribbed collar, and a clean chest ready for the KOVEN mark.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800",
    ],
    sizes: APPAREL_SIZES,
    colors: ["Off-White", "Black", "Grey"],
    stock: 120,
    tag: "New Drop",
  },
  {
    id: "koven-oversized-graphic-tee",
    name: "KOVEN Oversized Graphic Tee",
    price: 279000,
    category: "Tees",
    description:
      "Dropped shoulders and a heavyweight 240gsm body carrying the season's print. Pre-shrunk so the fit holds after every wash.",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800",
    ],
    sizes: APPAREL_SIZES,
    colors: ["Black", "Off-White"],
    stock: 85,
  },
  {
    id: "koven-logo-hoodie",
    name: "KOVEN Logo Hoodie",
    price: 399000,
    category: "Hoodies",
    description:
      "400gsm brushed fleece with a double-layer hood and kangaroo pocket. Tonal logo embroidery across the chest.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800",
    ],
    sizes: APPAREL_SIZES,
    colors: ["Grey", "Black", "Navy"],
    stock: 64,
    tag: "New Drop",
  },
  {
    id: "koven-heavyweight-hoodie",
    name: "KOVEN Heavyweight Hoodie",
    price: 449000,
    category: "Hoodies",
    description:
      "Our heaviest layer. Loopback fleece, reinforced ribbing, and a structured hood built to keep its shape.",
    images: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    ],
    sizes: APPAREL_SIZES,
    colors: ["Black", "Olive", "Off-White"],
    stock: 40,
  },
  {
    id: "koven-track-jacket",
    name: "KOVEN Track Jacket",
    price: 499000,
    category: "Jackets",
    description:
      "Lightweight shell with a full zip, stand collar, and mesh lining. Packs down small, blocks wind on the move.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800",
    ],
    sizes: JACKET_SIZES,
    colors: ["Olive", "Black", "Navy"],
    stock: 52,
  },
  {
    id: "koven-varsity-jacket",
    name: "KOVEN Varsity Jacket",
    price: 749000,
    category: "Jackets",
    description:
      "Melton wool body with contrast sleeves, snap placket, and chain-stitch lettering. The heaviest piece in the drop.",
    images: [
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    ],
    sizes: JACKET_SIZES,
    colors: ["Black", "Navy"],
    stock: 18,
    tag: "Limited",
  },
  {
    id: "koven-coach-jacket",
    name: "KOVEN Coach Jacket",
    price: 549000,
    category: "Jackets",
    description:
      "Boxy coach silhouette in a matte water-resistant finish. Snap front, side pockets, printed back panel.",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    ],
    sizes: JACKET_SIZES,
    colors: ["Olive", "Black"],
    stock: 30,
  },
  {
    id: "koven-cargo-pants",
    name: "KOVEN Cargo Pants",
    price: 379000,
    category: "Denim",
    description:
      "Relaxed cargo cut with bellowed pockets, adjustable hems, and a mid rise. Built for movement, cut for the street.",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800",
    ],
    sizes: DENIM_SIZES,
    colors: ["Black", "Olive", "Grey"],
    stock: 75,
  },
  {
    id: "koven-wide-leg-denim",
    name: "KOVEN Wide-Leg Denim",
    price: 429000,
    category: "Denim",
    description:
      "14oz rigid denim in a wide, full-length leg. Raw hem, hidden selvedge, and a high rise that breaks clean over any sneaker.",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800",
    ],
    sizes: DENIM_SIZES,
    colors: ["Navy", "Black", "Off-White"],
    stock: 58,
  },
  {
    id: "koven-washed-denim-jacket",
    name: "KOVEN Washed Denim Jacket",
    price: 579000,
    category: "Denim",
    description:
      "Classic trucker shape in a stone-washed 12oz denim. Point collar, chest flap pockets, and contrast topstitching.",
    images: [
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800",
    ],
    sizes: JACKET_SIZES,
    colors: ["Navy", "Off-White"],
    stock: 26,
    tag: "Limited",
  },
  {
    id: "koven-runner-sneakers",
    name: "KOVEN Runner Sneakers",
    price: 899000,
    category: "Accessories",
    description:
      "Low-profile runner on a cushioned foam midsole with a suede and mesh upper. Grippy rubber outsole, everyday weight.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800",
    ],
    sizes: SHOE_SIZES,
    colors: ["Off-White", "Black", "Grey"],
    stock: 22,
  },
  {
    id: "koven-dad-cap",
    name: "KOVEN Dad Cap",
    price: 199000,
    category: "Accessories",
    description:
      "Unstructured six-panel cap in washed cotton with a curved brim and adjustable strap. One size, fits most.",
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800",
    ],
    sizes: ONE_SIZE,
    colors: ["Grey", "Off-White", "Black"],
    stock: 90,
  },
];

export const categories = [
  "All",
  "Hoodies",
  "Tees",
  "Jackets",
  "Denim",
  "Accessories",
] as const;
