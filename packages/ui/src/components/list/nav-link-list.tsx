import { Link } from "@tanstack/react-router";

type NavLinkListOption = {
    title: string;
    href: string
};

type NavLinkListProps = {
    links: NavLinkListOption[];
};

const NavLinkList = ({
    links
}: NavLinkListProps) => {
return (
    <div className="flex flex-row">
        {links.map((link) => (
        <div className="hover:bg-neutral-400/20 px-2.5 py-1.5 rounded-lg ">
            <Link to={`${link.href}`}>{link.title}</Link>
        </div>
    ))}
    </div>
);
};

export default NavLinkList;
