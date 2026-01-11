import { Box, Button, createStyles, Group, Modal } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: 'var(--ox-bg-secondary)',
    borderBottom: '1px solid var(--ox-border)',
    padding: '12px 16px',
    borderTopLeftRadius: 'var(--ox-radius-lg)',
    borderTopRightRadius: 'var(--ox-radius-lg)',
  },
  title: {
    color: 'var(--ox-text-primary)',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'Roboto',
    '& p': {
      margin: 0,
    },
  },
  body: {
    padding: '16px',
  },
  content: {
    color: 'var(--ox-text-secondary)',
    fontSize: 13,
    lineHeight: 1.5,
    fontFamily: 'Roboto',
    '& p': {
      margin: 0,
    },
    '& img': {
      maxWidth: '100%',
      borderRadius: 'var(--ox-radius)',
    },
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid var(--ox-border)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomLeftRadius: 'var(--ox-radius-lg)',
    borderBottomRightRadius: 'var(--ox-radius-lg)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--ox-border)',
    color: 'var(--ox-text-secondary)',
    padding: '8px 16px',
    borderRadius: 'var(--ox-radius)',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'var(--ox-border-hover)',
      color: 'var(--ox-text-primary)',
    },
  },
  confirmButton: {
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.2)',
    border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
    color: 'var(--theme-accent)',
    padding: '8px 16px',
    borderRadius: 'var(--ox-radius)',
    fontSize: 12,
    fontWeight: 500,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(var(--theme-accent-rgb), 0.3)',
      borderColor: 'rgba(var(--theme-accent-rgb), 0.5)',
    },
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  const hasLongContent = dialogData.content && dialogData.content.length > 200;

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || (hasLongContent ? 'md' : 'xs')}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        overlayColor="rgba(0, 0, 0, 0.8)"
        exitTransitionDuration={150}
        transition="fade"
        padding={0}
        styles={{
          modal: {
            backgroundColor: 'var(--ox-bg-primary)',
            border: '1px solid var(--ox-border)',
            borderRadius: 'var(--ox-radius-lg)',
            boxShadow: 'var(--ox-shadow)',
            overflow: 'hidden',
            minWidth: 280,
            maxWidth: 450,
            width: 'fit-content',
          },
        }}
      >
        <Box className={classes.header}>
          <Box className={classes.title}>
            <ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>
          </Box>
        </Box>
        <Box className={classes.body}>
          <Box className={classes.content}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...MarkdownComponents,
                img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
              }}
            >
              {dialogData.content}
            </ReactMarkdown>
          </Box>
        </Box>
        <Box className={classes.footer}>
          <Group position="right" spacing={8}>
            {dialogData.cancel && (
              <Button 
                className={classes.cancelButton}
                onClick={() => closeAlert('cancel')}
              >
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              className={classes.confirmButton}
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
};

export default AlertDialog;
