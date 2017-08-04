
import {observable, IObservableObject} from "mobx"

export enum Input {
  Esc,

  Backtick, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Zero, Minus, Plus, Backspace,
  Tab, Q, W, E, R, T, Y, U, I, O, P, BracketLeft, BracketRight, Backslash,
  CapsLock, A, S, D, F, G, H, J, K, L, Semicolon, Quote, Enter,
  Shift, Z, X, C, V, B, N, M, Comma, Period, Slash, ShiftRight,
  Ctrl, Super, Alt, Space, AltRight, SuperRight, CtrlRight,

  Insert, Home, PageUp,
  Delete, End, PageDown,

  ArrowUp, ArrowDown, ArrowLeft, ArrowRight
}

export interface InputKeycodeRelation {
  input: Input
  code: number
}

export const inputKeycodeRelations: InputKeycodeRelation[] = [
  {input: Input.W, code: 87},
  {input: Input.A, code: 65},
  {input: Input.S, code: 83},
  {input: Input.D, code: 68},

  {input: Input.Q, code: 81},
  {input: Input.E, code: 69},
  {input: Input.Z, code: 90},
  {input: Input.X, code: 88},
  {input: Input.C, code: 67},

  {input: Input.Shift, code: 16},
  {input: Input.Ctrl,  code: 17},
  {input: Input.Alt,   code: 18},
  {input: Input.Space, code: 32},

  {input: Input.ArrowLeft,  code: 37},
  {input: Input.ArrowUp,    code: 38},
  {input: Input.ArrowRight, code: 39},
  {input: Input.ArrowDown,  code: 40},

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

export type Bindings = { [alias: string]: Input[] }
export type Status = { [alias: string]: boolean }

export interface WatcherOptions<gBindings extends Bindings = Bindings> {
  eventTarget: EventTarget
  bindings: gBindings
  relations?: InputKeycodeRelation[]
}

export default class Watcher<gBindings extends Bindings = Bindings, gStatus extends Status = Status> {
  private readonly eventTarget: EventTarget
  private readonly bindings: gBindings
  private readonly relations: InputKeycodeRelation[]

  readonly status: gStatus

  constructor({eventTarget, bindings, relations = inputKeycodeRelations}: WatcherOptions<gBindings>) {
    this.eventTarget = eventTarget
    this.bindings = bindings
    this.relations = relations

    const status = {}
    for (const alias of Object.keys(bindings))
      status[alias] = null
    this.status = <gStatus & IObservableObject>observable(status)

    // initialize status for each binding, throw error on unknown input
    Object.keys(bindings).forEach(alias => {
      const inputs = bindings[alias]
      for (const input of inputs)
        if (!this.relations.find(relation => relation.input === input)) throw `Unknown input: ${input}`
      this.status[alias] = null
    })

    this.start()
  }

  start() {
    this.eventTarget.addEventListener("keydown", (event: KeyboardEvent) => this.keydown(event))
    this.eventTarget.addEventListener("keyup", (event: KeyboardEvent) => this.keyup(event))
  }

  stop() {
    this.eventTarget.removeEventListener("keydown", (event: KeyboardEvent) => this.keydown(event))
    this.eventTarget.removeEventListener("keyup", (event: KeyboardEvent) => this.keyup(event))
  }

  private getInputByKeycode(code: number): Input {
    const relation = inputKeycodeRelations.find(relationship => relationship.code === code)
    return relation ? relation.input : null
  }

  private getAliasesForInput(input: Input): string[] {
    return Object.keys(this.bindings)
      .filter(alias => this.bindings[alias].some(i => i === input))
  }

  private keydown = (event: KeyboardEvent) => {
    const struckInput = this.getInputByKeycode(event.keyCode)
    if (struckInput === null) return
    for (const struckAlias of this.getAliasesForInput(struckInput))
      this.status[struckAlias] = true
    event.preventDefault()
    event.stopPropagation()
  }

  private keyup = (event: KeyboardEvent) => {
    const releasedInput = this.getInputByKeycode(event.keyCode)
    if (releasedInput === null) return
    for (const releasedAlias of this.getAliasesForInput(releasedInput))
      this.status[releasedAlias] = false
    event.preventDefault()
    event.stopPropagation()
  }
}
