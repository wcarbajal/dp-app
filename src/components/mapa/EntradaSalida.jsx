
export const EntradaSalida = ( { objetivo } ) => {
  return (

    <div className="bg-[#3f6689] rounded-lg shadow p-2 flex items-center justify-center h-full w-[120px] ">
      <span
        className="text-xs text-white font-bold  text-center"
        style={ { writingMode: 'vertical-rl', transform: 'rotate(180deg)' } }
      >
        { objetivo }
      </span>
    </div>
  );
};