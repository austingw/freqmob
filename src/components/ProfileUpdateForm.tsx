import { Button, Group, Stack, TextInput } from "@mantine/core";
import ImageUpload from "./ImageUpload";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useAtomValue } from "jotai";
import { profileAtom } from "./FMAppShell";
import {
  IconBrandBandcamp,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconCheck,
  IconLink,
  IconX,
} from "@tabler/icons-react";
import generateFormData from "@/utils/generateFormData";
import { putProfile } from "@/app/actions/profileActions";
import { notifications } from "@mantine/notifications";

interface FormValues {
  imageFile: File | string;
  currentAvatar: string | null;
  website: string | null;
  spotify: string | null;
  soundcloud: string | null;
  bandcamp: string | null;
}

const schema = z.object({
  imageFile: z.instanceof(Blob).optional().nullable(),
  currentAvatar: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  spotify: z.string().optional().nullable(),
  soundcloud: z.string().optional().nullable(),
  bandcamp: z.string().optional().nullable(),
});

const ProfileUpdateForm = () => {
  const profileValue = useAtomValue(profileAtom);

  const form = useForm<FormValues>({
    initialValues: {
      imageFile: "",
      currentAvatar: profileValue?.avatar,
      website: profileValue?.website,
      spotify: profileValue?.spotify,
      soundcloud: profileValue?.soundcloud,
      bandcamp: profileValue?.bandcamp,
    },
    validate: zodResolver(schema),
  });
  const addFile = async (type: "audioFile" | "imageFile", file: File) => {
    form.setFieldValue(type, file);
  };

  return (
    <Stack>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          form.validate();
          const data = generateFormData(form.values);
          await putProfile(profileValue?.id, data)
            .catch((err) => {
              console.error(err);
              notifications.show({
                message: "Error updating profile",
                icon: <IconX />,
                autoClose: 3000,
              });
            })
            .then((res) => {
              if (res?.status === 201) {
                notifications.show({
                  message: "Profile successfully updated!",
                  icon: <IconCheck />,
                  autoClose: 3000,
                });
                form.reset();
                //close();
              } else {
                notifications.show({
                  message: "Failed to update, please try again",
                  icon: <IconX />,
                  autoClose: 3000,
                });
              }
            });
        }}
      >
        <ImageUpload addFile={addFile} />
        <TextInput
          label="Website"
          leftSection={<IconLink />}
          {...form.getInputProps("website")}
        />
        <TextInput
          label="Spotify"
          leftSection={<IconBrandSpotify />}
          {...form.getInputProps("spotify")}
        />
        <TextInput
          label="Soundcloud"
          leftSection={<IconBrandSoundcloud />}
          {...form.getInputProps("soundcloud")}
        />
        <TextInput
          label="Bandcamp"
          leftSection={<IconBrandBandcamp />}
          {...form.getInputProps("bandcamp")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
          <Button variant="light" onClick={close}>
            Cancel
          </Button>
        </Group>
      </form>
    </Stack>
  );
};

export default ProfileUpdateForm;
