import { Box, Button, createStyles, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '12px 16px',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'Roboto',
    textAlign: 'center',
    width: '100%',
  },
  body: {
    padding: '14px 16px',
    maxHeight: 350,
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 2,
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 2,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '7px 14px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
  confirmButton: {
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.2)',
    border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
    color: 'var(--theme-accent)',
    padding: '7px 14px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(var(--theme-accent-rgb), 0.3)',
      borderColor: 'rgba(var(--theme-accent-rgb), 0.5)',
    },
  },
}));

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();
  const { classes } = useStyles();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            (row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked) ?? null,
        }
      );
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size={fields.options?.size || 'xs'}
        withCloseButton={false}
        overlayOpacity={0.5}
        overlayColor="rgba(0, 0, 0, 0.8)"
        transition="fade"
        exitTransitionDuration={150}
        padding={0}
        styles={{
          modal: {
            backgroundColor: '#1f1f1f',
            border: 'none',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
          },
          inner: {
            padding: 0,
          },
        }}
      >
        <form onSubmit={onSubmit}>
          <Box className={classes.header}>
            <Box className={classes.title}>{fields.heading}</Box>
          </Box>
          <Box className={classes.body}>
            <Stack spacing={12}>
              {fieldForm.fields.map((item, index) => {
                const row = fields.rows[index];
                return (
                  <React.Fragment key={item.id}>
                    {row.type === 'input' && (
                      <InputField
                        register={form.register(`test.${index}.value`, { required: row.required })}
                        row={row}
                        index={index}
                      />
                    )}
                    {row.type === 'checkbox' && (
                      <CheckboxField
                        register={form.register(`test.${index}.value`, { required: row.required })}
                        row={row}
                        index={index}
                      />
                    )}
                    {(row.type === 'select' || row.type === 'multi-select') && (
                      <SelectField row={row} index={index} control={form.control} />
                    )}
                    {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                    {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                    {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                    {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                    {row.type === 'date' || row.type === 'date-range' ? (
                      <DateField control={form.control} row={row} index={index} />
                    ) : null}
                    {row.type === 'textarea' && (
                      <TextareaField
                        register={form.register(`test.${index}.value`, { required: row.required })}
                        row={row}
                        index={index}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Box>
          <Box className={classes.footer}>
            <Group position="right" spacing={8}>
              <Button
                className={classes.cancelButton}
                onClick={() => handleClose()}
                disabled={fields.options?.allowCancel === false}
              >
                {locale.ui.cancel}
              </Button>
              <Button className={classes.confirmButton} type="submit">
                {locale.ui.confirm}
              </Button>
            </Group>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
