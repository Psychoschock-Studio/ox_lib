import React, { useEffect, useState } from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const SEGMENT_COUNT = 24;

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '15%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: 0,
    position: 'absolute',
    paddingBottom: 40,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: 'Roboto',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
  },
  percentage: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--theme-accent)',
    fontFamily: 'Roboto Mono',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
  },
  segmentsContainer: {
    display: 'flex',
    gap: 2,
    padding: '6px 10px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  segment: {
    width: 10,
    height: 6,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transition: 'all 0.3s ease-out',
  },
}));

interface SegmentProps {
  isActive: boolean;
  isTransitioning: boolean;
  transitionProgress: number;
}

const Segment: React.FC<SegmentProps> = ({ isActive, isTransitioning, transitionProgress }) => {
  const opacity = isActive ? 1 : isTransitioning ? transitionProgress : 0;
  const glowIntensity = isActive ? 0.5 : isTransitioning ? transitionProgress * 0.5 : 0;
  
  return (
    <Box
      sx={{
        width: 10,
        height: 6,
        borderRadius: 1,
        backgroundColor: isActive || isTransitioning 
          ? `rgba(var(--theme-accent-rgb), ${0.3 + opacity * 0.7})` 
          : 'rgba(255, 255, 255, 0.12)',
        boxShadow: (isActive || isTransitioning) 
          ? `0 0 ${6 + glowIntensity * 4}px rgba(var(--theme-accent-rgb), ${glowIntensity})` 
          : 'none',
        transition: 'all 0.25s ease-out',
      }}
    />
  );
};

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(0);

  useNuiEvent('progressCancel', () => {
    setVisible(false);
    setProgress(0);
  });

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
    setStartTime(Date.now());
  });

  useEffect(() => {
    if (!visible || duration <= 0) return;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
          fetchNui('progressComplete');
        }, 100);
      }
    }, 16);

    return () => clearInterval(intervalId);
  }, [visible, duration, startTime]);

  const exactProgress = (progress / 100) * SEGMENT_COUNT;
  const activeSegments = Math.floor(exactProgress);
  const transitionProgress = exactProgress - activeSegments;

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box className={classes.container}>
            <Box className={classes.header}>
              <Text className={classes.label}>{label}</Text>
              <Text className={classes.percentage}>{Math.round(progress)}%</Text>
            </Box>
            <Box className={classes.segmentsContainer}>
              {Array.from({ length: SEGMENT_COUNT }).map((_, index) => (
                <Segment
                  key={index}
                  isActive={index < activeSegments}
                  isTransitioning={index === activeSegments}
                  transitionProgress={transitionProgress}
                />
              ))}
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;
