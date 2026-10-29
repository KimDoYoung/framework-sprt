# yunhee page-style 판별 수정 요청

작성 2026-10-29. 대상: `yunhee page-style`(`--all`·`--json`·`--compare`)의 SID 판별기. 이 문서는 yunhee 쪽에 전달할 내용을 모은 것이다(yunhee 코드는 이 저장소에 없다 — 05 §7 "yunhee 수정사항 제안").
SID 정의는 `docs/page-style.md`, 견본은 `docs/page-style/{SID}/`.

## 0. yunhee에 요청하는 것 — 미결 목록 (2026-10-29, 0.6.8 기준)

0.6.8 평가 결과 §2 표의 46개 중 43개가 기대 SID로 나오고 `--all` 미분류는 0이다. 아래는 그 뒤 SID 체계를 바꾸면서 새로 생긴 요청이다. 자세한 증상·기대는 각 절을 본다. **이 목록이 모두 끝나면 §5 완료 기준을 다시 돌린다.**

| # | 요청 | 절 | 지금 증상 | 기대 |
|:-:|:---|:-:|:---|:---|
| 1 | SID 이름 `DB` → **`DSBRD`** | 4-2 | `yunhee page-style`이 `DB`로 출력한다. 선언 `스타일: DSBRD`와 달라 `--compare`에서 불일치로 보인다 | `Tdm50_Tab_TotalDashboard`·`Tdm35_Tab_TaskList` 모두 `DSBRD` |
| 2 | 선언 정규식 `[A-Z]{2,4}` → **`{2,5}`** | 4-2 | 5자 SID `DSBRD`를 읽지 못해 `declared`가 `null`이 된다 (SID 길이 규칙을 2~5자로 바꿨다) | `declared = DSBRD` |
| 3 | DSBRD **탭 없는 변형** 인식 | 4-2 | `Tdm35_Tab_TaskList`(기준일 툴바 + 엑셀다운로드 4줄)는 DSBRD인데, §2-1 신호("DSBRD는 탭이 있다")와 맞지 않는다 | 선언이 없어도 "툴바·그리드·트리 없음 + 조회/RD API 호출 + 메뉴 링크 없음"이면 DSBRD |
| 4 | SID **`MG` 폐지** (SGEF에 합침) | 4-3 | `Sys90_Tab_AfterService` 등 4개가 MG로 나온다 | 4개 모두 `SGEF` |
| 5 | 아래 폼이 **고정 높이 `div`**인 위아래 구조도 SGEF | 4-3 | `Splitter`가 없으면 `layout=none`이라 SGEF로 안 읽힌다 | "위 `SearchBar` + 그리드, 아래 `*_Edit_*`"이면 SGEF |
| 6 | MG 폐지 뒤 `Sms03_Tab_SendAdmin` | 4-3 | 지금은 MG로 판별된다 | `GDP`(요청 8번으로 해결) |
| 7 | 분포 출력의 SID 목록 갱신 | — | `--all` 분포가 `DB`·`MG`를 포함한다 | 19개 SID(`DSBRD`·`GDP` 포함, `MG` 없음) |
| 8 | 새 SID **`GDP`** (Grid+DetailPage) 판별 | 4-4 | `Sms02_Tab_TotalCount`·`Sys10_Tab_TotalSize`가 `GG`로(그리드 3개로 오집계), `Sms03_Tab_SendAdmin`은 `MG`로, `Ics02_Tab_Manager`는 다른 SID로 나온다 | 4개 모두 `GDP` |

화면을 열어 정하는 것(yunhee 수정 아님): `Pay31_Tab_InsureApply`(TP↔STP), `Pay20_Tab_Deduct`(TP↔STP), `Pay10_Tab_List`(STP↔SR), `Flt03_Tab_AccountReport`(0.6.8에서 SGTP → GG로 바뀜, 자식 grids=0이라 오판일 수 있음), 결과가 나오면 §2 표를 고치고 필요한 규칙을 이 목록에 보탠다.

완료된 요청: §4-1의 1·2·3번(0.6.7~0.6.8에서 반영, 평가 완료).

## 1. 지금 문제 (2026-10-29, TOBE `*_Tab_*.tsx` 311개)

분포(견본 정립 전): SG 83 · CG 73 · GG 46 · **미분류 40** · SGP 31 · SGTP 15 · SGEF 9 · TG 8 · SGT 4 · SGVF 2.
미분류 40개 중 이미 SID가 정해진 화면(아래 §2)도 판별기에 규칙이 없어 미분류로 나온다. 판별 오류(선언과 다름)도 있다.

