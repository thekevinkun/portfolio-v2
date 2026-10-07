// "used" = shipped in a real project · "learning" = not shipped yet (R4)
export type SkillStatus = "used" | "learning";

export type SkillItem = {
  name: string;
  // Key into the icon map built in P3.4
  iconKey: string;
  status: SkillStatus;
};

export type SkillGroup = {
  indexLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  iconKey: string;
  items: SkillItem[];
  highlights: string[];
  sort: number;
  visible: boolean;
};
