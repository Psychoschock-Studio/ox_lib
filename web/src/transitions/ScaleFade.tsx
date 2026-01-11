import { AnimatePresence, motion } from 'framer-motion';

const ScaleFade: React.FC<{ visible: boolean; children: React.ReactNode; onExitComplete?: () => void }> = ({
  visible,
  children,
  onExitComplete,
}) => {
  return (
    <>
      <AnimatePresence onExitComplete={onExitComplete}>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScaleFade;
