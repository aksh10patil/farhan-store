import React from 'react';
import { GarmentSvgType } from '@/types/store';

interface GarmentIllustrationProps {
  type: GarmentSvgType;
  className?: string;
  uniqueIdPrefix?: string;
}

export const GarmentIllustration: React.FC<GarmentIllustrationProps> = ({
  type,
  className = 'w-full h-full object-contain',
  uniqueIdPrefix = '',
}) => {
  const pId = (id: string) => (uniqueIdPrefix ? `${uniqueIdPrefix}_${id}` : id);

  switch (type) {
    case 'flannel':
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Flannel Overshirt">
          <defs>
            <pattern
              id={pId('buffaloPlaid')}
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <rect width="36" height="36" fill="#C81E1E" />
              <rect x="0" y="0" width="18" height="18" fill="#141413" fillOpacity={0.88} />
              <rect x="18" y="0" width="18" height="18" fill="#7F1111" fillOpacity={0.65} />
              <rect x="0" y="18" width="18" height="18" fill="#7F1111" fillOpacity={0.65} />
            </pattern>
            <linearGradient id={pId('shirtShade')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.14} />
              <stop offset="55%" stopColor="#000000" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#000000" stopOpacity={0.45} />
            </linearGradient>
          </defs>
          {/* Left Sleeve */}
          <path
            d="M98 78 L42 155 L28 292 L62 298 L88 188 L104 140 Z"
            fill={`url(#${pId('buffaloPlaid')})`}
            stroke="#0e0e0d"
            strokeWidth={2}
          />
          <path
            d="M98 78 L42 155 L28 292 L62 298 L88 188 L104 140 Z"
            fill={`url(#${pId('shirtShade')})`}
          />
          {/* Right Sleeve */}
          <path
            d="M262 78 L318 155 L332 292 L298 298 L272 188 L256 140 Z"
            fill={`url(#${pId('buffaloPlaid')})`}
            stroke="#0e0e0d"
            strokeWidth={2}
          />
          <path
            d="M262 78 L318 155 L332 292 L298 298 L272 188 L256 140 Z"
            fill={`url(#${pId('shirtShade')})`}
          />
          {/* Torso Body */}
          <path
            d="M98 76 L142 62 L218 62 L262 76 L272 325 C225 342 135 342 88 325 Z"
            fill={`url(#${pId('buffaloPlaid')})`}
            stroke="#0e0e0d"
            strokeWidth={2}
          />
          <path
            d="M98 76 L142 62 L218 62 L262 76 L272 325 C225 342 135 342 88 325 Z"
            fill={`url(#${pId('shirtShade')})`}
          />
          {/* Collar */}
          <path d="M142 62 L180 86 L152 104 L132 76 Z" fill="#B51919" stroke="#111" strokeWidth={2} />
          <path d="M218 62 L180 86 L208 104 L228 76 Z" fill="#B51919" stroke="#111" strokeWidth={2} />
          <path d="M146 60 Q180 74 214 60 L206 76 Q180 84 154 76 Z" fill="#630D0D" />
          {/* Center Placket & Buttons */}
          <rect x="174" y="84" width="12" height="248" fill="#9E1616" fillOpacity={0.65} />
          <circle cx="180" cy="105" r="3" fill="#181816" />
          <circle cx="180" cy="145" r="3" fill="#181816" />
          <circle cx="180" cy="185" r="3" fill="#181816" />
          <circle cx="180" cy="225" r="3" fill="#181816" />
          <circle cx="180" cy="265" r="3" fill="#181816" />
          <circle cx="180" cy="305" r="3" fill="#181816" />
          {/* Dual Chest Pockets */}
          <rect
            x="114"
            y="132"
            width="46"
            height="52"
            rx="3"
            fill={`url(#${pId('buffaloPlaid')})`}
            stroke="#111"
            strokeWidth={1.8}
          />
          <path d="M114 132 L160 132 L156 150 L137 156 L118 150 Z" fill="#A61717" stroke="#111" strokeWidth={1.5} />
          <circle cx="137" cy="146" r="2.5" fill="#141413" />

          <rect
            x="200"
            y="132"
            width="46"
            height="52"
            rx="3"
            fill={`url(#${pId('buffaloPlaid')})`}
            stroke="#111"
            strokeWidth={1.8}
          />
          <path d="M200 132 L246 132 L242 150 L223 156 L204 150 Z" fill="#A61717" stroke="#111" strokeWidth={1.5} />
          <circle cx="223" cy="146" r="2.5" fill="#141413" />
        </svg>
      );

    case 'puffer':
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Insulated Puffer Vest">
          <defs>
            <linearGradient id={pId('orangePuffer')} x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stopColor="#FF7A1A" />
              <stop offset="50%" stopColor="#FF5E00" />
              <stop offset="100%" stopColor="#CC4400" />
            </linearGradient>
          </defs>
          {/* High Funnel Collar */}
          <path
            d="M132 52 Q180 42 228 52 L236 92 Q180 104 124 92 Z"
            fill="#E04E00"
            stroke="#993300"
            strokeWidth={2}
          />
          {/* Sleeveless Puffer Body */}
          <path
            d="M104 82 L134 74 L226 74 L256 82 C246 125 248 165 268 195 L264 334 Q180 344 96 334 L92 195 C112 165 114 125 104 82 Z"
            fill={`url(#${pId('orangePuffer')})`}
            stroke="#8F3000"
            strokeWidth={2}
          />
          {/* Horizontal Quilted Baffles */}
          <path d="M102 135 Q180 144 258 135" stroke="#B83D00" strokeWidth={3} fill="none" />
          <path d="M96 185 Q180 195 264 185" stroke="#B83D00" strokeWidth={3} fill="none" />
          <path d="M96 235 Q180 245 264 235" stroke="#B83D00" strokeWidth={3} fill="none" />
          <path d="M96 285 Q180 295 264 285" stroke="#B83D00" strokeWidth={3} fill="none" />
          {/* Center Zipper Track */}
          <line x1="180" y1="84" x2="180" y2="338" stroke="#221814" strokeWidth={3.5} />
          <rect x="176" y="106" width="8" height="14" rx="2" fill="#221814" />
          {/* Side Zip Pockets */}
          <line x1="118" y1="242" x2="112" y2="296" stroke="#993300" strokeWidth={2.5} strokeLinecap="round" />
          <line x1="242" y1="242" x2="248" y2="296" stroke="#993300" strokeWidth={2.5} strokeLinecap="round" />
        </svg>
      );

    case 'sherpa':
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Sherpa Fleece Zip">
          <defs>
            <linearGradient id={pId('creamFleece')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6E2D6" />
              <stop offset="60%" stopColor="#D6D2C4" />
              <stop offset="100%" stopColor="#ABA696" />
            </linearGradient>
          </defs>
          {/* Sleeves */}
          <path
            d="M96 80 L38 158 L26 294 L64 300 L90 185 L104 140 Z"
            fill={`url(#${pId('creamFleece')})`}
            stroke="#8F8B7E"
            strokeWidth={2}
          />
          <path
            d="M264 80 L322 158 L334 294 L296 300 L270 185 L256 140 Z"
            fill={`url(#${pId('creamFleece')})`}
            stroke="#8F8B7E"
            strokeWidth={2}
          />
          {/* Fleece Torso */}
          <path
            d="M96 78 L140 62 L220 62 L264 78 L272 326 Q180 338 88 326 Z"
            fill={`url(#${pId('creamFleece')})`}
            stroke="#8F8B7E"
            strokeWidth={2}
          />
          {/* Stand Collar */}
          <path
            d="M136 58 Q180 48 224 58 L228 90 Q180 100 132 90 Z"
            fill="#C4BFA8"
            stroke="#7A766A"
            strokeWidth={2}
          />
          {/* Contrast Nylon Chest Pocket */}
          <rect x="202" y="124" width="44" height="58" rx="4" fill="#2A2A27" stroke="#181816" strokeWidth={1.5} />
          <line x1="208" y1="136" x2="240" y2="136" stroke="#FF5E00" strokeWidth={2} />
          {/* Full Zip */}
          <line x1="180" y1="62" x2="180" y2="332" stroke="#363531" strokeWidth={3} />
          {/* Elastic Hem */}
          <rect x="88" y="314" width="184" height="14" rx="4" fill="#2A2A27" />
        </svg>
      );

    case 'shell':
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Alpine 3L Shell Jacket">
          <defs>
            <linearGradient id={pId('oliveShell')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5E694C" />
              <stop offset="55%" stopColor="#4A533B" />
              <stop offset="100%" stopColor="#2E3424" />
            </linearGradient>
          </defs>
          {/* Technical Hood */}
          <path
            d="M132 64 C132 24 228 24 228 64 L218 88 L142 88 Z"
            fill="#3B422F"
            stroke="#22261B"
            strokeWidth={2}
          />
          {/* Articulated Sleeves */}
          <path
            d="M95 82 L34 156 L22 296 L60 302 L88 186 L104 140 Z"
            fill={`url(#${pId('oliveShell')})`}
            stroke="#22261B"
            strokeWidth={2}
          />
          <path
            d="M265 82 L326 156 L338 296 L300 302 L272 186 L256 140 Z"
            fill={`url(#${pId('oliveShell')})`}
            stroke="#22261B"
            strokeWidth={2}
          />
          {/* Gore-Tex Style Shell Body */}
          <path
            d="M95 80 L140 66 L220 66 L265 80 L276 332 Q180 346 84 332 Z"
            fill={`url(#${pId('oliveShell')})`}
            stroke="#22261B"
            strokeWidth={2}
          />
          {/* Storm Flap & Sealed Seams */}
          <rect x="172" y="72" width="16" height="264" fill="#39402D" stroke="#22261B" strokeWidth={1.5} />
          <line x1="112" y1="155" x2="154" y2="175" stroke="#1A1D15" strokeWidth={3} strokeLinecap="round" />
          <line x1="248" y1="155" x2="206" y2="175" stroke="#1A1D15" strokeWidth={3} strokeLinecap="round" />
          {/* ZAID® Technical Patch */}
          <rect x="115" y="118" width="34" height="14" rx="2" fill="#141413" />
          <text
            x="132"
            y="128"
            fill="#EAEAE6"
            fontSize="8"
            fontFamily="monospace"
            textAnchor="middle"
          >
            ZAID®
          </text>
        </svg>
      );

    case 'anorak':
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Cobalt Trail Anorak">
          <defs>
            <linearGradient id={pId('cobaltGrad')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="55%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
          </defs>
          {/* Hood & Collar */}
          <path
            d="M134 62 Q180 34 226 62 L222 92 L138 92 Z"
            fill="#172554"
            stroke="#0F172A"
            strokeWidth={2}
          />
          {/* Sleeves */}
          <path
            d="M96 80 L36 158 L24 294 L62 300 L88 186 L104 140 Z"
            fill={`url(#${pId('cobaltGrad')})`}
            stroke="#0F172A"
            strokeWidth={2}
          />
          <path
            d="M264 80 L324 158 L336 294 L298 300 L272 186 L256 140 Z"
            fill={`url(#${pId('cobaltGrad')})`}
            stroke="#0F172A"
            strokeWidth={2}
          />
          {/* Pullover Body */}
          <path
            d="M96 78 L140 64 L220 64 L264 78 L272 328 Q180 340 88 328 Z"
            fill={`url(#${pId('cobaltGrad')})`}
            stroke="#0F172A"
            strokeWidth={2}
          />
          {/* Half-Zip & Kangaroo Pouch */}
          <line x1="180" y1="74" x2="180" y2="175" stroke="#EAEAE6" strokeWidth={3} />
          <path d="M114 195 L246 195 L254 282 L106 282 Z" fill="#1E3A8A" stroke="#0F172A" strokeWidth={2} />
          <line x1="124" y1="205" x2="236" y2="205" stroke="#FF5E00" strokeWidth={2.5} />
        </svg>
      );

    case 'cargo':
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Ripstop Field Jacket">
          <defs>
            <linearGradient id={pId('slateGrad')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4B525A" />
              <stop offset="55%" stopColor="#3A3F45" />
              <stop offset="100%" stopColor="#222529" />
            </linearGradient>
          </defs>
          {/* Sleeves */}
          <path
            d="M96 80 L38 158 L26 294 L64 300 L90 185 L104 140 Z"
            fill={`url(#${pId('slateGrad')})`}
            stroke="#18191B"
            strokeWidth={2}
          />
          <path
            d="M264 80 L322 158 L334 294 L296 300 L270 185 L256 140 Z"
            fill={`url(#${pId('slateGrad')})`}
            stroke="#18191B"
            strokeWidth={2}
          />
          {/* Ripstop Jacket Body */}
          <path
            d="M96 78 L140 62 L220 62 L264 78 L272 328 Q180 340 88 328 Z"
            fill={`url(#${pId('slateGrad')})`}
            stroke="#18191B"
            strokeWidth={2}
          />
          {/* Collar */}
          <path d="M138 62 L180 88 L150 105 L130 76 Z" fill="#2E3237" stroke="#18191B" strokeWidth={2} />
          <path d="M222 62 L180 88 L210 105 L230 76 Z" fill="#2E3237" stroke="#18191B" strokeWidth={2} />
          {/* Four Utility Cargo Pockets */}
          <rect x="112" y="128" width="48" height="54" rx="3" fill="#2E3237" stroke="#18191B" strokeWidth={1.8} />
          <rect x="200" y="128" width="48" height="54" rx="3" fill="#2E3237" stroke="#18191B" strokeWidth={1.8} />
          <rect x="108" y="216" width="54" height="72" rx="4" fill="#2E3237" stroke="#18191B" strokeWidth={1.8} />
          <rect x="198" y="216" width="54" height="72" rx="4" fill="#2E3237" stroke="#18191B" strokeWidth={1.8} />
          {/* Center Zip */}
          <line x1="180" y1="86" x2="180" y2="332" stroke="#141413" strokeWidth={3.5} />
        </svg>
      );

    case 'utility':
    default:
      return (
        <svg viewBox="0 0 360 400" className={className} aria-label="Canvas Utility Vest">
          <defs>
            <linearGradient id={pId('sandGrad')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D4C5AF" />
              <stop offset="55%" stopColor="#C2B29B" />
              <stop offset="100%" stopColor="#968772" />
            </linearGradient>
          </defs>
          {/* Sleeveless Utility Vest Body */}
          <path
            d="M104 78 L138 68 L222 68 L256 78 C246 122 248 164 266 196 L262 328 Q180 338 98 328 L94 196 C112 164 114 122 104 78 Z"
            fill={`url(#${pId('sandGrad')})`}
            stroke="#6E6252"
            strokeWidth={2}
          />
          {/* V-Neck Opening */}
          <path d="M138 68 L180 132 L222 68 Z" fill="#191917" />
          {/* Tactical Webbing Straps & Buckles */}
          <rect x="114" y="146" width="48" height="44" rx="3" fill="#A89882" stroke="#5E5345" strokeWidth={1.5} />
          <rect x="198" y="146" width="48" height="44" rx="3" fill="#A89882" stroke="#5E5345" strokeWidth={1.5} />
          <rect x="110" y="214" width="56" height="78" rx="4" fill="#A89882" stroke="#5E5345" strokeWidth={1.5} />
          <rect x="194" y="214" width="56" height="78" rx="4" fill="#A89882" stroke="#5E5345" strokeWidth={1.5} />
          {/* Center Buckle Strap */}
          <rect x="166" y="176" width="28" height="16" rx="3" fill="#22221F" />
          <line x1="180" y1="132" x2="180" y2="332" stroke="#4D4438" strokeWidth={3} />
        </svg>
      );
  }
};
