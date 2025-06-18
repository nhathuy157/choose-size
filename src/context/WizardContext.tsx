"use client";

import React, { createContext, useState, ReactNode, useContext } from 'react';

export type UnitHeight = 'cm' | 'in';
export type UnitWeight = 'kg' | 'lbs';
export type Gender = 'male' | 'female' | '';

export interface WizardState {
  product: string; // sản phẩm chọn size
  height: string;
  heightUnit: UnitHeight;
  weight: string;
  weightUnit: UnitWeight;
  bellyShape: 'flatter' | 'average' | 'curvier' | '';
  preference: number;
  gender: Gender;
}

export interface WizardContextType extends WizardState {
  setHeight: (h: string) => void;
  setProduct: (p: string) => void;
  setHeightUnit: (u: UnitHeight) => void;
  setWeight: (w: string) => void;
  setWeightUnit: (u: UnitWeight) => void;
  setBellyShape: (s: 'flatter' | 'average' | 'curvier') => void;
  setPreference: (v: number) => void;
  setGender: (g: Gender) => void;
}

export const defaultState: WizardState = {
  product: '',
  height: '',
  heightUnit: 'cm',
  weight: '',
  weightUnit: 'kg',
  bellyShape: '',
  preference: 50,
  gender: '',
};

const WizardContext = createContext<WizardContextType>({
  ...defaultState,
  setHeight: () => {},
  setProduct: () => {},
  setHeightUnit: () => {},
  setWeight: () => {},
  setWeightUnit: () => {},
  setBellyShape: () => {},
  setPreference: () => {},
  setGender: () => {},
});

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<string>(defaultState.product);
  const [height, setHeight] = useState<string>(defaultState.height);
  const [heightUnit, setHeightUnit] = useState<UnitHeight>(defaultState.heightUnit);
  const [weight, setWeight] = useState<string>(defaultState.weight);
  const [weightUnit, setWeightUnit] = useState<UnitWeight>(defaultState.weightUnit);
  const [bellyShape, setBellyShape] = useState<typeof defaultState.bellyShape>(defaultState.bellyShape);
  const [preference, setPreference] = useState<number>(defaultState.preference);
  const [gender, setGender] = useState<Gender>(defaultState.gender);

  return (
    <WizardContext.Provider
      value={{ product, setProduct, height, heightUnit, weight, weightUnit, bellyShape, preference,
               setHeight, setHeightUnit, setWeight, setWeightUnit, setBellyShape, setPreference,
               gender, setGender,
       }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => useContext(WizardContext);