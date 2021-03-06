import Logoimg from '../public/img/logo.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {

  return (
      <header className='shadow-sm sticky-top bg-white'>
      <div className="d-flex flex-column flex-md-row align-items-center py-3 container px-0">
        <Link href="/" className="d-flex align-items-center text-dark text-decoration-none tg-logo">
          <Image className='' loader={({src})=> src} src={Logoimg} alt="" height={45} />
        </Link>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto me-3">
          
          <Link className="me-3 py-2 text-decoration-none nav-link" href="/">Dashboard</Link>
         
         
        </nav>
      </div>
    </header>
    );
}
