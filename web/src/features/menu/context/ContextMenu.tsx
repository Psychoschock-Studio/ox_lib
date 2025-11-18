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
    top: '5%',
    left: '3%',
    width: 290,
    maxHeight: 'calc(9 * 60px + 80px)',
    backgroundColor: 'rgba(30, 30, 30, 0.92)',
    padding: '10px 12px 12px 12px',
    borderRadius: '3px',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    position: 'relative',
  },
  titleContainer: {
    flex: 1,
  },
  titleText: {
    color: 'rgba(220, 220, 220, 0.95)',
    fontSize: '14px',
    fontWeight: 400,
  },
  buttonsContainer: {
    maxHeight: 'calc(9 * 60px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: '4px',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(80, 80, 80, 0.4)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(100, 100, 100, 0.5)',
    },
  },
  buttonsFlexWrapper: {
    gap: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  backButton: {
    marginRight: '8px',
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

  // Hides the context menu on ESC
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
          <Flex align="center">
            {contextMenu.menu && (
              <Box className={classes.backButton}>
                <HeaderButton icon="chevron-left" iconSize={14} handleClick={() => openMenu(contextMenu.menu)} />
              </Box>
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
            </Box>
          </Flex>
          <Box className={classes.closeButton}>
            <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={16} handleClick={closeContext} />
          </Box>
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
