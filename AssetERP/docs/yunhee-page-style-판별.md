# yunhee page-style 판별 수정 요청

작성 2026-10-29. 대상: `yunhee page-style`(`--all`·`--json`·`--compare`)의 SID 판별기. 이 문서는 yunhee 쪽에 전달할 내용을 모은 것이다(yunhee 코드는 이 저장소에 없다 — 05 §7 "yunhee 수정사항 제안").
SID 정의는 `docs/page-style.md`, 견본은 `docs/page-style/{SID}/`.

## 1. 지금 문제 (2026-10-29, TOBE `*_Tab_*.tsx` 311개)

분포: SG 83 · CG 73 · GG 46 · **미분류 40** · SGP 31 · SGTP 15 · SGEF 9 · TG 8 · SGT 4 · SGVF 2.
미분류 40개 중 이미 SID가 정해진 화면(아래 §2)도 판별기에 규칙이 없어 미분류로 나온다. 판별 오류(선언과 다름)도 있다.

| 증상 | 화면 | 선언 → 판별 |
|:---|:---|:---|
| 선언과 판별이 다름 | `Est02_Tab_PfResultReport` | GG → SGTP |
| | `Apr16_Tab_StampFileCheck` | SG → CG |
| | `Apr16_Tab_StampList` / `StampListOrg`, `Car04_Tab_*`(T11·T14), `Bbs20_Tab_FloralRequestMng` | 판별기 GG≠SG, SG≠CG 등 (작업기록 "결과확인 13") |
| 탭이 <Tabs>/<PageTabs>로 인라인이라 `tabpage` 아님 | `Rpt10_Tab_FssOrg`, `Pay20_Tab_Deduct` | → 미분류(그리드 없음) |
| 구조를 자식 컴포넌트에 맡김 | `Dcr01_Tab_DcrUser`, `Flt00_Tab_Info`, `Tdm35_Tab_TaskList` 등 | 특징이 전부 0 |

## 2. 추가할 SID 규칙

SID는 `docs/page-style.md` "스타일 목록"에 등록된 것이다(★ = 이번에 새로 제안, 견본은 사용자가 검토해 확정할 예정).

| SID | 판별 규칙(제안) | 이미 이 SID로 정한 화면(검증용) |
|:---|:---|:---|
| **STP** | 툴바(`SearchBar`) 있음 + 탭 컨테이너(`<Tabs>`·`<PageTabs>`·`*_TabPage_*`) 있음 + 그리드·트리 없음 | `Pay10_Tab_Retire`(견본), `Biz01_Tab_LimitCheckList`, `Flt10_Tab_CeoReport`, `Pay10_Tab_List` |
| **TP** | 탭 컨테이너만 있고 툴바·그리드·트리 없음 | `Rpt10_Tab_FssOrg`(견본), `Emp21_Tab_UnLeaveList`, `Pay20_Tab_DeductAdmin`, `Pay31_Tab_InsureApply`, `Pay20_Tab_Deduct` |
| **SR** | 툴바 있음 + RD 영역(`*_Rd_*`·iframe) + 탭·그리드·트리 없음 | `Emp01_Tab_InoutState`(견본), `Emp01_Tab_DueDiligence` |
| **GCG** | 위아래 분할 + 그리드 둘 + 달력(`Calendar`) | `Car03_Tab_List`(견본) |
| **TG** | 트리 + 오른쪽 내용이 좌우 분할(오른쪽이 `SingleGrid`가 아니어도) | `Sys06_Tab_Menu`(견본), `Dcr01_Tab_DcrManager`, `Emp00_Tab_OrgPerson` |
| **SGT** | 툴바 전체 폭 + 좌(그리드)·우(트리) 분할 | `Fnd08_Tab_OrgAuth`(견본) — 지금도 판별됨 |
| **CG** | 편집 가능한 그리드 하나(툴바는 버튼 줄) | `Apr10_Tab_Stamp`(견본) — 지금도 판별됨 |
| ★**SGHF** | 조회 줄 + 그리드 + 편집 폼을 **좌우**로 배치(`layout=horizontal`, edit 폼 있음) | `Biz01_Tab_Card`·`Other`·`CardContents`·`CardSimple`·`OtherSimple`·`CardContentsSimple` |
| ★**MG** | 조회 줄 + 그리드 2개 이상 + 편집/보기 폼, 위아래 분할 아님(`layout=none`) | `Sys90_Tab_AfterService`·`AfterServiceAdmin`, `Ics20_Tab_RevisionHistory`·`Admin`, `Sms03_Tab_SendAdmin` |
| ★**TO** | 트리 중심, 오른쪽이 일반 그리드가 아님/없음, 편집은 팝업 | `Org01_Tab_OrgCode`, `Chk01_Tab_ClassTree`, `Fbx01_Tab_Document` |
| ★**GO** | 그리드 하나, 조회 툴바 없음 | `Tdm54_Tab_CheckInsuff`, `Sms02_Tab_TotalCount`, `Sys10_Tab_TotalSize` |
| ★**DB** | 그리드·트리·툴바 없이 카드/요약 영역(대시보드) | `Tdm50_Tab_TotalDashboard`, `Tdm35_Tab_TaskList` |

