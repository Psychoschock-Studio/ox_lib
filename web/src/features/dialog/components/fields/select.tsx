import { MultiSelect, Select, createStyles } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const useStyles = createStyles((theme) => ({
  root: {
    '& .mantine-Select-label, & .mantine-MultiSelect-label': {
      color: 'var(--ox-text-muted)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: 6,
      fontWeight: 500,
    },
    '& .mantine-Select-description, & .mantine-MultiSelect-description': {
      color: 'var(--ox-text-muted)',
      fontSize: 11,
      marginBottom: 6,
    },
    '& .mantine-Select-input, & .mantine-MultiSelect-input': {
      backgroundColor: '#333335',
      border: 'none',
      borderRadius: 8,
      color: '#c1c2c5',
      fontSize: 12,
      minHeight: 36,
      '&:focus, &:focus-within': {
        backgroundColor: '#33343F',
      },
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.35)',
        fontSize: 11,
      },
    },
    '& .mantine-Select-icon, & .mantine-MultiSelect-icon': {
      color: '#5dade2',
    },
    '& .mantine-Select-rightSection, & .mantine-MultiSelect-rightSection': {
      color: 'rgba(255, 255, 255, 0.4)',
    },
    '& .mantine-Select-dropdown, & .mantine-MultiSelect-dropdown': {
      backgroundColor: '#1f1f1f',
      border: 'none',
      borderRadius: 10,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    '& .mantine-Select-item, & .mantine-MultiSelect-item': {
      color: '#c1c2c5',
      fontSize: 12,
      borderRadius: 8,
      padding: '8px 10px',
      '&:hover': {
        backgroundColor: '#33343F',
      },
      '&[data-selected]': {
        backgroundColor: 'rgba(93, 173, 226, 0.2)',
        color: '#5dade2',
        '&:hover': {
          backgroundColor: 'rgba(93, 173, 226, 0.25)',
        },
      },
    },
    '& .mantine-MultiSelect-value': {
      backgroundColor: 'rgba(93, 173, 226, 0.2)',
      color: '#5dade2',
      fontSize: 11,
      borderRadius: 4,
    },
    '& .mantine-MultiSelect-defaultValueRemove': {
      color: '#5dade2',
      '&:hover': {
        backgroundColor: 'rgba(93, 173, 226, 0.3)',
      },
    },
  },
}));

const SelectField: React.FC<Props> = (props) => {
  const { classes } = useStyles();
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  return (
    <>
      {props.row.type === 'select' ? (
        <Select
          className={classes.root}
          data={props.row.options}
          value={controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={controller.field.onChange}
          disabled={props.row.disabled}
          label={props.row.label}
          description={props.row.description}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          searchable={props.row.searchable}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
        />
      ) : (
        <>
          {props.row.type === 'multi-select' && (
            <MultiSelect
              className={classes.root}
              data={props.row.options}
              value={controller.field.value}
              name={controller.field.name}
              ref={controller.field.ref}
              onBlur={controller.field.onBlur}
              onChange={controller.field.onChange}
              disabled={props.row.disabled}
              label={props.row.label}
              description={props.row.description}
              withAsterisk={props.row.required}
              clearable={props.row.clearable}
              searchable={props.row.searchable}
              maxSelectedValues={props.row.maxSelectedValues}
              icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
            />
          )}
        </>
      )}
    </>
  );
};

export default SelectField;