| 증상 | 화면 | 선언 → 판별 |
|:---|:---|:---|
| 선언과 판별이 다름 | `Est02_Tab_PfResultReport` | GG → SGTP |
| | `Apr16_Tab_StampFileCheck` | SG → CG |
| | `Apr16_Tab_StampList` / `StampListOrg`, `Car04_Tab_*`(T11·T14), `Bbs20_Tab_FloralRequestMng` | 판별기 GG≠SG, SG≠CG 등 (작업기록 "결과확인 13") |
| 탭이 <Tabs>/<PageTabs>로 인라인이라 `tabpage` 아님 | `Rpt10_Tab_FssOrg`, `Pay20_Tab_Deduct` | → 미분류(그리드 없음) |
| 구조를 자식 컴포넌트에 맡김 | `Dcr01_Tab_DcrUser`, `Flt00_Tab_Info`, `Tdm35_Tab_TaskList` 등 | 특징이 전부 0 |

## 2. SID별 판별 규칙 (19개, 견본은 모두 확정 — 2026-10-29)

SID 정의는 `docs/page-style.md` "스타일 목록", 견본은 `docs/page-style/{SID}/`. 판별 특징 이름은 §4의 열 설명을 따른다. ★ = 이번에 새로 만든 SID(지금 판별기에 규칙이 없다).

| SID | 판별 규칙(제안) | 견본 | 같은 SID로 정한 다른 화면(검증용) |
|:---|:---|:---|:---|
| SG | 조회 툴바 + 그리드 하나 | `Tdm01_Tab_Hr` | — 지금도 판별됨 |
| SGP | SG + 편집 팝업(`*_Edit_*`) | `Chk02_Tab_DailyList` | — 지금도 판별됨 |
| SGVF | 위아래 분할 + 그리드 + 읽기 전용 폼 | `Fnd01_Tab_FundSearch` | — 지금도 판별됨 |
| SGEF | 위아래 분할 + 그리드 + 편집 폼 | `Fnd01_Tab_FundCode` | — 지금도 판별됨 |
| SGTP | 위아래 분할 + 그리드 + 아래 탭 영역 | `Fnd20_Tab_Plan` | — 지금도 판별됨 |
| GG | 그리드 2개(마스터·상세) | `Est02_Tab_PfResultReport` | `Est02`는 SGTP로 잘못 나온다(§1) |
| CG | 편집 가능한 그리드 하나 | `Apr10_Tab_Stamp` | — 지금도 판별됨 |
| SGT | 툴바 전체 폭 + 좌(그리드)·우(트리) 분할 | `Fnd08_Tab_OrgAuth` | — 지금도 판별됨 |
| TG | 트리 + 오른쪽 내용이 좌우 분할(오른쪽이 `SingleGrid`가 아니어도) | `Sys06_Tab_Menu` | `Dcr01_Tab_DcrManager`, `Dcr01_Tab_DcrUser`(껍데기), `Emp00_Tab_OrgPerson` |
| STP | 툴바(`SearchBar`) 있음 + 탭 컨테이너(`<Tabs>`·`<PageTabs>`·`*_TabPage_*`) 있음 + 그리드·트리 없음 | `Pay10_Tab_Retire` | `Biz01_Tab_LimitCheckList`, `Flt10_Tab_CeoReport`, `Pay10_Tab_List`, `Tdm50_Tab_CheckJob` |
| TP | 탭 컨테이너만 있고 툴바·그리드·트리 없음 | `Rpt10_Tab_FssOrg` | `Emp21_Tab_UnLeaveList`, `Pay20_Tab_DeductAdmin`, `Pay31_Tab_InsureApply`, `Pay20_Tab_Deduct` |
| SR | 툴바 있음 + RD 영역(`*_Rd_*` import·`iframe`) + 탭·그리드·트리 없음 | `Emp01_Tab_InoutState` | `Emp01_Tab_DueDiligence` |
| GCG | 위아래 분할 + 그리드 둘 + 달력(`Calendar`) | `Car03_Tab_List` | — |
| ★SGHF | 조회 줄 + 그리드 + 편집 폼을 **좌우**로 배치(`layout=horizontal`, edit 폼 있음) | `Biz01_Tab_Card` | `Biz01_Tab_Other`·`CardContents`·`CardSimple`·`OtherSimple`·`CardContentsSimple` |
| ★TO | 트리 중심, 오른쪽이 일반 그리드가 아님/없음, 편집은 팝업 | `Org01_Tab_OrgCode` | `Chk01_Tab_ClassTree`, `Fbx01_Tab_Document`(탭 페이지·편집 그리드가 함께 있어 TO가 아닐 수 있다) |
| ★GDP | 가로 `Splitter`, 왼쪽 = 버튼 줄(`SearchBar` 아님) + 그리드, 오른쪽 = `*_Page_*`/`*_TabPage_*` 상세 페이지(선택 행과 연동) | `Sms02_Tab_TotalCount` | `Sys10_Tab_TotalSize`, `Ics02_Tab_Manager`, `Sms03_Tab_SendAdmin`(왼쪽 아래 편집 폼 변형) |
| ★GO | 그리드 하나 + **직접 만든 조건 줄**(`SearchBar` 아님) 또는 조건 줄 없음 | `Tdm54_Tab_CheckInsuff` | `Sms02_Tab_TotalCount`, `Sys10_Tab_TotalSize`(조건 줄이 없는 화면일 수 있다) |
| ★DSBRD | 그리드·트리·툴바 없이 탭 + 카드/요약 영역(조회 API 호출, 값을 보여 준다) | `Tdm50_Tab_TotalDashboard` | `Tdm35_Tab_TaskList` |
| ★IN | 그리드·트리·폼·툴바·탭이 없고 안내 문구/링크(HTML)만 있는 문서 화면. **조회·저장 API 호출이 없고 `openMenuByNo` 같은 메뉴 열기 링크가 있다** | `Flt00_Tab_Info` | — |

