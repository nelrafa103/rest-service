type Medium = {
  id: number;
  name: string;
  storyline: string;
  summary: string;
  url: string;
  genres: string[];
  artwork: {
    url: string;
    height: number;
    width: number;
  };
  website: {
    url: string;
  };
  involved_companies: {
    company: {
      name: string;
    };
  };
  platforms: {
    name: string;
  };
  language_support: {
    name: string;
  };
};
