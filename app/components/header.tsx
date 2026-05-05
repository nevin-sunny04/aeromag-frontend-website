import { Category } from '../utils/types';
import BottomBar from './header/bottombar';
import MiddleBar from './header/middlebar';
import TopBar from './header/topbar';
import Banner from './home/banner';

export default async function Header({
  categories,
  logo,
  magazineCat,
  social,
  advertisements,
}: {
  categories: Category[];
  logo: { image: string; alt_text: string }[];
  magazineCat: Category[];
  social: { icon: string; url: string }[];
  advertisements: { id: number; url: string; file: string }[];
}) {
  return (
    <header>
      <TopBar social={social} />
      <MiddleBar
        logo={logo?.[0]}
        ad={advertisements?.[0]}
      />
      <BottomBar
        category={categories}
        magazineCat={magazineCat}
      />
      <Banner data={[advertisements?.[1]]} />
    </header>
  );
}