TO·GO·DB·MG는 이름과 규칙이 대표 화면을 열어 보면 바뀔 수 있다(사용자 검토 뒤 이 문서와 `page-style.md`를 같이 고친다).

## 3. 판별기에 필요한 기능 수정

1. **탭 인식**: `*_TabPage_*` import가 없어도 `<Tabs>`·`<PageTabs>`(`components/tabs`)가 있으면 `tabs: true`로 본다. `Rpt10_Tab_FssOrg`·`Pay20_Tab_Deduct`가 TP로 나와야 한다.
2. **STP/TP 구분**: 탭이 있을 때 `top_search`(`SearchBar`)가 있으면 STP, 없으면 TP.
3. **SR**: 탭이 없고 `top_search` + RD 영역(`*_Rd_*` import 또는 `iframe`)이면 SR.
4. **TG 확장**: `trees ≥ 1` + `layout=horizontal`이면 오른쪽이 `SingleGrid`가 아니어도 TG(`Dcr01_Tab_DcrManager`·`Emp00_Tab_OrgPerson`이 지금 "트리가 있으나 그리드와 좌우 분할이 아니다"로 빠진다).
5. **자식 컴포넌트 추적**: Tab 파일에 특징이 없으면 같은 폴더의 자식(`*_Page_*`·`*_Grid_*`·`*_Rd_*`)을 한 단계 따라가 합산한다(`Dcr01_Tab_DcrUser`·`Flt00_Tab_Info` 등).
6. **새 SID 규칙** SGHF·MG·TO·GO·DB(§2). 특징 필드에 `calendar`(달력)·`rd`(RD 영역)·`tabs`(인라인 탭)를 추가해야 한다.
7. **`--compare` 정확도**: AS-IS(GXT)와 TOBE(React)가 같은 SID인데 다르게 나오는 경우(GG≠SG, SG≠CG)가 있다. AS-IS 판별 규칙과 TOBE 판별 규칙의 기준을 같게 맞추거나, 불일치 이유를 `why`에 남긴다.
8. **선언 우선**: 화면 머리 주석 `스타일: XXX`(괄호 안 설명 제외)를 `declared`로 읽는다. 지금 `스타일: STP (견본 — docs/page-style.md)`처럼 뒤에 설명이 붙어도 SID만 읽어야 한다.

## 4. 현재 미분류 화면의 특징값 (2026-10-29 `--json`)

`s` = SearchBar, `g` = 그리드 수, `t` = 트리 수, `e` = 폼(edit/view), `p` = 팝업, `tp` = `*_TabPage_*`, 그 뒤 `layout`, `ts` = 상단 검색, `eg` = 편집 그리드.

