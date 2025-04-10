import React, { useState } from "react";
import AddSeller1Modal from "./Modal/AddSeller1Modal";
import AddSeller2Modal from "./Modal/AddSeller2Modal";
import AddSeller3Modal from "./Modal/AddSeller3Modal";
import { Wine } from "../types/wine";
import { CustomWineRegistrationRequest } from "../types/seller";
import { vh } from "../utils/vh"; // vh 유틸 쓰는 경우
import { trackEvent } from "../utils/analytics";

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
        onClick={() => {
          trackEvent("add_seller_modal", {
            location: "wineseller_page",
          });
          setIsStep1Open(true);
        }}
        style={{
          width: "75%",
          margin: "0 auto", // 가운데 정렬을 위한 설정
          maxWidth: vh(44), // 약 350px 기준
          position: "relative",
          display: "inline-block",
          backgroundColor: "#FCFCFC",
          color: "#000000",
          border: "none",
          borderRadius: vh(1),
          padding: `${vh(1)} ${vh(1)}`,
          cursor: "pointer",
          fontFamily: "Galmuri7",
          fontSize: vh(1.5),
          textAlign: "center",
          boxShadow: `-2px -2px 2px 0px rgba(0, 0, 0, 0.25) inset`, // 새로운 box-shadow
          filter: `drop-shadow(${vh(0.6)} ${vh(0.7)} 0px rgba(0, 0, 0, 0.6))`,

          transition: "all 0.2s ease",
          whiteSpace: "nowrap",
        }}
        onMouseDown={(e) => {
          (e.target as HTMLButtonElement).style.boxShadow = `${vh(0.5)} ${vh(0.6)} 0px rgba(0, 0, 0, 0.6)`;
        }}
        onMouseUp={(e) => {
          (e.target as HTMLButtonElement).style.boxShadow = `${vh(0.5)} ${vh(0.6)} 0px rgba(0, 0, 0, 0.6)`;
        }}
      >
        + 내가 마신 와인 추가하기 +
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
