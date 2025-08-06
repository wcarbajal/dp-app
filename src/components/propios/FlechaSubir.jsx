import { FaArrowUp } from 'react-icons/fa6';
import { Button } from '../ui/button';

export const FlechaSubir = () => {
  return (
    <Button
      onClick={ () => window.scrollTo( { top: 0, behavior: "smooth" } ) }
      className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full w-10 h-10  flex items-center justify-center shadow-lg hover:bg-primary/80 transition"
      aria-label="Subir página"
    >
      <FaArrowUp size={ 20 } />
    </Button>
  );
};