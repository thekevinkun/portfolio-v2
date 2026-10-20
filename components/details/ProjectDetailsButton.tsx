"use client";

import { Button } from "@/components/ui";
import { useProjectDetails } from "@/lib/details/details-context";

interface ProjectDetailsButtonProps {
  slug: string;
  title: string;
}

// The Details button on a project card (D114). Callers show it only when the
// project has details.
const ProjectDetailsButton = ({ slug, title }: ProjectDetailsButtonProps) => {
  const { open } = useProjectDetails();

  return (
    <Button
      variant="secondary"
      size="sm"
      aria-haspopup="dialog"
      aria-label={`Details: ${title}`}
      onClick={() => open(slug)}
    >
      Details
    </Button>
  );
};

export default ProjectDetailsButton;
