import { FileInput } from "@mantine/core";
import { IconFileUpload } from "@tabler/icons-react";

const ImageUpload = ({
  addFile,
  title,
}: {
  addFile: (type: "audioFile" | "imageFile", file: File) => void;
  title: string;
}) => {
  const icon = <IconFileUpload />;
  return (
    <FileInput
      w={"100%"}
      m="auto"
      leftSection={icon}
      label={title}
      placeholder={"Add .png or .jpg here"}
      accept="image/png,image/jpeg,image/jpg"
      onChange={(file) => {
        if (file) {
          addFile("imageFile", file);
        }
      }}
    />
  );
};

export default ImageUpload;
