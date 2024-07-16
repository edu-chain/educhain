import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';

const linkStyle = (isActive: boolean) => css({
  _hover: {
    textDecoration: 'underline',
  },
  h: 'full',
  fontWeight: isActive ? 'bold' : 'normal',
  alignContent: 'center',
  p: '2',
});

export function NavBar() {
  const pathname = usePathname();

  return (
    <div className={hstack({flexGrow: '1', h: 'full'})}>
      <ul className={
        hstack({
          h: 'full',
        })
      }>
        <li className={linkStyle(pathname === '/school')}><Link href='/school'>School</Link></li>
        <li className={linkStyle(pathname.startsWith('/courses'))}><Link href='/courses'>Courses</Link></li>
        <li className={linkStyle(pathname.startsWith('/student'))}><Link href='/student'>Student</Link></li>
      </ul>
    </div>
  );
}