import Part1 from "./Part1"
import Part2 from "./Part2"
import Part3 from "./Part3"

interface Chapter2Props {
  container: React.RefObject<HTMLDivElement>
}

const Chapter2 = ({ container }: Chapter2Props) => {
  return (
    <group position={[0, 0, 0.35]}>
      <Part1 container={container} />
      <Part2 container={container} />
      <Part3 container={container} />
    </group>
  )
}

export default Chapter2
