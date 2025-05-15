
// List of African countries and their currencies
export interface AfricanCountry {
  code: string;
  name: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
}

export const africanCountries: AfricanCountry[] = [
  {
    code: "dz",
    name: "Algeria",
    currency: {
      code: "DZD",
      name: "Algerian Dinar",
      symbol: "د.ج"
    }
  },
  {
    code: "ao",
    name: "Angola",
    currency: {
      code: "AOA",
      name: "Angolan Kwanza",
      symbol: "Kz"
    }
  },
  {
    code: "bj",
    name: "Benin",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "bw",
    name: "Botswana",
    currency: {
      code: "BWP",
      name: "Botswana Pula",
      symbol: "P"
    }
  },
  {
    code: "bf",
    name: "Burkina Faso",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "bi",
    name: "Burundi",
    currency: {
      code: "BIF",
      name: "Burundian Franc",
      symbol: "FBu"
    }
  },
  {
    code: "cv",
    name: "Cabo Verde",
    currency: {
      code: "CVE",
      name: "Cape Verdean Escudo",
      symbol: "Esc"
    }
  },
  {
    code: "cm",
    name: "Cameroon",
    currency: {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA"
    }
  },
  {
    code: "cf",
    name: "Central African Republic",
    currency: {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA"
    }
  },
  {
    code: "td",
    name: "Chad",
    currency: {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA"
    }
  },
  {
    code: "km",
    name: "Comoros",
    currency: {
      code: "KMF",
      name: "Comorian Franc",
      symbol: "CF"
    }
  },
  {
    code: "cg",
    name: "Congo",
    currency: {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA"
    }
  },
  {
    code: "cd",
    name: "Congo (Democratic Republic)",
    currency: {
      code: "CDF",
      name: "Congolese Franc",
      symbol: "FC"
    }
  },
  {
    code: "ci",
    name: "Côte d'Ivoire",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "dj",
    name: "Djibouti",
    currency: {
      code: "DJF",
      name: "Djiboutian Franc",
      symbol: "Fdj"
    }
  },
  {
    code: "eg",
    name: "Egypt",
    currency: {
      code: "EGP",
      name: "Egyptian Pound",
      symbol: "E£"
    }
  },
  {
    code: "gq",
    name: "Equatorial Guinea",
    currency: {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA"
    }
  },
  {
    code: "er",
    name: "Eritrea",
    currency: {
      code: "ERN",
      name: "Eritrean Nakfa",
      symbol: "Nfk"
    }
  },
  {
    code: "sz",
    name: "Eswatini",
    currency: {
      code: "SZL",
      name: "Swazi Lilangeni",
      symbol: "L"
    }
  },
  {
    code: "et",
    name: "Ethiopia",
    currency: {
      code: "ETB",
      name: "Ethiopian Birr",
      symbol: "Br"
    }
  },
  {
    code: "ga",
    name: "Gabon",
    currency: {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA"
    }
  },
  {
    code: "gm",
    name: "Gambia",
    currency: {
      code: "GMD",
      name: "Gambian Dalasi",
      symbol: "D"
    }
  },
  {
    code: "gh",
    name: "Ghana",
    currency: {
      code: "GHS",
      name: "Ghanaian Cedi",
      symbol: "₵"
    }
  },
  {
    code: "gn",
    name: "Guinea",
    currency: {
      code: "GNF",
      name: "Guinean Franc",
      symbol: "FG"
    }
  },
  {
    code: "gw",
    name: "Guinea-Bissau",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "ke",
    name: "Kenya",
    currency: {
      code: "KES",
      name: "Kenyan Shilling",
      symbol: "KSh"
    }
  },
  {
    code: "ls",
    name: "Lesotho",
    currency: {
      code: "LSL",
      name: "Lesotho Loti",
      symbol: "L"
    }
  },
  {
    code: "lr",
    name: "Liberia",
    currency: {
      code: "LRD",
      name: "Liberian Dollar",
      symbol: "L$"
    }
  },
  {
    code: "ly",
    name: "Libya",
    currency: {
      code: "LYD",
      name: "Libyan Dinar",
      symbol: "ل.د"
    }
  },
  {
    code: "mg",
    name: "Madagascar",
    currency: {
      code: "MGA",
      name: "Malagasy Ariary",
      symbol: "Ar"
    }
  },
  {
    code: "mw",
    name: "Malawi",
    currency: {
      code: "MWK",
      name: "Malawian Kwacha",
      symbol: "MK"
    }
  },
  {
    code: "ml",
    name: "Mali",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "mr",
    name: "Mauritania",
    currency: {
      code: "MRU",
      name: "Mauritanian Ouguiya",
      symbol: "UM"
    }
  },
  {
    code: "mu",
    name: "Mauritius",
    currency: {
      code: "MUR",
      name: "Mauritian Rupee",
      symbol: "₨"
    }
  },
  {
    code: "ma",
    name: "Morocco",
    currency: {
      code: "MAD",
      name: "Moroccan Dirham",
      symbol: "د.م."
    }
  },
  {
    code: "mz",
    name: "Mozambique",
    currency: {
      code: "MZN",
      name: "Mozambican Metical",
      symbol: "MT"
    }
  },
  {
    code: "na",
    name: "Namibia",
    currency: {
      code: "NAD",
      name: "Namibian Dollar",
      symbol: "N$"
    }
  },
  {
    code: "ne",
    name: "Niger",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "ng",
    name: "Nigeria",
    currency: {
      code: "NGN",
      name: "Nigerian Naira",
      symbol: "₦"
    }
  },
  {
    code: "rw",
    name: "Rwanda",
    currency: {
      code: "RWF",
      name: "Rwandan Franc",
      symbol: "RF"
    }
  },
  {
    code: "st",
    name: "São Tomé and Príncipe",
    currency: {
      code: "STN",
      name: "São Tomé and Príncipe Dobra",
      symbol: "Db"
    }
  },
  {
    code: "sn",
    name: "Senegal",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "sc",
    name: "Seychelles",
    currency: {
      code: "SCR",
      name: "Seychellois Rupee",
      symbol: "SR"
    }
  },
  {
    code: "sl",
    name: "Sierra Leone",
    currency: {
      code: "SLL",
      name: "Sierra Leonean Leone",
      symbol: "Le"
    }
  },
  {
    code: "so",
    name: "Somalia",
    currency: {
      code: "SOS",
      name: "Somali Shilling",
      symbol: "Sh.So."
    }
  },
  {
    code: "za",
    name: "South Africa",
    currency: {
      code: "ZAR",
      name: "South African Rand",
      symbol: "R"
    }
  },
  {
    code: "ss",
    name: "South Sudan",
    currency: {
      code: "SSP",
      name: "South Sudanese Pound",
      symbol: "£"
    }
  },
  {
    code: "sd",
    name: "Sudan",
    currency: {
      code: "SDG",
      name: "Sudanese Pound",
      symbol: "ج.س."
    }
  },
  {
    code: "tz",
    name: "Tanzania",
    currency: {
      code: "TZS",
      name: "Tanzanian Shilling",
      symbol: "TSh"
    }
  },
  {
    code: "tg",
    name: "Togo",
    currency: {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA"
    }
  },
  {
    code: "tn",
    name: "Tunisia",
    currency: {
      code: "TND",
      name: "Tunisian Dinar",
      symbol: "د.ت"
    }
  },
  {
    code: "ug",
    name: "Uganda",
    currency: {
      code: "UGX",
      name: "Ugandan Shilling",
      symbol: "USh"
    }
  },
  {
    code: "zm",
    name: "Zambia",
    currency: {
      code: "ZMW",
      name: "Zambian Kwacha",
      symbol: "ZK"
    }
  },
  {
    code: "zw",
    name: "Zimbabwe",
    currency: {
      code: "ZWL",
      name: "Zimbabwean Dollar",
      symbol: "Z$"
    }
  }
];
