
import {observable, IObservableObject} from "mobx"

export enum Input {

  // Coming soon:
  //   Q, W, E, R, T, Y, U, I, O, P, BracketLeft, BracketRight
  //   A, S, D, F, G, H, J, K, L, Semicolon, Quote
  //   Z, X, C, V, B, N, M, Comma, Period, Slash

  One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Zero,
  Shift, Ctrl, Alt, Space,
  W, A, S, D, Q, E
}

export const inputKeyCodeRelationships: {
  input: Input
  code: number
}[] = [
  {input: Input.W,     code: 87},
  {input: Input.A,     code: 65},
  {input: Input.S,     code: 83},
  {input: Input.D,     code: 68},

  {input: Input.Q,     code: 81},
  {input: Input.E,     code: 69},

  {input: Input.Shift, code: 16},
  {input: Input.Ctrl,  code: 17},
  {input: Input.Alt,   code: 18},
  {input: Input.Space, code: 32},

  {input: Input.One,   code: 49},
  {input: Input.Two,   code: 50},
  {input: Input.Three, code: 51},
  {input: Input.Four,  code: 52},
  {input: Input.Five,  code: 53},
  {input: Input.Six,   code: 54},
  {input: Input.Seven, code: 55},
  {input: Input.Eight, code: 56},
  {input: Input.Nine,  code: 57},
  {input: Input.Zero,  code: 48}
]

export interface InputReport {
  input: Input,
  status: boolean
}

export type WatcherBindings = { [alias: string]: Input[] }
export type WatcherStatus = { [alias: string]: boolean }

export default class Watcher<Bindings extends WatcherBindings = WatcherBindings, Status extends WatcherStatus = WatcherStatus> {
  private readonly bindings: Bindings
  readonly status: Status

  constructor({bindings}: {bindings: Bindings}) {
    this.bindings = bindings

    const status = {}
    for (const alias of Object.keys(bindings))
      status[alias] = null
    this.status = <Status & IObservableObject>observable(status)

    Object.keys(bindings).forEach(alias => {
      const inputs = bindings[alias]
      for (const input of inputs) {
        if (!(input in inputKeyCodeRelationships)) throw `Unknown input: ${input}`
        this.status[alias] = null
      }
    })

    this.start()
  }

  start() {
    addEventListener("keydown", event => this.keydown(event))
    addEventListener("keyup", event => this.keyup(event))
  }

  stop() {
    removeEventListener("keydown", (event: KeyboardEvent) => this.keydown(event))
    removeEventListener("keyup", (event: KeyboardEvent) => this.keyup(event))
  }

  private getInputByKeyCode(keyCode: number): Input {
    const relation = inputKeyCodeRelationships.find(relationship => relationship.code === keyCode)
    return relation ? relation.input : null
  }

  private getAliasesForInput(input: Input): string[] {
    return Object.keys(this.bindings)
      .filter(alias => this.bindings[alias].some(i => i === input))
  }

  private keydown = (event: KeyboardEvent) => {
    const struckInput = this.getInputByKeyCode(event.keyCode)
    if (struckInput === null) return
    for (const struckAlias of this.getAliasesForInput(struckInput))
      this.status[struckAlias] = true
  }

  private keyup = (event: KeyboardEvent) => {
    const releasedInput = this.getInputByKeyCode(event.keyCode)
    if (releasedInput === null) return
    for (const releasedAlias of this.getAliasesForInput(releasedInput))
      this.status[releasedAlias] = false
  }
}
