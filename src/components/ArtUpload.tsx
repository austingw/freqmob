import { FileInput } from "@mantine/core";
import { IconFileUpload } from "@tabler/icons-react";

const ArtUpload = () => {
  const icon = <IconFileUpload />;
  return (
    <FileInput
      leftSection={icon}
      label={"Track Art"}
      placeholder={"Add track art here"}
    />
  );
};

export default ArtUpload;
