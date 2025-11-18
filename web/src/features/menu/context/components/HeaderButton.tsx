import { Button, createStyles } from '@mantine/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
  button: {
    borderRadius: '2px',
    minWidth: 'auto',
    width: 'auto',
    height: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    padding: '3px 5px',
    backgroundColor: 'transparent',
    border: 'none',
    '&:hover': {
      backgroundColor: params.canClose === false ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
    },
  },
  root: {
    border: 'none',
    minWidth: 'auto',
    minHeight: 'auto',
  },
  label: {
    color: params.canClose === false ? 'rgba(140, 140, 140, 0.5)' : 'rgba(200, 60, 60, 0.95)',
  },
}));

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  const { classes } = useStyles({ canClose });

  return (
    <Button
      variant="default"
      className={classes.button}
      classNames={{ label: classes.label, root: classes.root }}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon icon={icon} fontSize={iconSize} fixedWidth />
    </Button>
  );
};

export default HeaderButton;
