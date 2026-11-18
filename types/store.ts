export type GarmentSvgType =
  | 'flannel'
  | 'puffer'
  | 'sherpa'
  | 'shell'
  | 'anorak'
  | 'cargo'
  | 'utility';

export type GarmentSize = 'S' | 'M' | 'L' | 'XL';

export interface Garment {
  id: string;
  sku: string;
  name: string;
  tag: string;
  price: number;
  color: string;
  fabric: string;
  fit: string;
  desc: string;
  svgType: GarmentSvgType;
  imageUrl?: string | null;
}

export interface BagItem {
  id: string;
  garmentId: string;
  name: string;
  sku: string;
  price: number;
  size: GarmentSize;
  color: string;
  svgType: GarmentSvgType;
  imageUrl?: string | null;
}

export type ModalType = 'product' | 'addPiece' | 'index' | 'bag' | null;

export interface StoreContextType {
  garments: Garment[];
  currentIndex: number;
  targetIndex: { index: number; timestamp: number } | null;
  activeGarment: Garment | undefined;
  selectedSize: GarmentSize;
  activeModal: ModalType;
  bag: BagItem[];
  bagSubtotal: number;
  toast: { message: string; visible: boolean };
  setSelectedSize: (size: GarmentSize) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setCurrentIndex: (index: number) => void;
  snapToIndex: (index: number) => void;
  nextGarment: () => void;
  prevGarment: () => void;
  addToBag: (garment: Garment, size: GarmentSize) => void;
  removeFromBag: (bagItemId: string) => void;
  addCustomGarment: (garment: Omit<Garment, 'id' | 'sku'>) => void;
  showToast: (message: string) => void;
}
