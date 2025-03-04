import { EditorData, EditorNode } from '@appflowyinc/editor';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToColor(string: string, colorArray?: string[]) {
  let hash = 0;
  let i;

  for(i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  if(colorArray) {
    return colorArray[string.slice(0, 1).charCodeAt(0) % colorArray.length];
  }

  let color = '#';

  for(i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;

    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

const icon: Map<string, string> = new Map();

export async function getIcon(id: string) {
  if(icon.has(id)) {
    return icon.get(id);
  }

  const url = `https://appflowy.com/af_icons/${id}.svg`;

  const res = await fetch(url);

  if(!res.ok) {
    return '';
  }

  const text = await res.text();

  icon.set(id, text);

  return text;
}

// Convert ARGB to RGBA
// Flutter uses ARGB, but CSS uses RGBA
function argbToRgba(color: string): string {
  const hex = color.replace(/^#|0x/, '');

  const hasAlpha = hex.length === 8;

  if(!hasAlpha) {
    return color.replace('0x', '#');
  }

  const r = parseInt(hex.slice(2, 4), 16);
  const g = parseInt(hex.slice(4, 6), 16);
  const b = parseInt(hex.slice(6, 8), 16);
  const a = hasAlpha ? parseInt(hex.slice(0, 2), 16) / 255 : 1;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export enum ColorEnum {
  Purple = 'appflowy_them_color_tint1',
  Pink = 'appflowy_them_color_tint2',
  LightPink = 'appflowy_them_color_tint3',
  Orange = 'appflowy_them_color_tint4',
  Yellow = 'appflowy_them_color_tint5',
  Lime = 'appflowy_them_color_tint6',
  Green = 'appflowy_them_color_tint7',
  Aqua = 'appflowy_them_color_tint8',
  Blue = 'appflowy_them_color_tint9',
}

export const colorMap = {
  [ColorEnum.Purple]: 'var(--tint-purple)',
  [ColorEnum.Pink]: 'var(--tint-pink)',
  [ColorEnum.LightPink]: 'var(--tint-red)',
  [ColorEnum.Orange]: 'var(--tint-orange)',
  [ColorEnum.Yellow]: 'var(--tint-yellow)',
  [ColorEnum.Lime]: 'var(--tint-lime)',
  [ColorEnum.Green]: 'var(--tint-green)',
  [ColorEnum.Aqua]: 'var(--tint-aqua)',
  [ColorEnum.Blue]: 'var(--tint-blue)',
};

export function renderColor(color: string) {
  if(colorMap[color as ColorEnum]) {
    return colorMap[color as ColorEnum];
  }

  return argbToRgba(color);
}

export function convertToPageData(data: EditorData) {
  const traverse = (item: EditorNode) => {
    const newNode: EditorNode = {
      ...item,
      data: {
        ...item.data,
        delta: item.delta,
      },
      children: item.children.map(traverse),
    };
    return newNode;
  };

  return data.map(traverse);
}