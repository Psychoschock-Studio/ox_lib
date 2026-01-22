import { Box, createStyles, Text } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 12px',
    backgroundColor: '#333335',
    borderRadius: 8,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#33343F',
    },
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#c1c2c5',
    fontFamily: 'Roboto',
  },
  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: 40,
    height: 22,
    cursor: 'pointer',
    flexShrink: 0,
  },
  input: {
    opacity: 0,
    width: 0,
    height: 0,
    position: 'absolute',
    '&:checked + span': {
      backgroundColor: 'var(--theme-accent)',
    },
    '&:checked + span::before': {
      transform: 'translateX(18px)',
    },
    '&:disabled + span': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  slider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    transition: '0.2s',
    '&::before': {
      position: 'absolute',
      content: '""',
      height: 16,
      width: 16,
      left: 3,
      bottom: 3,
      backgroundColor: 'white',
      borderRadius: '50%',
      transition: '0.2s',
    },
  },
}));

const CheckboxField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Text className={classes.label}>{props.row.label}</Text>
      <label className={classes.toggle}>
        <input
          type="checkbox"
          {...props.register}
          defaultChecked={props.row.checked}
          disabled={props.row.disabled}
          className={classes.input}
        />
        <span className={classes.slider} />
      </label>
    </Box>
  );
};

export default CheckboxField;
