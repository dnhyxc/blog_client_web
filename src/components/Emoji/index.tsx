import React from 'react';
import { EMOJI_HOST, EMOJI_MAP, EMOJI_NAME } from '@/constant';
import styles from './index.less';

interface IProps {
  addEmoji: (name: string) => void;
  setVisible: Function
}

const Emoji: React.FC<IProps> = ({ addEmoji, setVisible }) => {
  const onAddEmoji = (name: string) => () => {
    addEmoji(name);
    setVisible(false);
  };

  return (
    <div id="_emoji_" className={styles.Emoji}>
      {
        EMOJI_NAME.map((name, index) => (
          <div className={styles.emojiItem} key={name} onClick={onAddEmoji(name)} id={name}>
            <img key={index} src={`${EMOJI_HOST}${EMOJI_MAP[name]}`} alt="" className={styles.emoji} id={`emoji_${name}`} />
          </div>
        ))
      }
    </div>
  );
};

export default Emoji;
