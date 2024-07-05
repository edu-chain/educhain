import { css } from '../styled-system/css';
import { center } from '../styled-system/patterns';

export default function Home() {
  return (
    <div className={center({ fontSize: "2xl", fontWeight: 'bold', bg: "gray" })}>
      <div>Hello 🐼!</div>
    </div>
  )
}