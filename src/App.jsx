
import './App.css'
import Header from './components/Header'
import Home from './pages/Home'
import Items from './pages/Items'
import Customers from './pages/Customers'
import Invoices from './pages/Invoices'
import { Routes, Route } from 'react-router-dom'
import CreateInvoice from './pages/CreateInvoice'
import ViewInvoice from './pages/InvoicesView'

function App() {
 

  return (
    <>
     <Header/>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/new" element={<CreateInvoice />} />
        <Route path="/invoices/:id" element={<ViewInvoice />} />
      </Routes>
    </>
  )
}

export default App
