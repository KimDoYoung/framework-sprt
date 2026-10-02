# 공통 버튼 이름표 (Button type)

AS-IS AssetERP `myApp/client/color/ColorButtonBar.java`(293줄)는 **버튼 제목 문자열**로 색·아이콘을 정한다(`text.equals("조회")` 분기 약 30개, 제목 306개).
TOBE는 제목이 아니라 **`type`(의미)** 으로 정한다. 제목은 글자일 뿐이다.

```tsx
import { Button } from '@/components/button';   // antd Button 대신 (화면에서는 이것만 쓴다)

<Button type="search" onClick={retrieve}>조회</Button>
<Button type="delete" onClick={unlink}>연결제거</Button>
<Button type="primary" onClick={…}>확인</Button>   // antd 원래 type도 그대로 동작
```

- 이 표의 **type 이름이 ID**다. yunhee 변환 명세와 TOBE 코드는 이 이름만 쓴다. type에 오타가 있으면 타입체크(`tsc`)에서 걸린다.
- "제목 → type" 대응은 **yunhee만 쓴다**(변환 시). yunhee가 `ColorButtonBar.java`의 분기를 읽어 제목을 분기에 넣고, 분기 → type은 아래 표를 쓴다.
  화면의 `new ColorButtonBar("연결제거")` → 명세에 `<Button type="delete">연결제거</Button>`.
- 표에 없는 제목은 yunhee가 `⚠ type 미정 "제목"`으로 표시하고, 변환할 때 아래 type 중 하나를 고른다(진회색 버튼을 조용히 만들지 않는다).
- 상태: TOBE `components/button`은 아직 만들지 않았다(이 표가 먼저).

## type 표

AS-IS 줄은 `ColorButtonBar.java` 기준. 색 이름은 아래 "색" 표.

| type | 색 | 아이콘 (antd ← AS-IS FontAwesome) | AS-IS 제목 예 | AS-IS 줄 |
|:---|:---|:---|:---|:---|
| `search` | blue | `SearchOutlined` ← fa-search | 조회, 검색, 찾기, 기간조회, 내역상세, 문서보기 | L66-70 |
| `addRow` | blue | `PlusOutlined` ← fa-plus | 행 추가, 전체선택, 분류추가, 직원추가, 부서추가, 계좌추가 | L72-77 |
| `unassign` | blue | `UserDeleteOutlined` ← fa-user-times | 없음 | L78-81 |
| `send` | blue | `MailOutlined` ← fa-envelope | 개별전송, 전체전송, 메일발송, 발송, 알림발송 | L83-87 |
| `calculate` | blue | `CalculatorOutlined` ← fa-calculator | 계산하기 | L279-282 |
| `save` | mint | `CheckOutlined` ← fa-check | 저장, 반영, 확정, 승인, 마감, 처리, 확인, 제출, 잠금 | L91-104 |
| `expand` | mint | `PlusSquareOutlined` ← far fa-plus-square | 펼치기, 활성화 | L106-109 |
| `collapse` | mint | `MinusSquareOutlined` ← far fa-minus-square | 감추기, 비활성화 | L111-114 |
| `bookmark` | mint | `BookOutlined` ← fa-bookmark (antd에 bookmark 없음) | 북마크 | L116-119 |
| `plus` | mint | `PlusOutlined` ← fa-plus, **아이콘만** | "+" | L121-124 |
| `minus` | mint | `MinusOutlined` ← fa-minus, **아이콘만** | "-" | L126-129 |
| `delete` | red | `DeleteOutlined` ← fa-trash | 삭제, 전체삭제, 연결제거, 전표삭제, 제거 | L133-137 |
| `removeRow` | red | `MinusOutlined` ← fa-minus | 행 삭제, 전체해제, 차단해제, 알림해제 | L139-142 |
| `cancel` | red | `StopOutlined` ← fa-ban | 취소, 마감취소, 확정취소, 승인취소, 반려, 차단, 잠금해제, 전체로그아웃 | L144-152 |
| `move` | red | `SwapOutlined` ← fa-exchange-alt | 문서이동(내부통제) | L272-275 |
| `upload` | orange | `UploadOutlined` ← fa-upload | 파일업로드, 엑셀업로드, 로고등록 | L156-159 |
| `download` | orange | `DownloadOutlined` ← fa-download | 다운로드, 엑셀다운로드, 템플릿, 출력/다운로드, 가져오기 | L161-166 |
| `view` | orange | `EyeOutlined` ← fa-eye | 기록보기, 오타수정, 전표확인, 첨부파일관리, 작성요령, 새로작성 | L168-176 |
| `goto` | orange | `ArrowRightOutlined` ← fa-arrow-right | 거래처 관리 바로가기, DART 바로가기 | L178-182 |
| `group` | orange | `TeamOutlined` ← fa-users | 그룹, 그룹설정, 담당그룹 관리, 운용사코드 등록 | L184-187 |
| `assign` | orange | `CheckOutlined` ← fa-check | 담당그룹 지정, 엑셀업로드 설정, 커스텀 설정, 담당자 변경 | L189-194 |
| `close` | orange | `StopOutlined` ← fa-ban | 계좌폐쇄, 폐쇄취소, 미체결, 미체결취소 | L196-199 |
| `print` | darkGray | `PrinterOutlined` ← fa-print | 프린트 | L203-206 |
| `attach` | darkGray | `FolderAddOutlined` ← fa-folder-plus | 첨부파일등록 | L208-211 |
| `org` | darkGray | `TeamOutlined` ← fa-users | 조직도보기, 담당자 관리, 초기설정 휴가일수 | L213-216 |
| `reset` | lightBlue | `UndoOutlined` ← fa-undo-alt | 초기화, 재생성, 새로고침, 복구, 조건 초기화 | L220-224 |
| `change` | lightBlue | `SwapOutlined` ← fa-exchange-alt | 변경, 상위조직변경, 매뉴권한복사, 문서개요복사, 코드복사 | L226-231 |
| `register` | green | `EditOutlined` ← fa-edit | 등록, 등록(복사), 추가, 불러오기, 신규등록, 상신, 결재요청 | L235-256 |
| `generate` | green | `AimOutlined` ← fa-bullseye | 생성, PDF 생성, 일괄생성, 건별생성 | L258-262 |
| `select` | green | `LeftCircleOutlined` ← fa-arrow-alt-circle-left | 선택 | L264-268 |
| `settings` | dark | `SettingOutlined` ← fa-cog | 기본설정 | L61-64 |
| `shortcut` | mainTheme | 아이콘만 (AS-IS `ResourceIcon.arrowGo`, 40×30) | 바로가기 | L285-291 |

