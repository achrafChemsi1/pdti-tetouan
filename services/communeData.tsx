
export interface CommuneInfo {
    name: string;
    officialName: string;
    population: number;
    coordinates: [number, number]; // [lat, lng]
}

export const COMMUNE_DATA: Record<string, CommuneInfo> = {
    "AIN LAHSAN": { name: "Ain Lahsen", officialName: "Ain Lahsan", population: 7450, coordinates: [35.5640, -5.5737] },
    "AL HAMRA": { name: "Al Hamra", officialName: "Al Hamra", population: 11877, coordinates: [35.3479, -5.3532] },
    "AL KHARROUB": { name: "Al Kharroub", officialName: "AL Kharroub", population: 2099, coordinates: [35.4082, -5.6818] },
    "AL OUED": { name: "Al Oued", officialName: "Al Oued", population: 11690, coordinates: [35.2704, -5.3156] },
    "AZLA": { name: "Azla", officialName: "Azla", population: 22985, coordinates: [35.5336, -5.2853] },
    "BGHAGHZA": { name: "Bghaghza", officialName: "Bghaghza", population: 9283, coordinates: [35.4609, -5.5991] },
    "BNI HARCHEN": { name: "Bni Harchen", officialName: "Bni Harchen", population: 6432, coordinates: [35.5226, -5.6585] },
    "BNI IDDER": { name: "Bni Idder", officialName: "Bni Idder", population: 4659, coordinates: [35.4367, -5.5296] },
    "BNI LEIT": { name: "Bni Leit", officialName: "Bni Leit", population: 5004, coordinates: [35.3068, -5.4340] },
    "BNI SAID": { name: "Bni Said", officialName: "Bni Said", population: 10465, coordinates: [35.4207, -5.1779] },
    "DAR BNI KARRICH": { name: "Dar Bni Karrich", officialName: "Dar Bni Karrich", population: 6002, coordinates: [35.5264, -5.4133] },
    "JBEL LAHBIB": { name: "Jbel Lahbib", officialName: "Jbel Lahbib", population: 2632, coordinates: [35.4610, -5.7760] },
    "MALLALIENNE": { name: "Mallalienne", officialName: "Mallalienne", population: 10874, coordinates: [35.6307, -5.3762] },
    "OUED LAOU": { name: "Oued Laou", officialName: "Oued Laou", population: 11690, coordinates: [35.4576, -5.1172] },
    "OULAD ALI MANSOUR": { name: "Oulad Ali Mansour", officialName: "Oulad Ali Mansour", population: 4683, coordinates: [35.3653, -5.2452] },
    "SADDINA": { name: "Saddina", officialName: "Saddina", population: 7619, coordinates: [35.6321, -5.4397] },
    "SAHTRYINE": { name: "Sahtryine", officialName: "Sahtryine", population: 8733, coordinates: [35.4905, -5.4731] },
    "SOUK LKDIM": { name: "Souk Lkdim", officialName: "Souk Lkdim", population: 8699, coordinates: [35.6088, -5.5214] },
    "TETOUAN": { name: "Tetouan", officialName: "Tetouan", population: 453000, coordinates: [35.5818, -5.3414] },
    "ZAITOUNE": { name: "Zaitoune", officialName: "Zaitoune", population: 13742, coordinates: [35.5110, -5.3528] },
    "ZAOUIAT SIDI KACEM": { name: "Zaouiat Sidi Kacem", officialName: "Zaouiat Sidi Kacem", population: 12851, coordinates: [35.4767, -5.2252] },
    "ZINAT": { name: "Zinat", officialName: "Zinat", population: 8241, coordinates: [35.4287, -5.3927] }
};