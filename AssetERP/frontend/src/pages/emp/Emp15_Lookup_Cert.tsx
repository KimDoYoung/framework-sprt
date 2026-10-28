/**
 * 증명서 발급 창 (S05) — Emp15_Tab_Cert의 [생성]이 연다
 * AS-IS: myApp/client/vi/emp/Emp15_Lookup_Cert.java (382줄) — 모달 680×300 "증명서 발급", insert(callBack) L81-93
 */
import React from 'react';
import { Emp15_CertEdit } from './Emp15_CertEdit';

interface Props {
  open: boolean;
  /** [상신] 저장이 끝난 뒤 — AS-IS callBack.execute() */
  onSaved: () => void;
  onClose: () => void;
}

export const Emp15_Lookup_Cert: React.FC<Props> = ({ open, onSaved, onClose }) =>
  open ? <Emp15_CertEdit width={680} onSaved={onSaved} onClose={onClose} /> : null;