SGP/SG, TP/TG 등 이미 판별되는 SID는 규칙을 바꾸지 말고 그대로 두고, 위 표의 ★와 STP·TP·SR·GCG·TG 규칙만 보강한다.

### 2-1. 특징값으로 구분이 안 되는 쌍

다음 SID는 `--json` 특징값(§4)이 전부 0이거나 비슷해서 **구조만으로는 갈리지 않는다**. 선언(`스타일: XXX`, §3-8)을 우선 읽고, 선언이 없을 때만 아래 보조 신호로 추정한다.

| 쌍 | 구분 신호 |
|:---|:---|
| IN ↔ DSBRD | 화면이 `*Api`(조회 API)를 import해 호출하는가. IN은 호출이 없고 DSBRD는 있다. DSBRD는 탭(`<PageTabs>`)이 있다 |
| IN ↔ TP | TP는 탭 컨테이너가 있다. IN은 탭이 없다 |
| GO ↔ SG | GO는 조건 줄이 `SearchBar`가 아니라 직접 만든 `div`(`Typography.Text`·`DatePicker` 직접 배치) |
| STP ↔ TP | `SearchBar` 또는 직접 만든 조건 줄 유무 |

## 3. 판별기에 필요한 기능 수정

1. **탭 인식**: `*_TabPage_*` import가 없어도 `<Tabs>`·`<PageTabs>`(`components/tabs`)가 있으면 `tabs: true`로 본다. `Rpt10_Tab_FssOrg`·`Pay20_Tab_Deduct`가 TP로 나와야 한다.
2. **STP/TP 구분**: 탭이 있을 때 `top_search`(`SearchBar`)가 있으면 STP, 없으면 TP. 직접 만든 조건 줄(`Tdm50_Tab_CheckJob`)도 STP로 읽는다.
3. **SR**: 탭이 없고 `top_search` + RD 영역(`*_Rd_*` import 또는 `iframe`)이면 SR.
4. **TG 확장**: `trees ≥ 1` + `layout=horizontal`이면 오른쪽이 `SingleGrid`가 아니어도 TG(`Dcr01_Tab_DcrManager`·`Emp00_Tab_OrgPerson`이 지금 "트리가 있으나 그리드와 좌우 분할이 아니다"로 빠진다).
5. **자식 컴포넌트 추적**: Tab 파일에 특징이 없으면 같은 폴더의 자식(`*_Page_*`·`*_Grid_*`·`*_Rd_*`)을 한 단계 따라가 합산한다.
   - **상속한 껍데기 화면**: 다른 `_Tab_` 컴포넌트를 import해 그대로 렌더링하는 짧은 화면(`Dcr01_Tab_DcrUser` → `Dcr01_Tab_DcrManager`, `Flt10_Tab_ViolateUser` → `Flt10_Tab_Violate`)은 **부모의 SID를 따른다**.
   - **세로 Splitter에 SG 두 개를 얹은 화면**(`Sys07_Tab_Company`: 위 버튼 줄 + 출발지/목적지 SG 둘): GG 변형으로 읽을지 규칙이 필요하다(열어서 최종 확인 전, 임시로 GG 후보).
