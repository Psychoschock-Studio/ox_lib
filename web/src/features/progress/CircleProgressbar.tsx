import React from 'react';
import { Box, createStyles, keyframes, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const SEGMENT_COUNT = 12;

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '15%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: params.position === 'middle' ? 'center' : 'flex-end',
    paddingBottom: params.position === 'bottom' ? 40 : 0,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  circleContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentsWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  segment: {
    position: 'absolute',
    width: 10,
    height: 4,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    left: '50%',
    top: '50%',
    transformOrigin: 'center center',
    transition: 'all 0.15s ease',
    boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.35), 0 0 0 4px rgba(255, 255, 255, 0.05)',
  },
  segmentActive: {
    backgroundColor: 'var(--theme-accent)',
    boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.35), 0 0 0 4px rgba(255, 255, 255, 0.05), 0 0 8px rgba(var(--theme-accent-rgb), 0.5)',
  },
  value: {
    position: 'absolute',
    textAlign: 'center',
    fontFamily: 'Roboto Mono',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--theme-accent)',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--ox-text-primary)',
    fontFamily: 'Roboto',
    maxWidth: 140,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        if (newValue >= 100) {
          clearInterval(updateProgress);
          setTimeout(() => setVisible(false), 100);
        }
        return newValue;
      });
    }, onePercent);
  });

  const activeSegments = Math.floor((value / 100) * SEGMENT_COUNT);

  const getSegmentStyle = (index: number) => {
    const angle = (index / SEGMENT_COUNT) * 360 - 90;
    const radius = 30;
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;
    
    return {
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle + 90}deg)`,
    };
  };

  return (
    <>
      <Box className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.wrapper}>
            <Box className={classes.circleContainer}>
              <Box className={classes.segmentsWrapper}>
                {Array.from({ length: SEGMENT_COUNT }).map((_, index) => (
                  <Box
                    key={index}
                    className={`${classes.segment} ${index < activeSegments ? classes.segmentActive : ''}`}
                    style={getSegmentStyle(index)}
                  />
                ))}
              </Box>
              <Text className={classes.value}>{value}%</Text>
            </Box>
            {label && <Text className={classes.label}>{label}</Text>}
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default CircleProgressbar;
