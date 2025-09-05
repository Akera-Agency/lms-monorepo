import { Link } from '@tanstack/react-router';

type NavLinkListOption = {
  title: string;
  href: string;
};

type NavLinkListProps = {
  links: NavLinkListOption[];
  containerStyle?: string;
  linkStyle?: string;
  openLink: string;
};

const NavLinkList = ({ links, containerStyle, linkStyle, openLink }: NavLinkListProps) => {
  return (
    <div className={containerStyle}>
      {links.map((link, index) => (
        <div
          key={index}
          className={linkStyle}
        >
          <Link to={`${link.href}`} className={openLink === link.href ? "text-[#F3562E]" : "font-normal"}>{link.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default NavLinkList;