6. **새 SID 규칙** SGHF·TO·GO·DSBRD·IN(§2). 특징 필드에 `calendar`(달력)·`rd`(RD 영역)·`tabs`(인라인 탭)·`api_calls`(조회/저장 API 호출 여부)·`menu_link`(`openMenuByNo` 등 메뉴 열기)를 추가해야 §2-1의 쌍이 갈린다.
7. **`--compare` 정확도**: AS-IS(GXT)와 TOBE(React)가 같은 SID인데 다르게 나오는 경우(GG≠SG, SG≠CG)가 있다. AS-IS 판별 규칙과 TOBE 판별 규칙의 기준을 같게 맞추거나, 불일치 이유를 `why`에 남긴다.
8. **선언 우선**: 화면 머리 주석 `스타일: XXX`(괄호 안 설명 제외)를 `declared`로 읽는다. 지금 `스타일: STP (견본 — docs/page-style.md)`처럼 뒤에 설명이 붙어도 SID만 읽어야 한다. 머리 주석은 `/** … */` 블록뿐 아니라 `// 스타일: IN …` 한 줄 주석도 읽어야 한다(`Flt00_Tab_Info`).
9. **SID 목록 동기화**: 유효한 SID 목록(19개)을 `docs/page-style.md`의 "스타일 목록" 표 첫 열에서 읽는다. 선언이 목록에 없는 SID면 경고한다.

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

## 4-1. 0.6.6 평가 결과와 남은 수정 (2026-10-29)

0.6.6에서 §2 표의 견본·검증 화면 46개 중 40개가 기대 SID로 나오고, `--all` 305개에서 미분류는 0이다. 남은 수정은 2건이었고(0.6.7에서 완료), 0.6.7 확인 후 3번이 추가됐다.

1. **TabPage 자식의 그리드를 합산하지 않는다** (§3-5 "`*_TabPage_*`는 0으로 센다"가 자식 추적 경로에서 지켜지지 않음).
   - 증상: `Sms02_Tab_TotalCount`, `Sys10_Tab_TotalSize`가 `grids: 3`, `tabpage: true`로 나와 GG가 된다. 실제 그리드는 왼쪽 1개이고 나머지 2개는 오른쪽 `*_TabPage_Detail` 안의 것이다.
   - 기대: GO (`grids: 1`, 조건 줄 없음). `--json`의 `grids`가 1이어야 한다.
2. **직접 만든 조건 줄을 `custom_search`로 읽어 STP로 판별한다** (§3-2).
   - 증상: `Tdm50_Tab_CheckJob`이 `custom_search: false`, `search: false`라서 TP가 된다. 이 화면은 `SearchBar`가 아니라 `Typography.Text`·`DatePicker` 등을 직접 배치한 `div` 조건 줄이 있다.
   - 기대: STP (탭이 있고 조건 줄이 `SearchBar` 또는 직접 만든 줄이면 STP).

> 0.6.7에서 위 1·2번은 고쳐졌다(`Sms02`·`Sys10` GO, `Tdm50_Tab_CheckJob` STP 확인). 아래 3번이 남았다.

