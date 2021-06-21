const purposes = [
  {
    text: "Residential",
    value: "RESIDENTIAL",
    description:
      "The Place is meant for (and features facilities that support) <strong>General Accommodation</strong>.",
    icon: "mdi-home-account"
  },
  {
    text: "Commercial",
    value: "COMMERCIAL",
    description:
      "The Place is meant for <strong>Commercial</strong> or <strong>Business</strong> purposes. <br />E.g. An Office space, Shop or Kiosk, Art Gallery or Workspace",
    icon: "mdi-domain"
  },
  {
    text: "Events",
    value: "EVENTS",
    description:
      "The Place is designed to host <strong>Events</strong>, <strong>Meetings</strong>, and/or <strong>medium to large Gatherings</strong>. <br /> E.g. Event Center, Multi-purpose Hall, Open Bar, Garden, Club",
    icon: "mdi-calendar-check"
  },
  {
    text: "Any Purpose",
    value: "ANY",
    description:
      "The Place can be used for multiple Purposes and has facilities to support any guest usage.",
    icon: "mdi-multiplication-box"
  }
];

const APT = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  },
  {
    text: "Self Contained Unit",
    value: "Self Contained Unit",
    description: ""
  },
  {
    text: "Serviced Apartment",
    value: "Serviced Apartment",
    description: ""
  },
  {
    text: "Condominium",
    value: "Condominium",
    description: ""
  },
  {
    text: "Serviced Apartment",
    value: "Serviced Apartment",
    description: ""
  }
];

const SCU = [
  {
    text: "Boys Quarters",
    value: "Boys Quarters",
    description: ""
  },
  {
    text: "Guest House",
    value: "Guest House",
    description: ""
  },
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const HOT = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const UQS = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const HSE = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const OFS = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const SHP = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const KSK = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const LGE = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const CAF = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const BKL = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const EVT = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const CFR = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const ODV = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const MED = [
  {
    text: "Flat",
    value: "Flat",
    description: ""
  }
];

const subgroups = {
  MED,
  ODV,
  CFR,
  EVT,
  BKL,
  CAF,
  LGE,
  KSK,
  SHP,
  OFS,
  HSE,
  APT,
  SCU,
  HOT,
  UQS
};

const RESIDENTIAL = [
  {
    text: "Apartment",
    value: "Apartment",
    code: "APT",
    icon: "mdi-city",
    description: ""
  },
  {
    text: "Secondary Unit",
    value: "Secondary Unit",
    code: "SCU",
    icon: "mdi-home-export-outline",
    description: ""
  },
  {
    text: "Hotel Room",
    value: "Hotel Room",
    code: "HOT",
    icon: "mdi-home-modern",
    description: ""
  },
  {
    text: "Unique Space",
    value: "Unique Space",
    code: "UQS",
    icon: "mdi-space-station",
    description: ""
  },
  {
    text: "House",
    value: "House",
    code: "HSE",
    icon: "mdi-home-variant",
    description: ""
  }
];

const COMMERCIAL = [
  {
    text: "Office Space",
    value: "Office Space",
    code: "OFS",
    icon: "mdi-domain",
    description: ""
  },
  {
    text: "Shop Space",
    value: "Shop Space",
    code: "SHP",
    icon: "mdi-store",
    description: ""
  },
  {
    text: "Kiosk",
    value: "Kiosk",
    code: "KSK",
    icon: "mdi-storefront",
    description: ""
  },
  {
    text: "Lounge",
    value: "Lounge",
    code: "LGE",
    icon: "mdi-glass-cocktail",
    description: ""
  },
  {
    text: "Cafe",
    value: "Cafe",
    icon: "mdi-coffee",
    code: "CAF",
    description: ""
  },
  {
    text: "Book Club / Library",
    value: "Book Club",
    code: "BKL",
    icon: "mdi-bookshelf",
    description: ""
  }
];

const EVENTS = [
  {
    text: "Event Center",
    value: "Event Center",
    code: "EVT",
    icon: "mdi-party-popper",
    description: ""
  },
  {
    text: "Conference Room",
    value: "Conference Room",
    code: "CFR",
    icon: "mdi-teach",
    description: ""
  },
  {
    text: "Outdoor Venue",
    value: "Outdoor Venue",
    code: "ODV",
    icon: "mdi-tree",
    description: ""
  },
  {
    text: "Theater / Media Center",
    value: "Media Center",
    code: "MED",
    icon: "mdi-theater",
    description: ""
  }
];

const kinds = {
  RESIDENTIAL,
  COMMERCIAL,
  EVENTS,
  ANY: [...RESIDENTIAL, ...COMMERCIAL, ...EVENTS]
};

const types = [
  {
    text: "Entire Place",
    value: "ENTIRE_PLACE",
    icon: "mdi-key-chain",
    description:
      "Guests have the whole place to themselves. This usually includes a bedroom, a bathroom, and a kitchen."
  },
  {
    text: "Private Room",
    value: "PRIVATE_ROOM",
    icon: "mdi-account-key",
    description:
      "Guests have their own private room for sleeping. Other areas could be shared."
  },
  {
    text: "Shared Room",
    value: "SHARED_ROOM",
    icon: "mdi-account-group",
    description:
      "Guests sleep in a bedroom or a common area that could be shared with others."
  }
];

const guestsShouldKnow = [
  {
    title: "Must climb stairs",
    info: "Describe the stairs (for example, how many flights)",
    description: "",
    id: 1
  },
  {
    title: "Potential for noise",
    info: "Describe the noise and when it's likely to take place",
    description: "",
    id: 2
  },
  {
    title: "Pet(s) live on property",
    info: "Describe the pets you may have",
    description: "",
    id: 3
  },
  {
    title: "No parking on property",
    info: "Describe the parking situation around the listing",
    description: "",
    id: 4
  },
  {
    title: "Some spaces are shared",
    info: "Describe the spaces guests will share",
    description: "",
    id: 5
  },
  {
    title: "Amenity Limitations",
    info:
      "Describe the amenities or service that are limited, such as weak wifi or limited power supply",
    description: "",
    id: 6
  },
  {
    title: "Surveillance or recording devices on property",
    info:
      "Describe any device that records or sends video, audio, or still images. Specify each device’s location and whether it will be on or off.",
    description: "",
    id: 7
  },
  {
    title: "Weapons on property",
    info:
      "Describe any weapons (firearms, airguns, tasers, etc.), their location, and how they’re secured",
    description: "",
    id: 8
  },
  {
    title: "Dangerous animals on property",
    info:
      "Describe any domesticated or wild animals that could be a health or safety risk to guests or other animals ",
    description: "",
    id: 9
  }
];

module.exports = { types, purposes, kinds, subgroups, guestsShouldKnow };
