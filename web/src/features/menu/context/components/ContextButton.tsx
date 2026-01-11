import { Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }) => ({
  inner: {
    justifyContent: 'flex-start',
  },
  label: {
    width: '100%',
    color: params.disabled ? 'var(--ox-text-muted)' : 'var(--ox-text-primary)',
    whiteSpace: 'pre-wrap',
    fontSize: 12,
  },
  button: {
    height: 'fit-content',
    width: '100%',
    padding: '10px 12px',
    backgroundColor: params.disabled 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--ox-border)',
    borderRadius: 'var(--ox-radius)',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: params.readOnly 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(255, 255, 255, 0.08)',
      borderColor: params.readOnly ? 'var(--ox-border)' : 'var(--ox-border-hover)',
      cursor: params.readOnly ? 'default' : 'pointer',
    },
    '&:active': {
      transform: params.readOnly ? 'none' : 'scale(0.99)',
    },
  },
  iconImage: {
    maxWidth: 20,
    filter: params.disabled ? 'grayscale(100%) opacity(0.5)' : 'none',
  },
  description: {
    color: params.disabled ? 'rgba(255, 255, 255, 0.3)' : 'var(--ox-text-muted)',
    fontSize: 11,
    lineHeight: 1.4,
  },
  dropdown: {
    padding: 12,
    color: 'var(--ox-text-primary)',
    fontSize: 12,
    maxWidth: 256,
    width: 'fit-content',
    border: '1px solid var(--ox-border)',
    borderRadius: 'var(--ox-radius)',
    backgroundColor: 'var(--ox-bg-primary)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  },
  buttonStack: {
    gap: 4,
    flex: 1,
  },
  buttonGroup: {
    gap: 10,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    width: 28,
    height: 28,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.15)',
    border: '1px solid rgba(var(--theme-accent-rgb), 0.3)',
    borderRadius: 6,
  },
  buttonTitleText: {
    overflowWrap: 'break-word',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--ox-text-primary)',
    '& p': {
      margin: 0,
    },
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
    color: 'var(--ox-text-muted)',
  },
  progress: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    height: 4,
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
        shadow="xl"
        zIndex={1000}
        styles={{
          dropdown: {
            backgroundColor: 'var(--ox-bg-primary)',
            border: '1px solid var(--ox-border)',
            borderRadius: 'var(--ox-radius)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Group position="apart" w="100%" noWrap>
              <Stack className={classes.buttonStack}>
                {(button.title || Number.isNaN(+buttonKey)) && (
                  <Group className={classes.buttonGroup}>
                    {button?.icon && (
                      <Stack className={classes.buttonIconContainer}>
                        {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                          <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                        ) : (
                          <LibIcon
                            icon={button.icon as IconProp}
                            fixedWidth
                            style={{ 
                              color: button.iconColor || 'var(--theme-accent)',
                              fontSize: 12,
                            }}
                            animation={button.iconAnimation}
                          />
                        )}
                      </Stack>
                    )}
                    <Text className={classes.buttonTitleText}>
                      <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                    </Text>
                  </Group>
                )}
                {button.description && (
                  <Text className={classes.description}>
                    <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                  </Text>
                )}
                {button.progress !== undefined && (
                  <Progress 
                    value={button.progress} 
                    size={4}
                    radius={4}
                    color={button.colorScheme || 'var(--theme-accent)'} 
                    className={classes.progress}
                  />
                )}
              </Stack>
              {(button.menu || button.arrow) && button.arrow !== false && (
                <Stack className={classes.buttonArrowContainer}>
                  <LibIcon icon="chevron-right" fixedWidth style={{ fontSize: 12 }} />
                </Stack>
              )}
            </Group>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} radius="sm" mb={8} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <div key={`context-metadata-${index}`}>
                  <Text size="xs" color="dimmed" mb={metadata && typeof metadata === 'object' && metadata.progress !== undefined ? 4 : 2}>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>
                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size={4}
                      radius={4}
                      color={metadata.colorScheme || button.colorScheme || 'var(--theme-accent)'}
                      mb={4}
                    />
                  )}
                </div>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`} size="xs" color="dimmed">
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
