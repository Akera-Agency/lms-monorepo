import { type NavigationLink } from '../types/navigation';

// Utility to group navigation links by label
export const groupLinksByLabel = (links: NavigationLink[]) => {
  const groupedLinks: Record<string, NavigationLink[]> = {};

  links.forEach((link) => {
    if (link.label) {
      // If the link itself has a label, create a new group and add it as a container
      groupedLinks[link.label] = link.items || [];
    } else if (link.title) {
      // If the link has no label but has a title, add it to "Ungrouped" section
      if (!groupedLinks['Ungrouped']) {
        groupedLinks['Ungrouped'] = [];
      }
      groupedLinks['Ungrouped'].push(link);
    }
  });

  return groupedLinks;
};
