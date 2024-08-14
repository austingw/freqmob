"use client";

import { useRef, useState } from "react";
import { Text, Group, Button, rem, useMantineTheme } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconX,
  IconDownload,
  IconCheck,
} from "@tabler/icons-react";
import classes from "./FileUpload.module.css";

type FileUploadProps = {
  addFile: (type: "audioFile" | "imageFile", file: File) => void;
};

const FileUpload = ({ addFile }: FileUploadProps) => {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [validFile, setValidFile] = useState(false);

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        className={classes.dropzone}
        radius="md"
        accept={{ "audio/mp3": [".mp3"] }}
        onDrop={(files) => {
          addFile("audioFile", files[0]);
          setValidFile(true);
        }}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group justify="center">
            {validFile ? (
              <IconCheck
                style={{ width: rem(50), height: rem(50) }}
                stroke={1.5}
              />
            ) : (
              <>
                <Dropzone.Accept>
                  <IconDownload
                    style={{ width: rem(50), height: rem(50) }}
                    color={theme.colors.blue[6]}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{ width: rem(50), height: rem(50) }}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconCloudUpload
                    style={{ width: rem(50), height: rem(50) }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>
              </>
            )}
          </Group>

          {validFile ? (
            <Text ta="center" fw={700} fz="lg" c={theme.primaryColor}>
              {" "}
              File Ready!
            </Text>
          ) : (
            <>
              <Text ta="center" fw={700} fz="lg" c={theme.primaryColor}>
                <Dropzone.Accept>Drop file here</Dropzone.Accept>
                <Dropzone.Reject>
                  Audio file must be less than 30mb
                </Dropzone.Reject>
                <Dropzone.Idle>Upload audio</Dropzone.Idle>
              </Text>
              <Text ta="center" fz="sm" mt="xs" c="dimmed">
                Drag files here or use the button below to upload. We currently
                only accept <i>.mp3</i> files that are less than 30mb in size.
              </Text>
            </>
          )}
        </div>
      </Dropzone>

      <Button variant="filled" size="lg" onClick={() => openRef.current?.()}>
        Select files
      </Button>
    </div>
  );
};

export default FileUpload;
