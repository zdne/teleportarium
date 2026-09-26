export type MunitorumOption = { id: string; label: string; points: number };
export type MunitorumUnit = { id: string; name: string; options: MunitorumOption[]; upgrades?: MunitorumOption[] };
export type Munitorum = {
  id: string; faction: string; label: string; source: string; sourceUrl: string;
  updated: string; retrieved: string; dateVerified: boolean; sourceVersion: string;
  completeness: string; units: MunitorumUnit[];
};
