export type RunDeckData = {
  sections: Section[]
}

export type Section = {
  name: string
  rows: Row[]
}

export type Row = {
  items: Item[]
}

export type BaseItem = {
  text: string
  id: string
}

export type RunExecutableItem = BaseItem & {
  type: "RunExecutable",
}

export type OpenUrlItem = BaseItem & {
  type: "OpenUrl",
}

export type Item =
  | RunExecutableItem
  | OpenUrlItem