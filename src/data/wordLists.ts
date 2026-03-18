export type WordItem = {
  id: string;
  word: string;
  clues: [string, string, string];
};

export type WordList = {
  id: string;
  title: string;
  words: WordItem[];
};

export const defaultWordLists: WordList[] = [
  {
    id: 'movies',
    title: 'Films Célèbres',
    words: [
      { id: 'm1', word: 'Titanic', clues: ["Cette œuvre raconte une tragédie historique qui s'est déroulée en mer au début du 20ème siècle.", "L'intrigue se concentre sur une romance intense à bord d'un immense paquebot prétendument insubmersible.", "Les rôles principaux sont tenus par Leonardo DiCaprio et Kate Winslet."] },
      { id: 'm2', word: 'Matrix', clues: ["Le protagoniste découvre que le monde tel qu'il le connaît n'est qu'une simulation informatique complexe.", "Il doit faire un choix crucial entre une pilule bleue et une pilule rouge pour découvrir la vérité.", "Le héros, interprété par Keanu Reeves, doit apprendre à manipuler la réalité virtuelle pour combattre des machines."] },
      { id: 'm3', word: 'Inception', clues: ["L'histoire explore les méandres de l'esprit humain, où le temps s'écoule différemment selon le niveau de conscience.", "Les personnages utilisent une technologie secrète permettant de s'infiltrer dans les rêves des autres.", "Le symbole emblématique de ce film de Christopher Nolan est une toupie qui tourne indéfiniment."] },
      { id: 'm4', word: 'Jurassic Park', clues: ["Ce film d'aventure fantastique se déroule sur une île isolée servant de parc d'attractions scientifique.", "Les attractions principales ont été recréées à partir d'ADN extrait d'un moustique fossilisé dans l'ambre.", "Des dinosaures échappent à tout contrôle et menacent brutalement les visiteurs du parc."] },
      { id: 'm5', word: 'Star Wars', clues: ["C'est une épopée galactique mettant en scène la lutte éternelle entre la lumière et le côté obscur.", "Une arme redoutable en forme de planète, appelée l'Étoile de la Mort, menace la galaxie tout entière.", "La scène mythique de la saga révèle une vérité choquante avec la réplique culte : « Non, je suis ton père »."] }
    ]
  },
  {
    id: 'animals',
    title: 'Animaux',
    words: [
      { id: 'a1', word: 'Éléphant', clues: ["C'est un mammifère extrêmement imposant qui s'organise et vit en troupeau matriarcal.", "Il possède de grandes oreilles très reconnaissables qui l'aident à réguler sa température corporelle au soleil.", "Il se sert de sa longue trompe pour boire, attraper sa nourriture et interagir avec ses congénères."] },
      { id: 'a2', word: 'Guépard', clues: ["C'est un carnivore sauvage au profil très fin et aérodynamique vivant principalement dans les savanes d'Afrique.", "Son fin pelage fauve est entièrement parsemé de petites taches noires caractéristiques.", "Il est universellement reconnu comme étant l'animal terrestre le plus rapide au monde."] },
      { id: 'a3', word: 'Manchot', clues: ["C'est une créature bipède qui survit dans l'un des environnements les plus hostiles et froids du globe.", "Bien que ce soit classifié comme un oiseau marin, il est totalement incapable de voler dans les airs.", "On le trouve exclusivement en Antarctique et il se déplace de façon très amusante en glissant sur le ventre sur la glace."] },
      { id: 'a4', word: 'Caméléon', clues: ["Ce petit reptile souvent arboricole est réputé pour sa lenteur et sa capacité d'adaptation exceptionnelle.", "Il chasse les insectes grâce à une langue collante extrêmement rapide, et a des yeux qui bougent indépendamment.", "Sa caractéristique la plus célèbre est sa peau spéciale qui peut changer de couleur pour se fondre dans le décor."] },
      { id: 'a5', word: 'Ornithorynque', clues: ["C'est l'un des animaux semi-aquatiques les plus atypiques et étranges que l'on puisse rencontrer dans la nature.", "C'est une aberration évolutive : bien qu'il s'agisse d'un mammifère à fourrure, il a la particularité de pondre des œufs.", "Cet animal endémique d'Australie possède un large bec de canard, des pattes palmées et une queue de castor."] }
    ]
  },
  {
    id: 'kitchen',
    title: 'Objets de la cuisine',
    words: [
      { id: 'k1', word: 'Casserole', clues: ["C'est un récipient de base absolument indispensable pour la préparation des repas au quotidien.", "On l'utilise généralement posé sur une plaque chauffante pour porter des liquides à ébullition ou réduire des sauces.", "Elle est typiquement conçue en métal avec un fond plat, des bords cylindriques hauts et une poignée unique allongée."] },
      { id: 'k2', word: 'Blender', clues: ["C'est un appareil électroménager motorisé conçu pour transformer et mixer la texture de toutes sortes d'ingrédients.", "Il est équipé de lames tranchantes en acier qui tournent à très grande vitesse, fixées dans le fond du récipient.", "C'est l'outil parfait pour préparer des smoothies fruités, des soupes veloutées ou encore pour piler de la glace."] },
      { id: 'k3', word: 'Four', clues: ["Cet équipement volumineux est l'allié principal pour la cuisson lente, confinée et uniforme de nombreux plats.", "Il génère une chaleur enveloppante permettant de dorer, de gratiner ou de rôtir vos préparations culinaires.", "C'est la cavité chauffante incontournable pour réaliser de délicieux gâteaux, faire gonfler des tartes ou cuire du pain frais."] },
      { id: 'k4', word: 'Passoire', clues: ["C'est un ustensile de préparation extrêmement commun sans lequel la plupart des recettes de base seraient un vrai chaos.", "Elle prend la forme d'un grand bol creux dont la surface est percée de multiples petits trous réguliers.", "On s'en sert presque quotidiennement au dessus de l'évier pour égoutter le riz ou les pâtes après leur cuisson."] },
      { id: 'k5', word: 'Spatule', clues: ["C'est un outil très plat et extrêmement pratique pour manipuler la nourriture humide ou chaude pendant sa cuisson.", "Idéalement conçue en bois ou en silicone pour racler le fond des récipients sensibles et ne pas rayer leur revêtement.", "On glisse son bout plat sous les aliments pour retourner délicatement les crêpes ou les œufs dans une poêle brûlante."] }
    ]
  }
];
