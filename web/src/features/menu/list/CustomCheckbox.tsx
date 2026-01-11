import { Checkbox, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--ox-border)',
    borderRadius: 4,
    transition: 'all 0.2s',
    '&:checked': { 
      backgroundColor: 'var(--theme-accent)', 
      borderColor: 'var(--theme-accent)',
    },
    '&:hover': {
      borderColor: 'var(--ox-border-hover)',
    },
  },
  inner: {
    '> svg > path': {
      fill: '#fff',
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