3. **GG와 SGTP 구분: `*_TabPage_*` 이름만으로 탭 영역이라 보지 않는다** (0.6.7 확인).
   - 증상: 0.6.7에서 SGTP가 3 → 13개로 늘었다. 위아래 분할 + 그리드 하나 + 자식 `*_TabPage_*`이면 SGTP로 보는데, 이 이름은 아래 **그리드**에도 쓰인다(GG 견본 `Est03_TabPage_PfHistoryList`). 자식이 탭이 아니라 그리드인 화면이 SGTP로 옮겨 갔다.
   - GG여야 하는 후보 9개(자식 `*_TabPage_*`에 `<Tabs>`가 없고 그리드가 있다): `Dcr30_Tab_LinkAdmin`, `Fnd20_Tab_PlanEmp`, `Tdm36_Tab_RoleReport`, `Tdm41_Tab_ManlDutyOrg`, `Tdm43_Tab_ManlItemReg`, `Tdm51_Tab_CheckOrg`, `Tdm52_Tab_CheckManl`, `Tdm59_Tab_CheckAppr`, `Bmt01_Tab_Buy`(자식 확인 필요).
   - SGTP로 남는 화면(자식이 폼·탭 컨테이너): `Fnd20_Tab_Plan`(견본), `Emp00_Tab_TransInfo`(자식 17개), `Sys01_Tab_Company`(자식 5개), `Flt03_Tab_AccountReport`(확인 필요).
   - 기준(제안): 자식 `*_TabPage_*`가 `<Tabs>`·`<PageTabs>`를 갖거나 자식이 2개 이상(탭 페이지 전환)이면 SGTP. 자식이 하나이고 그 안에 그리드가 있으면 GG. 판별 근거 `why`에 어느 쪽으로 읽었는지 남긴다.
   - 기대: 위 GG 후보 9개가 GG, `Est02_Tab_PfResultReport`·`Fnd20_Tab_Plan`은 그대로. 고친 뒤 `--all` 분포의 SGTP가 4~5개 안팎으로 돌아온다. 후보 중 일부가 실제로는 SGTP일 수 있으니 화면을 열어 최종 확인한다.

**화면을 열어 확인할 것 (yunhee 수정 아님)**: 아래는 요청서 표 또는 규칙 우선순위가 틀렸을 수 있어, 화면을 직접 보고 SID를 정한 뒤 이 문서의 §2 표를 고친다.

| 화면 | 기대 → 판별 | 확인할 것 |
|:---|:--|:--|
| `Pay31_Tab_InsureApply` | TP → STP | **결정(2026-10-29)**: 툴바 없이 탭만 있어 TP가 맞다. 선언이 STP로 잘못 적혀 있던 것을 TP로 고쳤다. 판별기는 이제 TP로 나온다. |
| `Pay20_Tab_Deduct` | TP → STP | **결정(2026-10-29)**: 부모 `Pay20_Tab_DeductAdmin`이 TP라 TP. 선언이 STP로 잘못 적혀 있던 것을 고쳤다. |
| `Pay10_Tab_List` | STP → SR | `iframe`이 있어 SR로 갔다. 탭·RD 중 어느 쪽이 주인지 정하고, SR 규칙(`*_Rd_*` import 또는 iframe)과 STP 규칙의 우선순위를 정한다. |

## 4-2. SID `DB` → `DSBRD` 이름 변경 (2026-10-29, 0.6.8 이후 요청)

`DB`가 DataBase로 읽혀서 SID 이름을 **`DSBRD`**(Dashboard)로 바꿨다. 정의·견본 폴더(`docs/page-style/DSBRD/`)·화면 머리 주석(`스타일: DSBRD`)은 이미 바꿨다. yunhee 쪽에서 바꿀 것:

1. **SID 이름**: `page_style.py`의 `"DB"`(유효 SID 목록 `load_valid_sids` 대비 기본값 37행, 판별 517·521·568행 부근)를 `"DSBRD"`로 바꾼다. 출력(`yunhee page-style`, `--all` 분포)에도 `DSBRD`로 나와야 한다. 옛 이름 `DB` 선언은 경고로 알려 준다.
2. **선언 정규식**: `스타일:\s*([A-Z]{2,4})\b`는 5자 `DSBRD`를 읽지 못한다(`DSBRD`는 선언이 없는 것으로 보인다). `[A-Z]{2,5}`로 넓힌다. `load_valid_sids`도 `docs/page-style.md` "스타일 목록" 첫 열을 5자까지 읽는다. SID 길이 규칙은 2~5자로 바꿨다.
3. **탭이 없는 변형**: `Tdm35_Tab_TaskList`(기준일 툴바 + [엑셀다운로드] 4줄, `api_calls`는 `rdApi` 정도)도 DSBRD다. 지금 DSBRD 규칙은 "탭 + 카드/요약 영역"이라 §2-1의 `IN ↔ DSBRD` 구분 신호("DSBRD는 탭이 있다")가 맞지 않는다. 선언 `스타일: DSBRD`가 있으면 선언을 우선하고, 선언이 없을 때의 추정은 "툴바·그리드·트리 없음 + 조회 API 호출(또는 `rdApi`/`rdDownload`) + 안내 링크(`openMenuByNo`) 없음"이면 DSBRD로 본다.
4. 기대: `Tdm50_Tab_TotalDashboard`·`Tdm35_Tab_TaskList` 둘 다 `DSBRD`로 나온다.

