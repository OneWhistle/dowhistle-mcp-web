import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Remove preboot loader after first paint
requestAnimationFrame(() => {
  const pre = document.getElementById('preboot-loader');
  if (pre) {
    pre.style.transition = 'opacity .25s ease';
    pre.style.opacity = '0';
    setTimeout(() => pre.remove(), 250);
  }
});
