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
    borderRadius: 6,
    minWidth: 28,
    width: 28,
    height: 28,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 0,
    backgroundColor: params.canClose === false ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
    border: params.canClose === false ? 'none' : '1px solid var(--ox-border)',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: params.canClose === false ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
      borderColor: params.canClose === false ? 'transparent' : 'var(--ox-border-hover)',
    },
  },
  root: {
    border: 'none',
    minWidth: 'auto',
    minHeight: 'auto',
  },
  label: {
    color: params.canClose === false ? 'rgba(140, 140, 140, 0.5)' : 'var(--ox-text-muted)',
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