## 4-3. SID `MG` 폐지 — SGEF에 합침 (2026-10-29)

견본 `Sys90_Tab_AfterService`가 세로 `Splitter` + 그리드 1개 + 편집 폼이라 구조가 SGEF와 같아, MG를 없애고 SGEF의 변형(폼 안에 보조 그리드)으로 합쳤다. `Sys90_Tab_AfterServiceAdmin`, `Ics20_Tab_RevisionHistory`·`Admin`도 SGEF다. yunhee에서 바꿀 것:

1. 유효 SID에서 `MG`를 뺀다(`load_valid_sids`는 `docs/page-style.md` 표에서 읽으므로 자동). 판별 규칙의 `MG` 분기를 없앤다.
2. 아래 폼이 **고정 높이 `div`**(`flex: 'none', height: 400, borderTop`)로 쌓인 위아래 구조도 SGEF로 읽는다(지금 `layout=none`이라 MG로 갔다). `Splitter`가 없어도 "위 `SearchBar` + 그리드, 아래 `*_Edit_*`"이면 SGEF다.
3. `Sms03_Tab_SendAdmin`(조건 줄 없는 좌우 분할, 그리드 3개 + 폼)은 SGEF가 아니다. 지금은 MG로 나오므로 MG를 없애면 `미분류`가 된다. 별도 SID가 정해질 때까지 미분류를 허용한다.
4. 기대: `Sys90_Tab_AfterService` 등 4개가 SGEF로 나온다.

## 4-4. 새 SID `GDP` (Grid+DetailPage) 판별 (2026-10-29)

`Sms02_Tab_TotalCount`·`Sys10_Tab_TotalSize`를 GO로 정했다가, 오른쪽에 상세 페이지(`*_TabPage_Detail`)가 있는 좌우 분할이라 GO(그리드 하나)가 아님을 확인해 새 SID로 뺐다. `Sms03_Tab_SendAdmin`(MG→미분류였음)과 `Ics02_Tab_Manager`도 같은 모양이다. 정의는 `docs/page-style.md` GDP 절.

1. **판별 규칙**: 가로 `Splitter`(또는 폭 고정 좌우) + 조건 줄이 `SearchBar`가 아님(버튼 줄) + 그리드 ≥ 1 + 오른쪽 자식이 `*_Page_*`/`*_TabPage_*`. `SearchBar`가 있으면 SGHF·SGT 쪽이다.
2. **그리드 오집계 방지**(0.6.7에서 TabPage 그리드를 세지 않게 했으나 `Sms02`·`Sys10`은 `grids: 3`으로 나와 GG가 된다): 오른쪽 `*_TabPage_Detail`의 그리드·탭을 이 화면의 그리드 수에 합산하지 않는다. 합산하면 `Sms02`·`Sys10`이 GG로 간다(GG 정의는 위아래 분할이다).
3. **GG와 구분**: GG는 위아래 `Splitter`(마스터·상세 그리드), GDP는 좌우 분할이고 오른쪽이 페이지 컴포넌트다.
4. **GO와 구분**: GO는 오른쪽이 없다(그리드 하나).
5. 기대: `Sms02_Tab_TotalCount`, `Sys10_Tab_TotalSize`, `Sms03_Tab_SendAdmin`, `Ics02_Tab_Manager` 모두 `GDP`.

## 5. 완료 기준

- `yunhee page-style --all`에서 `미분류`가 `_Tab_` 화면 기준 0에 가깝다(껍데기 화면은 부모를 따르고, 선언이 있는 화면은 선언이 우선이다).
- §2 표의 "견본"과 "같은 SID로 정한 다른 화면"이 모두 그 SID로 나온다.
- `yunhee page-style --compare`가 TOBE 머리 주석 선언과 판별을 비교해 불일치를 보고한다.
- §2-1의 쌍(IN↔DSBRD, IN↔TP, GO↔SG, STP↔TP)이 구분된다.
- 새 SID 5개(SGHF·TO·GO·DSBRD·IN)는 규칙이 확정이 아니다. 같은 SID로 묶은 화면을 실제로 맞추면서 규칙을 다시 조정한다.
