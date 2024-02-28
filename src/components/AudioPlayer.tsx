"use client";

import formatTime from "@/utils/formatTime";
import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Group,
  LoadingOverlay,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import React from "react";
import {
  IconArrowBackUp,
  IconMultiplier05x,
  IconMultiplier15x,
  IconMultiplier1x,
  IconMultiplier2x,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
} from "@tabler/icons-react";

interface AudioPlayerProps {
  url: string;
  art: string;
}

const AudioPlayer = ({ url, art }: AudioPlayerProps) => {
  const theme = useMantineTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    const createWaveform = async () => {
      if (waveformRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          mediaControls: false,
          waveColor: "lightgray",
          progressColor: "#F15BB5",
          cursorColor: "#F15BB5",
          barWidth: 5,
          barRadius: 5,
          height: 100,
          normalize: true,
        });

        await wavesurferRef.current.load(url);

        return wavesurferRef.current;
      }
    };

    createWaveform()
      .then((wavesurfer) => {
        wavesurfer?.on("decode", () => {
          setDuration(Number(wavesurfer?.getDuration()));
        });
        wavesurfer?.on("finish", handleAudioEnd);
      })
      .catch((err) => console.error(err));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  //Update current time outside of useEffect to prevent re-renders
  wavesurferRef.current?.on("audioprocess", () => {
    setCurrentTime(Number(wavesurferRef.current?.getCurrentTime()));
  });

  const handleSpeedChange = () => {
    switch (speed) {
      case 1:
        setSpeed(1.5);
        wavesurferRef.current?.setPlaybackRate(1.5, false);
        break;
      case 1.5:
        setSpeed(2);
        wavesurferRef.current?.setPlaybackRate(2, false);
        break;
      case 2:
        setSpeed(0.75);
        wavesurferRef.current?.setPlaybackRate(0.75, false);
        break;
      default:
        setSpeed(1);
        wavesurferRef.current?.setPlaybackRate(1);
    }
  };

  return (
    <>
      <Card withBorder pt={20} pb={10} px={20} m={10} w={"100%"}>
        <LoadingOverlay visible={!wavesurferRef.current} />
        <Flex
          direction={"row"}
          align={"center"}
          justify={"flex-start"}
          gap={10}
          pb={10}
        >
          {
            //below is placeholder for optional track art
          }
          <Box
            style={{
              minWidth: 140,
              minHeight: 140,
              backgroundColor: "gray",
              borderRadius: 10,
            }}
          />

          <div
            style={{
              width: "100%",
            }}
            id="waveform"
            ref={waveformRef}
            onClick={() => {
              setCurrentTime(Number(wavesurferRef.current?.getCurrentTime()));
            }}
          />
        </Flex>
        <Flex justify={"space-between"} align={"center"}>
          <Group>
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                wavesurferRef.current
                  ?.playPause()
                  .catch((err) => console.error(err));
                togglePlay();
              }}
            >
              {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
            </ActionIcon>
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                wavesurferRef.current?.stop();
                setIsPlaying(false);
                setCurrentTime(0);
              }}
            >
              <IconPlayerStop />
            </ActionIcon>
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                wavesurferRef.current?.skip(-15);
                setCurrentTime(Number(wavesurferRef.current?.getCurrentTime()));
              }}
            >
              <IconArrowBackUp />
            </ActionIcon>
            <ActionIcon
              color={theme.primaryColor}
              onClick={() => {
                handleSpeedChange();
              }}
            >
              {speed === 1 ? (
                <IconMultiplier1x />
              ) : speed === 1.5 ? (
                <IconMultiplier15x />
              ) : speed === 2 ? (
                <IconMultiplier2x />
              ) : (
                <IconMultiplier05x />
              )}
            </ActionIcon>
          </Group>
          <Text size="sm" c="dimmed">
            {formatTime(currentTime) || 0} / {formatTime(duration) || 0}
          </Text>
        </Flex>
      </Card>
    </>
  );
};

export default AudioPlayer;
