"use client";

import { parseLabel } from "@/utils/parseLabel";
import { Button, Menu } from "@mantine/core";
import { IconCaretDown, IconCaretUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const SortMenu = ({
  sortValue,
  setSortValue,
}: {
  sortValue: SortOptions;
  setSortValue: (val: SortOptions) => void;
}) => {
  const [opened, setOpened] = useState(false);
  const [menuTitle, setMenuTitle] = useState(parseLabel(sortValue));

  useEffect(() => {
    setMenuTitle(parseLabel(sortValue));
  }, [sortValue]);

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      trigger="click-hover"
      position="bottom-start"
      withArrow
      arrowPosition="center"
      openDelay={100}
      closeDelay={500}
    >
      <Menu.Target>
        <Button variant="transparent" px={8}>
          {menuTitle}{" "}
          {opened ? <IconCaretUp size={16} /> : <IconCaretDown size={16} />}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>
          <Button
            p={0}
            variant="transparent"
            onClick={() => setSortValue("new")}
          >
            Latest
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            p={0}
            variant="transparent"
            onClick={() => setSortValue("likes")}
          >
            Top
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            p={0}
            variant="transparent"
            onClick={() => setSortValue("comments")}
          >
            Comments
          </Button>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default SortMenu;
