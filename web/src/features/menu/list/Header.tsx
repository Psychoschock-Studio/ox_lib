import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: 'var(--ox-radius-lg)',
    borderTopRightRadius: 'var(--ox-radius-lg)',
    backgroundColor: 'var(--ox-bg-secondary)',
    borderBottom: '1px solid var(--ox-border)',
    height: 56,
    width: 340,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 16px',
  },
  heading: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontWeight: 600,
    color: 'var(--ox-text-primary)',
    letterSpacing: '1px',
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
