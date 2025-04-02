import React, { useState } from "react";
import AddSeller1Modal from "./Modal/AddSeller1Modal";
import AddSeller2Modal from "./Modal/AddSeller2Modal";
import AddSeller3Modal from "./Modal/AddSeller3Modal";
import { Wine } from "../types/wine";
import { CustomWineRegistrationRequest } from "../types/seller";

const CustomAddWineButton = () => {
  const [isStep1Open, setIsStep1Open] = useState(false);
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [isStep3Open, setIsStep3Open] = useState(false);
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [drinkData, setDrinkData] = useState<any>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customWineForm, setCustomWineForm] = useState<CustomWineRegistrationRequest | undefined>(undefined);

  const resetState = () => {
    setSelectedWine(null);
    setDrinkData(null);
    setIsCustom(false);
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

  return (
    <>
      <button
        onClick={() => setIsStep1Open(true)}
        style={{
          width: "100%",
          backgroundColor: "#5A0000",
          padding: "5px 10px",

          color: "black",

          cursor: "pointer",
          fontSize: "16px",
          fontFamily: "Pixel, sans-serif",
          transition: "all 0.2s ease",
          textAlign: "center",
          background: "white",
        }}
      >
        내가 마신 와인, 내 와인 셀러에 추가하기
      </button>

      <AddSeller1Modal
        isOpen={isStep1Open}
        onClose={() => {
          setIsStep1Open(false);
          if (!isStep2Open) resetState();
        }}
        onNext={(wine) => handleNextStep(wine, false)}
        onCustomNext={(data) => handleNextStep(data, true)}
      />

      {selectedWine && (
        <AddSeller2Modal
          isOpen={isStep2Open}
          onClose={() => {
            setIsStep2Open(false);
            if (!isStep3Open) resetState();
          }}
          onPrev={() => {
            setIsStep2Open(false);
            setIsStep1Open(true);
          }}
          onNext={(drinkInfo) => {
            setDrinkData(drinkInfo);
            setIsStep3Open(true);
            setIsStep2Open(false);
          }}
          wineInfo={selectedWine}
        />
      )}

      {selectedWine && drinkData && (
        <AddSeller3Modal
          isOpen={isStep3Open}
          onClose={() => {
            setIsStep3Open(false);
            resetState();
          }}
          onPrev={() => {
            setIsStep3Open(false);
            setIsStep2Open(true);
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

export default CustomAddWineButton;
