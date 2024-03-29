export interface DataTypeStyles {
  labelPlural: string;
  labelSingular: string;
  buttonDark: string;
  buttonDarkHover: string;
}

export interface DataTypeStylesLookup {
  [key: string]: {
    labelPlural: string;
    labelSingular: string;
    buttonDark: string;
    buttonDarkHover: string;
  };
}

export const DATATYPE_STYLES_LOOKUP: DataTypeStylesLookup = {
  artists: {
    labelPlural: "Artists",
    labelSingular: "Artist",
    buttonDark: "bg-green-500",
    buttonDarkHover: "bg-green-600",
  },
  albums: {
    labelPlural: "Albums",
    labelSingular: "Album",
    buttonDark: "bg-yellow-500",
    buttonDarkHover: "bg-yellow-600",
  },
  tracks: {
    labelPlural: "Songs",
    labelSingular: "Song",
    buttonDark: "bg-red-500",
    buttonDarkHover: "bg-red-600",
  },
};
