import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, createStyles, keyframes, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    width: 280,
    height: 'fit-content',
    backgroundColor: 'var(--ox-bg-primary)',
    color: 'var(--ox-text-primary)',
    padding: '12px 14px',
    borderRadius: 'var(--ox-radius)',
    border: '1px solid var(--ox-border)',
    fontFamily: 'Roboto',
    boxShadow: 'var(--ox-shadow)',
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 1.3,
    color: 'var(--ox-text-primary)',
  },
  description: {
    fontSize: 12,
    color: 'var(--ox-text-secondary)',
    fontFamily: 'Roboto',
    lineHeight: 1.4,
    marginTop: 2,
  },
  descriptionOnly: {
    fontSize: 13,
    color: 'var(--ox-text-secondary)',
    fontFamily: 'Roboto',
    lineHeight: 1.4,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 6,
    flexShrink: 0,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: 'var(--theme-accent)',
    borderRadius: '0 2px 0 0',
  },
}));

const createAnimation = (from: string, to: string, visible: boolean) => keyframes({
  from: {
    opacity: visible ? 0 : 1,
    transform: `translate${from}`,
  },
  to: {
    opacity: visible ? 1 : 0,
    transform: `translate${to}`,
  },
});

const getAnimation = (visible: boolean, position: string) => {
  const animationOptions = visible ? '0.2s ease-out forwards' : '0.4s ease-in forwards'
  let animation: { from: string; to: string };

  if (visible) {
    animation = position.includes('bottom') ? { from: 'Y(30px)', to: 'Y(0px)' } : { from: 'Y(-30px)', to:'Y(0px)' };
  } else {
    if (position.includes('right')) {
      animation = { from: 'X(0px)', to: 'X(100%)' }
    } else if (position.includes('left')) {
      animation = { from: 'X(0px)', to: 'X(-100%)' };
    } else if (position === 'top-center') {
      animation = { from: 'Y(0px)', to: 'Y(-100%)' };
    } else if (position === 'bottom-center') {
      animation = { from: 'Y(0px)', to: 'Y(100%)' };
    } else {
      animation = { from: 'X(0px)', to: 'X(100%)' };
    }
  }

  return `${createAnimation(animation.from, animation.to, visible)} ${animationOptions}`
};

const durationProgress = keyframes({
  '0%': { width: '100%' },
  '100%': { width: '0%' },
});

const getIconColor = (type?: string, customColor?: string): string => {
  if (customColor) return tinycolor(customColor).toRgbString();
  
  switch (type) {
    case 'error':
      return '#f44336';
    case 'success':
      return '#4caf50';
    case 'warning':
      return '#ff9800';
    default:
      return 'var(--theme-accent)';
  }
};

const getIconBgColor = (type?: string): string => {
  switch (type) {
    case 'error':
      return 'rgba(244, 67, 54, 0.15)';
    case 'success':
      return 'rgba(76, 175, 80, 0.15)';
    case 'warning':
      return 'rgba(255, 152, 0, 0.15)';
    default:
      return 'rgba(var(--theme-accent-rgb), 0.15)';
  }
};

const getIconBorderColor = (type?: string): string => {
  switch (type) {
    case 'error':
      return 'rgba(244, 67, 54, 0.3)';
    case 'success':
      return 'rgba(76, 175, 80, 0.3)';
    case 'warning':
      return 'rgba(255, 152, 0, 0.3)';
    default:
      return 'rgba(var(--theme-accent-rgb), 0.3)';
  }
};

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey(prevKey => prevKey + 1);

    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    const iconColor = getIconColor(data.type, data.iconColor);
    const iconBgColor = getIconBgColor(data.type);
    const iconBorderColor = getIconBorderColor(data.type);

    toast.custom(
      (t) => (
        <Box
          sx={{
            animation: getAnimation(t.visible, position),
            ...data.style,
          }}
          className={classes.container}
        >
          <Box sx={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {data.icon && (
              <Box 
                className={classes.iconContainer}
                sx={{
                  backgroundColor: iconBgColor,
                  border: `1px solid ${iconBorderColor}`,
                  alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'flex-start',
                }}
              >
                <LibIcon 
                  icon={data.icon} 
                  fixedWidth 
                  style={{ color: iconColor, fontSize: 14 }}
                  animation={data.iconAnimation} 
                />
              </Box>
            )}
            <Stack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <ReactMarkdown
                  components={MarkdownComponents}
                  className={`${!data.title ? classes.descriptionOnly : classes.description} description`}
                >
                  {data.description}
                </ReactMarkdown>
              )}
            </Stack>
          </Box>
          {data.showDuration && (
            <Box
              key={toastKey}
              className={classes.progressBar}
              sx={{
                animation: `${durationProgress} linear forwards`,
                animationDuration: `${duration}ms`,
              }}
            />
          )}
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
