
import Section from "../../../common/components/Section";
import { NextPreviousButton } from "./NextPreviousButtons";

type CreateCharacterSectionBodyProps = { 
    children: React.ReactNode; 
    eyebrow?: string; title?: 
    string; description?: string; 
    showBack?: boolean; showNext?: 
    boolean; 
    onBack?: () => void; 
    onNext?: () => void 
};

export default function CreateCharacterSectionBody({ children, eyebrow, title, description, showBack, showNext, onBack, onNext }: CreateCharacterSectionBodyProps) {
  return (
  <Section eyebrow={eyebrow} title={title} subtitle={description}>
    <div className="gap-3">
        {children}
    </div>
    <div>
        {(showBack || showNext) && (<NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext}/>)}
    </div>
  </Section> )
  
};