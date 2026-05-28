import type { CharacterAnalysis, FiveGridAnalysis, FiveGridItem } from "@/types/analysis";
import { numberToElement } from "@/lib/name/nameElement";

export function calculateFiveGridByKangxi(characters: CharacterAnalysis[]): FiveGridAnalysis {
  const strokes = characters.map((character) => character.strokes);
  const surname = strokes[0] ?? 1;
  const given = strokes.slice(1);
  const firstGiven = given[0] ?? 1;
  const lastGiven = given[given.length - 1] ?? firstGiven;
  const total = strokes.reduce((sum, stroke) => sum + stroke, 0);
  const items: FiveGridItem[] = [
    makeGrid("天格", surname + 1),
    makeGrid("人格", surname + firstGiven),
    makeGrid("地格", given.reduce((sum, stroke) => sum + stroke, 0) + (given.length === 1 ? 1 : 0)),
    makeGrid("外格", total - (surname + firstGiven) + 1 || lastGiven + 1),
    makeGrid("总格", total)
  ];
  const getElement = (name: FiveGridItem["name"]) => items.find((item) => item.name === name)?.element ?? "土";

  return {
    surnameStrokes: surname,
    givenNameStrokes: given,
    grids: items,
    corePersonalityElement: getElement("人格"),
    personalityElement: getElement("人格"),
    outerGridElement: getElement("外格"),
    groundGridElement: getElement("地格"),
    totalGridElement: getElement("总格"),
    skyGridElement: getElement("天格"),
    summary: `五格以康熙笔画参考，人格取${surname + firstGiven}，五行属${getElement("人格")}。这一格先看一个人做事、承压和面对外界的主要方式。`
  };
}

function makeGrid(name: FiveGridItem["name"], number: number): FiveGridItem {
  const element = numberToElement(number);
  return {
    name,
    number,
    element,
    note: `${name}${number}画，数理五行取${element}，作为第一版五格对照参考。`
  };
}
