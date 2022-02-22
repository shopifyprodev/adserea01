import ActiveLink from './Activelink';
import Logoimg from '../public/img/logo.svg';
import Image from 'next/image'


export default function Header() {

  return (
      <header className='shadow-sm sticky-top bg-white'>
      <div className="d-flex flex-column flex-md-row align-items-center py-3 container px-0">
        <a href="/" className="d-flex align-items-center text-dark text-decoration-none tg-logo">
          <Image className='' loader={({src})=> src} src={Logoimg} alt="" height={45} />
        </a>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto me-3">
          <ActiveLink activeClassName="active" href="/">
          <a className="me-3 py-2 text-decoration-none nav-link">Dashboard</a>
          </ActiveLink>
         
        </nav>
      </div>
    </header>
    );
}
