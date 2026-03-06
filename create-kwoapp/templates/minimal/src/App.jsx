import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return <div style={{ padding: 20 }}><h1>首页</h1><Link to="/about">关于</Link></div>
}
function About() {
  return <div style={{ padding: 20 }}><h1>关于</h1><Link to="/">返回</Link></div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}
