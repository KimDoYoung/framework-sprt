/** 법규에 연결된 책무이행점검항목 한 행 (AS-IS Tdm45_ManlRelateIcsModel 중 Ics01_Lookup_RelateTdm 그리드 열) */
export interface ManlRelateIcs {
  manlRelateIcsId: number;
  manlId: number;
  icsClassTreeId?: number | null;
  roleName?: string | null;
  taskName?: string | null;
  taskDetailName?: string | null;
  taskDutyName?: string | null;
  taskCheckItem?: string | null;
  taskCheckHow?: string | null;
}

/** 연결할 책무이행점검항목 한 행 (AS-IS Tdm43_ManlModel 중 Ics01_Lookup_SelectTdm 그리드 열) */
export interface Manl {
  manlId: number;
  manlCode?: string | null;
  roleName?: string | null;
  taskRelateDutyName?: string | null;
  checkItemAddCode?: string | null;
  checkHow?: string | null;
}
