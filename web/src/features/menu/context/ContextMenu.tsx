import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import ScaleFade from '../../../transitions/ScaleFade';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    left: '3%',
    width: 300,
    maxHeight: 'calc(9 * 60px + 80px)',
    backgroundColor: 'var(--ox-bg-primary)',
    padding: 0,
    borderRadius: 'var(--ox-radius-lg)',
    border: '1px solid var(--ox-border)',
    boxShadow: 'var(--ox-shadow)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid var(--ox-border)',
    backgroundColor: 'var(--ox-bg-secondary)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  titleText: {
    color: 'var(--ox-text-primary)',
    fontSize: 14,
    fontWeight: 600,
    '& p': {
      margin: 0,
    },
  },
  buttonsContainer: {
    maxHeight: 'calc(9 * 60px)',
    overflowY: 'auto',
    overflowX: 'visible',
    padding: 12,
    borderBottomLeftRadius: 'var(--ox-radius-lg)',
    borderBottomRightRadius: 'var(--ox-radius-lg)',
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2,
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 2,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
  buttonsFlexWrapper: {
    gap: 6,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <ScaleFade visible={visible}>
      <Box className={classes.container}>
        <Box className={classes.header}>
          <Box className={classes.headerLeft}>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={12} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <Text className={classes.titleText}>
              <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
            </Text>
          </Box>
          <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={14} handleClick={closeContext} />
        </Box>
        <Box className={classes.buttonsContainer}>
          <Stack className={classes.buttonsFlexWrapper}>
            {Object.entries(contextMenu.options).map((option, index) => (
              <ContextButton option={option} key={`context-item-${index}`} />
            ))}
          </Stack>
        </Box>
      </Box>
    </ScaleFade>
  );
};

export default ContextMenu;
