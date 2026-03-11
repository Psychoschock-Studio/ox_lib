import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles } from '@mantine/core';
import ScaleFade from '../../transitions/ScaleFade';
import type { TextUiPosition, TextUiProps } from '../../typings';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme, params: { position?: TextUiPosition; holdProgress?: number }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 
      params.position === 'top-center' ? 'baseline' :
      params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent: 
      params.position === 'right-center' ? 'flex-end' :
      params.position === 'left-center' ? 'flex-start' : 'center',
  },
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    margin: 20,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
  holdProgressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.25)',
    transition: 'width 0.08s linear',
    width: `${params.holdProgress || 0}%`,
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--theme-accent)',
    fontSize: 14,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '0.2px',
    whiteSpace: 'pre-line',
  },
  keyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 22,
    height: 22,
    padding: '0 7px',
    backgroundColor: 'rgba(var(--theme-accent-rgb), 0.25)',
    border: '1px solid rgba(var(--theme-accent-rgb), 0.5)',
    borderRadius: 4,
    color: 'var(--theme-accent)',
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'Roboto Mono', 'Courier New', monospace",
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    marginRight: 6,
  },
}));

const parseTextWithKeys = (text: string, keyBadgeClass: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /\[([A-Z0-9]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className={keyBadgeClass}>
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  
  const holdProgress = data.holdProgress !== undefined && data.holdMax !== undefined && data.holdMax > 0
    ? Math.min(100, (data.holdProgress / data.holdMax) * 100)
    : 0;
    
  const { classes } = useStyles({ position: data.position, holdProgress });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center';
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  const cleanText = data.text.replace(/\*\*/g, '');
  const parsedContent = parseTextWithKeys(cleanText, classes.keyBadge);

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            {holdProgress > 0 && <Box className={classes.holdProgressBar} />}
            <Box className={classes.content}>
              {data.icon && (
                <Box className={classes.icon}>
                  <LibIcon
                    icon={data.icon}
                    fixedWidth
                    animation={data.iconAnimation}
                    style={{
                      color: data.iconColor || 'var(--theme-accent)',
                    }}
                  />
                </Box>
              )}
              <Box className={classes.text}>
                {parsedContent}
              </Box>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
