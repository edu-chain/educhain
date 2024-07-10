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
  console.log(pathname);

  return (
    <div className={hstack({flexGrow: '1', h: 'full'})}>
      <ul className={
        hstack({
          h: 'full',
        })
      }>
        <li className={linkStyle(pathname === '/admin')}><Link href='/admin'>School</Link></li>
        <li className={linkStyle(pathname.startsWith('/course/'))}><Link href='/course/1'>Courses</Link></li>
        <li className={linkStyle(pathname.startsWith('/student'))}><Link href='/student'>Student</Link></li>
      </ul>
    </div>
  );
}