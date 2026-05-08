import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import NewBill from '@/pages/NewBill';
import SplitMode from '@/pages/SplitMode';
import Result from '@/pages/Result';
import History from '@/pages/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo" element={<NewBill />} />
        <Route path="/novo/dividir" element={<SplitMode />} />
        <Route path="/role/:id" element={<Result />} />
        <Route path="/historico" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
