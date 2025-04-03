import React, { useState } from "react";
import AddSeller1Modal from "../components/Modal/AddSeller1Modal";
import AddSeller2Modal from "../components/Modal/AddSeller2Modal";
import AddSeller3Modal from "../components/Modal/AddSeller3Modal";
import { Wine } from "../types/wine";
import { CustomWineRegistrationRequest } from "../types/seller";
import { vh } from "../utils/vh";

interface MySellerAddFlowProps {
  buttonText?: string;
}

const MySellerAddFlow = ({ buttonText = "+" }: MySellerAddFlowProps) => {
  const [isStep1Open, setIsStep1Open] = useState(false);
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [isStep3Open, setIsStep3Open] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [drinkData, setDrinkData] = useState<any>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customBottleId, setCustomBottleId] = useState<number | undefined>();
  const [customWineForm, setCustomWineForm] = useState<CustomWineRegistrationRequest | undefined>(undefined);

  const openStep1 = () => setIsStep1Open(true);
  const openStep2 = () => setIsStep2Open(true);

  const closeStep1 = () => {
    setIsStep1Open(false);
    if (!isStep2Open) {
      setSelectedWine(null);
      setDrinkData(null);
      setIsCustom(false);
      setCustomBottleId(undefined);
      setCustomWineForm(undefined);
    }
  };

  const closeStep2 = () => {
    setIsStep2Open(false);
    if (!isStep3Open) {
      setSelectedWine(null);
      setDrinkData(null);
      setIsCustom(false);
      setCustomBottleId(undefined);
      setCustomWineForm(undefined);
    }
  };

  const closeStep3 = () => {
    setIsStep3Open(false);
    setSelectedWine(null);
    setDrinkData(null);
    setIsCustom(false);
    setCustomBottleId(undefined);
    setCustomWineForm(undefined);
  };

  const handleNextStep = (
    wineData: Wine | { wine: Wine; customWineForm: CustomWineRegistrationRequest },
    isCustomWine: boolean
  ) => {
    if ("customWineForm" in wineData) {
      setSelectedWine(wineData.wine);
      setCustomWineForm(wineData.customWineForm);
      setIsCustom(true);
    } else {
      setSelectedWine(wineData);
      setIsCustom(false);
    }
    setIsStep2Open(true);
    setIsStep1Open(false);
  };

  const handleNextStep2 = (drinkInfo: any) => {
    setDrinkData(drinkInfo);
    setIsStep3Open(true);
    setIsStep2Open(false);
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
        onNext={(wine) => handleNextStep(wine, false)}
        onCustomNext={(data) => handleNextStep(data, true)}
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
          customWineForm={customWineForm}
          isCustom={isCustom}
        />
      )}
    </>
  );
};

export default MySellerAddFlow;
