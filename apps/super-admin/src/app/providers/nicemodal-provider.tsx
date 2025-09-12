import NiceModal from "@ebay/nice-modal-react";

const NiceModalProvider = ({ children }: { children: React.ReactNode }) => {
  return <NiceModal.Provider>{children}</NiceModal.Provider>;
};

export default NiceModalProvider;