| 클래스 | s | g | t | e | p | tp | layout | ts | eg |
|:---|:--:|:--:|:--:|:--|:--:|:--:|:--|:--:|:--:|
| Biz01_Tab_Card | 1 | 4 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_CardContents | 1 | 4 | 0 | edit | 0 | 0 | horizontal | 1 | 0 |
| Biz01_Tab_CardContentsSimple | 1 | 1 | 0 | edit | 0 | 0 | horizontal | 1 | 0 |
| Biz01_Tab_CardSimple | 1 | 1 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_Other | 1 | 4 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_OtherSimple | 1 | 1 | 0 | edit | 0 | 0 | horizontal | 0 | 0 |
| Biz01_Tab_LimitCheckList | 1 | 0 | 0 | - | 0 | 1 | none | 1 | 0 |
| Chk01_Tab_ClassTree | 0 | 0 | 1 | - | 1 | 0 | none | 0 | 1 |
| Dcr01_Tab_DcrManager | 0 | 0 | 1 | - | 0 | 0 | horizontal | 0 | 0 |
| Dcr01_Tab_DcrUser | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Emp00_Tab_OrgPerson | 1 | 0 | 1 | - | 0 | 0 | horizontal | 1 | 0 |
| Emp01_Tab_DueDiligence | 1 | 0 | 0 | - | 0 | 0 | none | 1 | 0 |
| Emp01_Tab_InoutState | 1 | 0 | 0 | - | 0 | 0 | none | 1 | 0 |
| Emp21_Tab_UnLeaveList | 0 | 0 | 0 | - | 0 | 1 | none | 0 | 0 |
| Fbx01_Tab_Document | 1 | 0 | 1 | - | 0 | 1 | vertical | 0 | 1 |
| Flt00_Tab_Info | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Flt10_Tab_CeoReport | 1 | 0 | 0 | - | 0 | 1 | none | 1 | 0 |
| Flt10_Tab_ViolateUser | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Ics20_Tab_RevisionHistory | 1 | 3 | 0 | view | 0 | 0 | none | 1 | 0 |
| Ics20_Tab_RevisionHistoryAdmin | 1 | 5 | 0 | edit | 0 | 0 | none | 1 | 0 |
| Org01_Tab_OrgCode | 0 | 0 | 1 | - | 1 | 0 | none | 0 | 0 |
| Pay10_Tab_List | 1 | 0 | 0 | - | 0 | 0 | none | 1 | 1 |
| Pay10_Tab_Retire | 1 | 0 | 0 | - | 0 | 1 | none | 1 | 1 |
| Pay20_Tab_Deduct | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Pay20_Tab_DeductAdmin | 0 | 0 | 0 | - | 0 | 1 | none | 0 | 0 |
| Pay31_Tab_InsureApply | 0 | 0 | 0 | - | 0 | 1 | none | 0 | 0 |
| Rpt10_Tab_FssOrg | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Sms02_Tab_TotalCount | 0 | 1 | 0 | - | 0 | 1 | horizontal | 0 | 0 |
| Sms03_Tab_SendAdmin | 0 | 3 | 0 | edit | 0 | 0 | none | 0 | 0 |
| Sys07_Tab_Company | 0 | 0 | 0 | - | 0 | 0 | vertical | 0 | 0 |
| Sys10_Tab_TotalSize | 0 | 1 | 0 | - | 0 | 1 | horizontal | 0 | 0 |
| Sys90_Tab_AfterService | 1 | 3 | 0 | edit | 0 | 0 | none | 1 | 0 |
| Sys90_Tab_AfterServiceAdmin | 1 | 3 | 0 | edit | 0 | 0 | none | 1 | 0 |
| Tdm35_Tab_TaskList | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Tdm50_Tab_CheckJob | 0 | 0 | 0 | - | 1 | 1 | none | 0 | 1 |
| Tdm50_Tab_TotalDashboard | 0 | 0 | 0 | - | 0 | 0 | none | 0 | 0 |
| Tdm54_Tab_CheckInsuff | 0 | 1 | 0 | - | 0 | 0 | none | 0 | 0 |

(`Car03_Tab_List`·`Car03_Tab_DayofMonth`(GCG), `Cmp10_Edit_Tab_MailBook`(`_Tab_`이 아닌 편집 부품)는 표에서 뺐다.)

## 5. 완료 기준

- `yunhee page-style --all`에서 `미분류`가 `_Tab_` 화면 기준 0에 가깝고(자식 컴포넌트 판별 불가 화면만 남는다), 위 표의 "이미 이 SID로 정한 화면"이 모두 그 SID로 나온다.
- `yunhee page-style --compare`가 TOBE 머리 주석 선언과 판별을 비교해 불일치를 보고한다.
- 새 SID 5개(SGHF·MG·TO·GO·DB)는 견본이 확정되면 규칙을 다시 맞춘다.
