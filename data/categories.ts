export interface Category {
  id: string
  name: string
  description: string
  image: string
  levels: {
    debutant: string
    intermediaire: string
    avance: string
  }
}

export const categories: Category[] = [
  {
    id: "coran",
    name: "Le Coran",
    description: "Teste tes connaissances sur les sourates, versets, lieux de révélation, et sciences coraniques.",
    image: "/coran.jpg",
    levels: {
      debutant: "Connaissances de base sur les sourates courtes",
      intermediaire: "Compréhension des thèmes principaux du Coran",
      avance: "Connaissance approfondie des versets et de leur contexte",
    },
  },
  {
    id: "sira",
    name: "La Sira du Prophète ﷺ",
    description: "Découvre la vie du Prophète Muhammad ﷺ, de sa naissance à sa mission prophétique et ses actions.",
    image: "/sira.jpg",
    levels: {
      debutant: "Événements clés de la vie du Prophète ﷺ",
      intermediaire: "Étapes majeures de la mission prophétique à La Mecque et Médine",
      avance: "Analyse approfondie des décisions politiques, pactes et expéditions du Prophète ﷺ",
    },
  },
  {
    id: "femmes",
    name: "Les Femmes du Prophète ﷺ",
    description: "Pars à la rencontre des épouses du Prophète Muhammad ﷺ, leurs histoires et leur rôle.",
    image: "/femmes.png",
    levels: {
      debutant: "Noms et liens familiaux des épouses",
      intermediaire: "Leur rôle dans la communauté musulmane",
      avance: "Leurs contributions dans la transmission du savoir religieux",
    },
  },
  {
    id: "prophètes",
    name: "Les Prophètes",
    description: "Apprends l’histoire des prophètes mentionnés dans le Coran et leur mission auprès de leurs peuples.",
    image: "/prophètes.jpg",
    levels: {
      debutant: "Identification des prophètes principaux",
      intermediaire: "Contexte historique de leurs messages",
      avance: "Comparaison de leurs récits à travers les révélations",
    },
  },
  {
    id: "sahaba",
    name: "Les Compagnons (Sahaba) et aussi bataille",
    description: "Explore la vie des compagnons du Prophète ﷺ et les batailles majeures de l’histoire islamique.",
    image: "/bataille.jpg",
    levels: {
      debutant: "Identification des compagnons et des batailles célèbres",
      intermediaire: "Leur rôle dans les événements majeurs de l’Islam",
      avance: "Analyse des stratégies et des décisions des compagnons dans les batailles",
    },
  },
  {
    id: "fiqh",
    name: "Fiqh (Jurisprudence)",
    description: "Teste tes connaissances sur les règles pratiques de l’Islam : purification, prière, mariage, etc.",
    image: "/fiqh.png",
    levels: {
      debutant: "Introduction aux règles de base de la purification, de la prière, du jeûne, de l'aumône et du pèlerinage.",
      intermediaire: "Application des règles de la jurisprudence islamique dans la vie quotidienne : transactions, mariage, divorce, héritage.",
      avance: "Compréhension des divergences entre écoles juridiques (madhahib) et raisonnement juridique (ijtihad)",
    },
  } ,
  
   
]
