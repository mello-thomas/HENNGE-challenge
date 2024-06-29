import { useRef, type PropsWithChildren, useEffect, useState } from 'react';
import RecipientsBadge from './RecipientsBadge';

type RecipientsTooltipProps = PropsWithChildren<{ recipients: string[] }>

function RecipientsTooltip({ recipients }: RecipientsTooltipProps) {
  return (
    <div style={{ 
      alignItems: 'center',
      backgroundColor: '#666',
      borderRadius: '24px',
      color: '#f0f0f0',
      display: 'flex',
      margin: '8px 8px 0 0',
      padding: '8px 16px',
      position: 'absolute', 
      right: 0,
      top: 0
    }}>
      {recipients.join(', ')}
    </div>
  );
}

type RecipientsDisplayProps = PropsWithChildren<{ recipients: string[] }>

export default function RecipientsDisplay({ recipients }: RecipientsDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);
  const [isTooltipActive, setIsTooltipActive] = useState(false);

  useEffect(() => {
    updateDisplayedRecipients();
    window.addEventListener('resize', updateDisplayedRecipients);

    return () => {
      window.removeEventListener('resize', updateDisplayedRecipients);
    };
  }, []);

  const updateDisplayedRecipients = () => {
    if (!contentRef.current) return;

    setOverflowCount(0);
    let displayedRecipients: string[] = [];

    for (const recipient of recipients) {
      displayedRecipients.push(recipient);
      contentRef.current.innerText = displayedRecipients.length === recipients.length
        ? displayedRecipients.join(', ')
        : displayedRecipients.join(', ') + ', ...';

      if (
        contentRef.current.scrollWidth > contentRef.current.clientWidth
        && displayedRecipients.length > 1
      ) {
        displayedRecipients.length > 1 && displayedRecipients.pop();
        contentRef.current.innerText = displayedRecipients.join(', ') + ', ...';
        setOverflowCount(recipients.length - displayedRecipients.length);

        break;
      }
    }
  };

  return (<>
    {isTooltipActive && 
      <RecipientsTooltip recipients={recipients} />
    }
    <div style={{ 
      alignItems: 'center', 
      display: 'flex', 
      justifyContent: 'space-between' 
    }}>
      <div 
        ref={contentRef}
        style={{
          overflow: 'hidden', 
          textOverflow: 'ellipsis'
        }}
      ></div>
      {overflowCount > 0 &&
        <RecipientsBadge 
          numTruncated={overflowCount} 
          onMouseEnter={() => setIsTooltipActive(true)} 
          onMouseLeave={() => setIsTooltipActive(false)} 
        />
      }
    </div>
  </>);
}
