import { C } from "../../constants/theme";

export const ShieldIcon = ({ size = 64, color = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering:"pixelated" }}>
    <rect x="3" y="1" width="10" height="2" fill={color}/><rect x="1" y="3" width="2" height="8" fill={color}/><rect x="13" y="3" width="2" height="8" fill={color}/><rect x="3" y="11" width="2" height="2" fill={color}/><rect x="11" y="11" width="2" height="2" fill={color}/><rect x="5" y="13" width="6" height="2" fill={color}/><rect x="6" y="6" width="4" height="4" fill={color}/><rect x="5" y="7" width="6" height="2" fill={color}/>
  </svg>
);

export const RadarIcon = ({ size = 64, color = C.yellow }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering:"pixelated" }}>
    <rect x="7" y="1" width="2" height="2" fill={color}/><rect x="1" y="7" width="2" height="2" fill={color}/><rect x="13" y="7" width="2" height="2" fill={color}/><rect x="7" y="13" width="2" height="2" fill={color}/><rect x="3" y="3" width="2" height="2" fill={color}/><rect x="11" y="3" width="2" height="2" fill={color}/><rect x="3" y="11" width="2" height="2" fill={color}/><rect x="11" y="11" width="2" height="2" fill={color}/><rect x="5" y="5" width="6" height="6" fill="none" stroke={color} strokeWidth="1"/><rect x="7" y="7" width="2" height="2" fill={color}/><rect x="8" y="4" width="1" height="4" fill={color} opacity="0.6"/><rect x="8" y="8" width="4" height="1" fill={color} opacity="0.4"/>
  </svg>
);

export const GavelIcon = ({ size = 64, color = C.purple }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering:"pixelated" }}>
    <rect x="1" y="11" width="8" height="2" fill={color}/><rect x="1" y="13" width="6" height="2" fill={color}/><rect x="3" y="3" width="6" height="4" fill={color} transform="rotate(-45 6 5)"/><rect x="8" y="2" width="4" height="6" fill={color}/><rect x="9" y="1" width="2" height="2" fill={color}/><rect x="10" y="3" width="4" height="4" fill={color}/><rect x="11" y="5" width="2" height="6" fill={color}/>
  </svg>
);

export const ChainIcon = ({ size = 48, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering:"pixelated" }}>
    <rect x="1" y="5" width="6" height="6" fill="none" stroke={color} strokeWidth="2"/><rect x="3" y="7" width="2" height="2" fill={color}/><rect x="9" y="5" width="6" height="6" fill="none" stroke={color} strokeWidth="2"/><rect x="11" y="7" width="2" height="2" fill={color}/><rect x="7" y="7" width="2" height="2" fill={color}/>
  </svg>
);
