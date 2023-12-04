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
      className={`flex items-center p-4 rounded border-none cursor-pointer text-lg font-bold bg-green-500 ${className}`}
    >
      {/* <img src={pandaIcon} alt="icon" className="mr-4 w-6 h-6" /> */}
      Connect Panda Wallet
    </button>
  );
};

export default PandaConnectButton;
