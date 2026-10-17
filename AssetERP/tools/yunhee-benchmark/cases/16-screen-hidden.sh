ID=16 CASE_REV=1 CAT=취약 FAST=1 NEEDS=""
DESC="[취약 036-2] 화면 클래스 목록이 new 로 만드는 서브 그리드·조회창 속 조회창을 (연결)로 보여 줌"
chk_src_has_new() {   # 소스가 실제로 그 클래스를 new 로 만든다 (기대 타당성)
  local f
  f=$(find "$SRC" -name 'Ics20_Edit_RevisionHistoryAdmin.java' -print -quit); [ -n "$f" ] && grep -q 'ics19_Grid_IcsList' "$f" && grep -q 'ics20_Grid_FileList' "$f" || return 1
  f=$(find "$SRC" -name 'Ics01_Lookup_SelectMulti.java' -print -quit); [ -n "$f" ] && grep -q 'new Ics01_Lookup_SelectParent(' "$f"
}
case_run() {
  yh analysis screen Ics20_Tab_RevisionHistoryAdmin --list -s "$SRC" --src-index "$IDX"
  yh analysis screen Ics10_Tab_ChecklistAdmin --list -s "$SRC" --src-index "$IDX"
  base_screen Ics20_Tab_RevisionHistoryAdmin
  base_screen Ics10_Tab_ChecklistAdmin
  expect "서브 그리드 ics19_Grid_IcsList" 'ics19_Grid_IcsList'
  expect "서브 그리드 ics20_Grid_FileList" 'ics20_Grid_FileList'
  expect "조회창 속 조회창 Ics01_Lookup_SelectParent" 'Ics01_Lookup_SelectParent'
  forbid "오류 출력" '\[ERROR\]|Traceback'
  indep "소스가 실제로 그 클래스를 new 로 만듦(기대 타당성)" chk_src_has_new
}
