import { createStyles, PasswordInput, TextInput } from '@mantine/core';
import React from 'react';
import { IInput } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: IInput;
  index: number;
}

const useStyles = createStyles((theme) => ({
  root: {
    '& .mantine-TextInput-label, & .mantine-PasswordInput-label': {
      color: 'var(--ox-text-muted)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: 6,
      fontWeight: 500,
    },
    '& .mantine-TextInput-description, & .mantine-PasswordInput-description': {
      color: 'var(--ox-text-muted)',
      fontSize: 11,
      marginBottom: 6,
    },
    '& .mantine-TextInput-input, & .mantine-PasswordInput-input': {
      backgroundColor: '#333335',
      border: 'none',
      borderRadius: 8,
      color: '#c1c2c5',
      fontSize: 12,
      padding: '8px 10px',
      height: 'auto',
      transition: 'all 0.2s',
      '&:focus': {
        backgroundColor: '#33343F',
      },
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.35)',
        fontSize: 11,
      },
      '&:disabled': {
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        opacity: 0.6,
      },
    },
    '& .mantine-TextInput-icon, & .mantine-PasswordInput-icon': {
      color: '#5dade2',
    },
    '& .mantine-PasswordInput-innerInput': {
      backgroundColor: 'transparent',
      color: '#c1c2c5',
      fontSize: 12,
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.35)',
        fontSize: 11,
      },
    },
  },
  eyeIcon: {
    color: 'rgba(255, 255, 255, 0.4)',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
}));

const InputField: React.FC<Props> = (props) => {
  const { classes } = useStyles();

  return (
    <>
      {!props.row.password ? (
        <TextInput
          {...props.register}
          defaultValue={props.row.default}
          label={props.row.label}
          description={props.row.description}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          placeholder={props.row.placeholder}
          minLength={props.row.min}
          maxLength={props.row.max}
          disabled={props.row.disabled}
          withAsterisk={props.row.required}
          className={classes.root}
        />
      ) : (
        <PasswordInput
          {...props.register}
          defaultValue={props.row.default}
          label={props.row.label}
          description={props.row.description}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
          placeholder={props.row.placeholder}
          minLength={props.row.min}
          maxLength={props.row.max}
          disabled={props.row.disabled}
          withAsterisk={props.row.required}
          className={classes.root}
          visibilityToggleIcon={({ reveal, size }) => (
            <LibIcon
              icon={reveal ? 'eye-slash' : 'eye'}
              fontSize={size}
              cursor="pointer"
              className={classes.eyeIcon}
              fixedWidth
            />
          )}
        />
      )}
    </>
  );
};

export default InputField;
