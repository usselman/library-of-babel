import pandaIcon from "../assets/panda-icon.svg";

export type PandaConnectButtonProps = {
  onClick: () => void;
  className?: string; // Optional className prop
};

export const PandaConnectButton = (props: PandaConnectButtonProps) => {
  const { onClick, className } = props;
  return (
    <button
      onClick={onClick}
      className={`flex items-center md:p-4 sm:p-2 rounded cursor-pointer md:text-lg sm:text-md font-bold sm:hidden text-black border-2 border-black ${className}`}
    >
      {/* <img src={pandaIcon} alt="icon" className="mr-4 w-6 h-6" /> */}
      Yours Wallet
    </button>
  );
};

export default PandaConnectButton;
