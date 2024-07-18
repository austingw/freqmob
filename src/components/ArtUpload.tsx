import { Button, FileInput } from "@mantine/core";
import { IconFileUpload } from "@tabler/icons-react";
import { useState } from "react";

const ArtUpload = ({
  addFile,
}: {
  addFile: (type: "audioFile" | "imageFile", file: File) => void;
}) => {
  const icon = <IconFileUpload />;
  return (
    <FileInput
      leftSection={icon}
      label={"Track Art"}
      placeholder={"Add track art here"}
      accept="image/png,image/jpeg,image/jpg"
      onChange={(file) => {
        if (file) {
          addFile("imageFile", file);
        }
      }}
    />
  );
};

export default ArtUpload;
