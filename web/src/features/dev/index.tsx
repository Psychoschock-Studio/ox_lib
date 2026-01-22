import { ActionIcon, Button, Divider, Drawer, Stack, Tooltip, createStyles } from '@mantine/core';
import { debugAlert } from './debug/alert';
import { debugContext } from './debug/context';
import { debugInput } from './debug/input';
import { debugMenu } from './debug/menu';
import { debugCustomNotification } from './debug/notification';
import { debugCircleProgressbar, debugProgressbar } from './debug/progress';
import { debugTextUI, debugTextUIHold } from './debug/textui';
import { debugSkillCheck } from './debug/skillcheck';
import { useState } from 'react';
import { debugRadial } from './debug/radial';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  drawer: {
    backgroundColor: '#1f1f1f',
    color: '#c1c2c5',
  },
  header: {
    backgroundColor: '#1f1f1f',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#c1c2c5',
  },
  title: {
    color: '#c1c2c5',
    fontWeight: 600,
  },
  closeButton: {
    color: 'rgba(255, 255, 255, 0.6)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
  button: {
    backgroundColor: '#333335',
    border: 'none',
    color: '#c1c2c5',
    fontWeight: 500,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#33343F',
      color: '#fff',
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  divider: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    backgroundColor: '#333335',
    border: 'none',
    color: 'var(--theme-accent)',
    '&:hover': {
      backgroundColor: '#33343F',
    },
  },
}));

const Dev: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();

  return (
    <>
      <Tooltip label="Developer drawer" position="bottom">
        <ActionIcon
          onClick={() => setOpened(true)}
          radius="xl"
          variant="filled"
          className={classes.actionButton}
          sx={{ position: 'absolute', bottom: 0, right: 0, width: 50, height: 50 }}
          size="xl"
          mr={50}
          mb={50}
        >
          <LibIcon icon="wrench" fontSize={24} />
        </ActionIcon>
      </Tooltip>

      <Drawer
        position="left"
        onClose={() => setOpened(false)}
        opened={opened}
        title="Developer drawer"
        padding="xl"
        classNames={{
          drawer: classes.drawer,
          header: classes.header,
          title: classes.title,
          closeButton: classes.closeButton,
        }}
      >
        <Stack>
          <Divider className={classes.divider} />
          <Button className={classes.button} fullWidth onClick={() => debugInput()}>
            Open input dialog
          </Button>
          <Button className={classes.button} fullWidth onClick={() => debugAlert()}>
            Open alert dialog
          </Button>
          <Divider className={classes.divider} />
          <Button className={classes.button} fullWidth onClick={() => debugContext()}>
            Open context menu
          </Button>
          <Button className={classes.button} fullWidth onClick={() => debugMenu()}>
            Open list menu
          </Button>
          <Button className={classes.button} fullWidth onClick={() => debugRadial()}>
            Open radial menu
          </Button>
          <Divider className={classes.divider} />
          <Button className={classes.button} fullWidth onClick={() => debugCustomNotification()}>
            Send notification
          </Button>
          <Divider className={classes.divider} />
          <Button className={classes.button} fullWidth onClick={() => debugProgressbar()}>
            Activate progress bar
          </Button>
          <Button className={classes.button} fullWidth onClick={() => debugCircleProgressbar()}>
            Activate progress circle
          </Button>
          <Divider className={classes.divider} />
          <Button className={classes.button} fullWidth onClick={() => debugTextUI()}>
            Show TextUI
          </Button>
          <Button className={classes.button} fullWidth onClick={() => debugTextUIHold()}>
            Show TextUI (Hold Demo)
          </Button>
          <Divider className={classes.divider} />
          <Button className={classes.button} fullWidth onClick={() => debugSkillCheck()}>
            Run skill check
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default Dev;