- `register`는 AS-IS 분기 두 개(L235-248, L250-256)가 색·아이콘이 같아 하나로 합쳤다.
- `save`(mint)와 `assign`(orange), `cancel`(red)과 `close`(orange)는 아이콘이 같고 색이 다르다. AS-IS 모양을 맞추려고 나눠 두었고, 쓰면서 합칠 수 있다.
- AS-IS 분기 우선순위: 독립된 `if` 묶음이 차례로 실행되므로 같은 제목이 두 묶음에 있으면 뒤 묶음이 이긴다(현재는 같은 묶음 안 중복만 있음: 마감취소·확정취소·제출취소·부서책무담당자 관리).

## 색 (AS-IS `color/styles.gss`)

채운 버튼(solid), 흰 글자. AS-IS 글자: 12px, 글자 간격 2px.

| 색 이름 | 배경 | hover | AS-IS 클래스 |
|:---|:---|:---|:---|
| blue | `#456EA6` | `#597EB1` | buttonColorBlue |
| mint | `#17A2B8` | `#3CC0D5` | buttonColorMint |
| red | `#DD5E5E` | `#D99191` | buttonColorRed |
| orange | `#E89646` | `#DDA977` | buttonColorOrange |
| green | `#2EAC7E` | `#4EBE95` | buttonColorGreen |
| lightBlue | `#6AB6CF` | `#A9CDD8` | buttonColorlightBrue |
| darkGray | `#646362` | `#7B7977` | buttonColorDarkGray |
| dark | `#343A40` (테두리 `#495057`) | `#495057` | buttonColorDark |
| mainTheme | `#F7F8FC` (테두리 `#E2E6EF`) | `#EBECF0` | mainThemeButton |
| (default) | `#4D4D4D` | `#6B6B6B` | buttonColorDefault — 표에 없는 제목. TOBE에서는 쓰지 않는다 |

AS-IS의 글자 수별 고정 폭(1자 29px … 12자 210px, L32-56)은 옮기지 않는다(내용에 맞춤).

## 사용 통계 (AssetERP `vi/`, `new ColorButtonBar("…")`)

- 2,549회, 제목 333종. 모두 문자열 상수라 yunhee가 정적으로 판정할 수 있다.
- 상위: 조회 707 · 삭제 285 · 등록 276 · 저장 255 · 행 삭제 76 · 행 추가 71 (6개가 약 65%).
- 표에 없는 제목 51종(75회) → `⚠ type 미정`. 많은 것: 기초데이터생성 9, 닫기 6, 파일등록 4, 가져오기(ICAM)·ICAM가져오기 각 3.

## OMS (`myOms/client/component/button/OmsButton.java`)

OMS는 `new OmsButton("조회", Variant.INFO)`처럼 Variant로 정하지만 색 값은 위 팔레트와 같다(INFO `#456EA6`=blue, CONFIRM `#17A2B8`=mint,
DANGER `#DD5E5E`=red, WARNING `#E89646`=orange, SUCCESS `#2EAC7E`=green). 변환할 때도 **제목으로 type을 정한다**
(조회→search, 저장→save, 삭제→delete, 등록→register). 제목이 표에 없을 때만 Variant를 참고한다.
OMS 모양은 테두리만 있는 outline이지만 TOBE는 하나(solid)로 통일한다.

## 아직 정하지 않은 것

- 대화상자 아래 버튼: AssetERP `ColorButtonBottom`, OMS `DialogButton`(닫기·확인·저장). 같은 `Button`의 type으로 넣을지 따로 둘지 클래스를 보고 정한다.
- 툴바 `ButtonBar`(북쪽 50px, 라벨 + 입력 + 버튼 순서)는 `Button`과 별개 컴포넌트로 둔다.
