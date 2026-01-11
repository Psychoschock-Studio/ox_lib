import { Box, createStyles, Text } from '@mantine/core';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    color: 'var(--ox-text-muted)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 500,
    fontFamily: 'Roboto',
  },
  sliderWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--ox-border)',
    borderRadius: 'var(--ox-radius)',
    transition: 'all 0.2s',
    '&:focus-within': {
      borderColor: 'var(--theme-accent)',
      backgroundColor: 'rgba(var(--theme-accent-rgb), 0.05)',
    },
  },
  slider: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    background: 'rgba(255, 255, 255, 0.15)',
    outline: 'none',
    WebkitAppearance: 'none',
    appearance: 'none' as any,
    cursor: 'pointer',
    '&::-webkit-slider-thumb': {
      WebkitAppearance: 'none',
      appearance: 'none',
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: 'var(--theme-accent)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        transform: 'scale(1.15)',
        background: 'var(--theme-accent-light)',
      },
    },
    '&::-moz-range-thumb': {
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: 'var(--theme-accent)',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.15s ease',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        transform: 'scale(1.15)',
        background: 'var(--theme-accent-light)',
      },
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  value: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--theme-accent)',
    fontFamily: 'Roboto Mono',
    minWidth: 36,
    textAlign: 'right',
    padding: '2px 8px',
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.15)',
    borderRadius: 4,
  },
}));

const SliderField: React.FC<Props> = (props) => {
  const { classes } = useStyles();
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default || props.row.min || 0,
  });

  return (
    <Box className={classes.wrapper}>
      <Text className={classes.label}>{props.row.label}</Text>
      <Box className={classes.sliderWrapper}>
        <input
          type="range"
          className={classes.slider}
          value={controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(e) => controller.field.onChange(parseFloat(e.target.value))}
          min={props.row.min ?? 0}
          max={props.row.max ?? 100}
          step={props.row.step ?? 1}
          disabled={props.row.disabled}
        />
        <Text className={classes.value}>{controller.field.value}</Text>
      </Box>
    </Box>
  );
};

export default SliderField;
