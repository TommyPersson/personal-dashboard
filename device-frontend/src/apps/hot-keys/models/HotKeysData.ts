
export type HotKeysData = {
  sections: HotKeySection[]
}

export type HotKeySection = {
  name: string
  hotKeys: HotKey[]
}

export type HotKey = {
  id: string
  name: string
  keys: string
}