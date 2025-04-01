import React, { useState } from "react";
import AddSeller1Modal from "../components/Modal/AddSeller1Modal";
import AddSeller2Modal from "../components/Modal/AddSeller2Modal";
import AddSeller3Modal from "../components/Modal/AddSeller3Modal";
import { Wine } from "../types/wine";

const MySellerAddFlow: React.FC = () => {
  const [isStep1Open, setIsStep1Open] = useState(false);
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [isStep3Open, setIsStep3Open] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [drinkData, setDrinkData] = useState<any>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customBottleId, setCustomBottleId] = useState<number | undefined>();

  const openStep1 = () => setIsStep1Open(true);
  const closeStep1 = () => setIsStep1Open(false);
  const openStep2 = () => setIsStep2Open(true);
  const closeStep2 = () => setIsStep2Open(false);
  const closeStep3 = () => setIsStep3Open(false);

  const handleNextStep = (wine: Wine, custom: boolean, bottleId?: number) => {
    setSelectedWine(wine);
    setIsCustom(custom);
    if (custom && bottleId) {
      setCustomBottleId(bottleId);
    }
    closeStep1();
    setIsStep2Open(true);
  };

  const handleNextStep2 = (drinkInfo: any) => {
    setDrinkData(drinkInfo);
    closeStep2();
    setIsStep3Open(true);
  };

  const handlePrevStep = () => {
    closeStep2();
    setIsStep1Open(true);
  };

  return (
    <>
      <button onClick={openStep1}>+</button>

      <AddSeller1Modal
        isOpen={isStep1Open}
        onClose={closeStep1}
        onNext={(wine) => handleNextStep(wine, false)} // 일반 와인
        onCustomNext={(customBottle) => handleNextStep(customBottle.wine, true, customBottle.bottleId)} // 커스텀 와인
      />

      {selectedWine && (
        <AddSeller2Modal
          isOpen={isStep2Open}
          onClose={closeStep2}
          onPrev={handlePrevStep}
          onNext={handleNextStep2}
          wineInfo={selectedWine}
        />
      )}

      {selectedWine && drinkData && (
        <AddSeller3Modal
          isOpen={isStep3Open}
          onClose={closeStep3}
          onPrev={() => {
            closeStep3();
            openStep2();
          }}
          drinkData={drinkData}
          wineInfo={selectedWine}
          mode={isCustom ? "add" : "new"}
          bottleId={isCustom ? customBottleId : undefined}
          isCustom={isCustom}
        />
      )}
    </>
  );
};

export default MySellerAddFlow;
