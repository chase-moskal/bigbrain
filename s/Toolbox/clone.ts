
export default function clone(value: any) {
  return JSON.parse(JSON.stringify(value))
}
