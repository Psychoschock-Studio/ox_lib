import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--ox-border)',
    borderRadius: 'var(--ox-radius)',
    padding: '12px 14px',
    scrollMargin: 8,
    transition: 'all 0.2s',
    cursor: 'pointer',
    '&:focus': {
      backgroundColor: 'rgba(var(--theme-accent-rgb), 0.15)',
      borderColor: 'rgba(var(--theme-accent-rgb), 0.3)',
      outline: 'none',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'var(--ox-border-hover)',
    },
  },
  iconImage: {
    maxWidth: 24,
    borderRadius: 4,
  },
  buttonWrapper: {
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.15)',
    border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
    borderRadius: 6,
    flexShrink: 0,
  },
  icon: {
    fontSize: 14,
    color: params.iconColor || 'var(--theme-accent)',
  },
  label: {
    color: 'var(--ox-text-muted)',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: '0.5px',
  },
  valueText: {
    color: 'var(--ox-text-primary)',
    fontSize: 13,
    fontWeight: 500,
  },
  chevronIcon: {
    fontSize: 10,
    color: 'var(--ox-text-muted)',
  },
  scrollIndexValue: {
    color: 'var(--ox-text-secondary)',
    fontSize: 12,
    fontWeight: 500,
  },
  progressStack: {
    width: '100%',
  },
  progressLabel: {
    fontSize: 13,
    color: 'var(--ox-text-primary)',
    marginBottom: 6,
  },
  progress: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    height: 4,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={12} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={2} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text className={classes.valueText}>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={6} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className={classes.valueText}>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color="var(--theme-accent)"
              size={4}
              radius={4}
              className={classes.progress}
            />
          </Stack>
        ) : (
          <Text className={classes.valueText}>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
